const http = require('http');
const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const PORT = 8765;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.pdf':  'application/pdf',
};

// Sensitive files that should never be served
const BLOCKED_FILES = ['server.js', '.env', 'package.json', 'package-lock.json', '.git'];

http.createServer((req, res) => {
  // 1. Sanitize URL and prevent Basic Path Traversal
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.normalize(path.join(ROOT, urlPath));
  const ext = path.extname(filePath).toLowerCase();

  // 2. Validate requested path is within ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden: Potential Path Traversal');
    return;
  }

  // 3. API Endpoints (Local Only) - MUST BE CHECKED BEFORE STATIC FILE SYSTEM
  if (req.method === 'POST' && urlPath === '/api/ai-curate') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { history } = JSON.parse(body);
        
        // SINGLE SOURCE OF TRUTH: Read from external project
        const instructionsPath = path.join(ROOT, '../luxury-travel-curator/SYSTEM_INSTRUCTIONS.md');
        let systemPrompt = '';
        if (fs.existsSync(instructionsPath)) {
          systemPrompt = fs.readFileSync(instructionsPath, 'utf8');
        } else {
          systemPrompt = "You are the OdusIA Luxury Travel Curator. Stay in character.";
        }

        // --- 1. CONSTRUCT THE HARDENED PROMPT ---
        const finalSystemPrompt = 
          `[PROTOCOLLO TECNICO — PRIORITÀ ASSOLUTA]:\n\n` +
          `🚦 REGOLA CRITICA DI FLUSSO:\n` +
          `Se il messaggio contiene un LUOGO, genera IMMEDIATAMENTE il Report completo. NON chiedere parametri mancanti.\n` +
          `Default se non specificato: PREZZO €150-400, SPA di buona qualità, FOCUS relax e lusso.\n\n` +
          `🛠️ FORMATO TABELLA (OBBLIGATORIO — HTML puro, NON markdown |col|):\n` +
          `Prima cella <td> di ogni riga hotel:\n` +
          `  <td><strong>Nome Hotel</strong> (Rating: 9.8)<br><span class="hotel-location">📍 Città (Provincia)</span><div class="hotel-btns"><a href="https://url.com" class="btn-vai-sito" target="_blank">↗ VAI AL SITO</a>[[IMPORT:Nome Hotel|https://url.com|€MIN-€MAX/notte|XXX km, Xh via A7|Descrizione SPA|800 mq|1|1|Città|REGIONE|Breve descrizione|Highlight1;Highlight2|9.8]]</div></td>\n` +
          `[[IMPORT]] ha 13 campi: Nome|URL|Prezzo|Distanza|TipoSPA|DimSPA|PiscIN|PiscOUT|Città|REGIONE|Desc|Highlights|Rating\n` +
          `⚠️ ANTIDOTO MEDIOCRITÀ: Rating OBBLIGATORIO visibile nel testo (es. "Hotel Luxe (Rating: 9.5)"). Se non sai i mq della SPA, stima (es. 800 mq). Almeno 3 highlights reali.\n\n` +
          `🛠️ ALTRI MARCATORI UI:\n` +
          `- Fine report: [[ARCHIVE]]\n\n` +
          `❌ VIETATO: blocchi di codice \`\`\`html o \`\`\`markdown.\n\n` +
          `--- PERSONA E CONTENUTO ---\n${systemPrompt}`;

        // MANUALLY LOAD DOTENV without node dependencies
        let apiKey = process.env.GOOGLE_API_KEY;
        try {
          const envPath = path.join(ROOT, '../luxury-travel-curator/.env');
          if (!apiKey && fs.existsSync(envPath)) {
            const match = fs.readFileSync(envPath, 'utf8').match(/GOOGLE_API_KEY=(.*)/);
            if (match) apiKey = match[1].trim();
          }
        } catch(err) {}

        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Missing GOOGLE_API_KEY." }));
        }

        const https = require('https');
        const MODEL_CASCADE = [
          'gemini-3-flash-preview',
          'gemini-2.5-flash',
          'gemini-3.1-flash-lite-preview',
          'gemini-1.5-flash' // Paracadute finale
        ];

        const tryAIRequest = (index) => {
          if (index >= MODEL_CASCADE.length) {
            console.error("[AI CASCADE] Tutti i modelli sono esauriti.");
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "Saturazione Intelligence", details: "Tutti i modelli disponibili hanno esaurito la quota." }));
          }

          const currentModel = MODEL_CASCADE[index];
          console.log(`[AI CASCADE] Tentativo: ${currentModel} (Step ${index + 1}/${MODEL_CASCADE.length})`);

          const payload = JSON.stringify({
            system_instruction: { parts: [{ text: finalSystemPrompt }] },
            contents: history || [] 
          });

          const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${currentModel}:generateContent?key=${apiKey}`,
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json', 
              'Content-Length': Buffer.byteLength(payload) 
            }
          };

          const aiReq = https.request(options, (aiRes) => {
            let aiData = '';
            aiRes.on('data', d => aiData += d);
            aiRes.on('end', () => {
              try {
                // Se lo status è 429 (Too Many Requests), prova il prossimo modello
                if (aiRes.statusCode === 429) {
                  console.warn(`[AI CASCADE] ${currentModel} ha esaurito la quota (429). Scalo al prossimo.`);
                  return tryAIRequest(index + 1);
                }

                const result = JSON.parse(aiData);
                
                // Se c'è un errore di quota nel corpo del JSON (anche con status 200/400)
                if (result.error && (result.error.message.includes("quota") || result.error.status === "RESOURCE_EXHAUSTED")) {
                  console.warn(`[AI CASCADE] ${currentModel} segnala quota esaurita. Scalo al prossimo.`);
                  return tryAIRequest(index + 1);
                }
                
                if (result.error) throw new Error(result.error.message);
                
                let text = result.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (!text) {
                  console.warn(`[AI CASCADE] ${currentModel} ha restituito un corpo vuoto.`);
                  return tryAIRequest(index + 1);
                }
                
                // We let the client handle UI tag substitution after Markdown parsing

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                  text: text, 
                  model: currentModel.toUpperCase().replace(/-/g, ' ') 
                }));

              } catch (ep) {
                console.error(`[AI CASCADE] Errore critico nel parsing di ${currentModel}:`, ep);
                // In caso di errore di parsing, proviamo comunque l'altro modello come fallback estremo
                if (index < MODEL_CASCADE.length - 1) return tryAIRequest(index + 1);
                
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Errore Finale AI", details: aiData }));
              }
            });
          });

          aiReq.on('error', e => {
            console.error(`[AI CASCADE] Errore connessione per ${currentModel}:`, e);
            tryAIRequest(index + 1);
          });

          aiReq.write(payload);
          aiReq.end();
        };

        // Inizia la cascata dal primo modello
        tryAIRequest(0);
        
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Errore interno del server.' }));
      }
    });
    return;
  }

  if (req.method === 'POST' && urlPath === '/api/archive-curation') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { content, location } = JSON.parse(body);
        const date = new Date().toISOString().split('T')[0];
        const safeLocation = (location || 'Curation').replace(/[^a-z0-9]/gi, '_').substring(0, 50);
        const fileName = `${date}_${safeLocation}.md`;
        const savePath = path.join(ROOT, 'curations', fileName);
        
        // Wrap content in a basic markdown structure
        const fileContent = `# OdusIA Travel Curation: ${location || 'Luxury Intelligence'}\nDate: ${new Date().toLocaleString()}\n\n---\n\n${content}`;
        
        fs.writeFile(savePath, fileContent, (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "Failed to write file" }));
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, fileName }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid payload" }));
      }
    });
    return;
  }

  if (req.method === 'POST' && urlPath === '/api/save-repo') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const repoData = JSON.parse(body);
        const constantsPath = path.join(ROOT, 'js', 'constants.js');
        
        fs.readFile(constantsPath, 'utf8', (err, content) => {
          if (err) {
            res.writeHead(500);
            return res.end('Error reading constants.js');
          }
          
          const regex = /export const HOTEL_REPOSITORY = \[[\s\S]*?\];/;
          const newRepoString = `export const HOTEL_REPOSITORY = ${JSON.stringify(repoData, null, 2)};`;
          const newContent = content.replace(regex, newRepoString);
          
          fs.writeFile(constantsPath, newContent, (err) => {
            if (err) {
              res.writeHead(500);
              return res.end('Error writing constants.js');
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          });
        });
      } catch (e) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
    return;
  }

  // 3. Block sensitive files or unknown extensions for literal file serving
  const fileName = path.basename(filePath);
  if (BLOCKED_FILES.includes(fileName) || !MIME[ext]) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden: Access Denied');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // 5. Add Security & Anti-Cache Headers
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https://images.unsplash.com; frame-src 'self' blob:; connect-src 'self' blob:; object-src 'self' blob:;",
      'Referrer-Policy': 'no-referrer-when-downgrade'
    });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log('Travel Manager SECURITY HARDENED server running at http://localhost:' + PORT);
});
