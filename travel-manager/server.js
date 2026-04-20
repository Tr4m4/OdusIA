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

        // Add mandatory instructions to ensure the bot generates HTML for the UI
        const finalSystemPrompt = `${systemPrompt}\n\nIMPORTANT: Respond ONLY in HTML format (div, table, etc.). Do not use markdown code blocks like \`\`\`html. Formatta il report con eleganza dorata. Tutti i link devono avere target="_blank".`;

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
          return res.end(JSON.stringify({ error: "Missing GOOGLE_API_KEY. Assicurati che ../luxury-travel-curator/.env esista." }));
        }

        const https = require('https');
        const payload = JSON.stringify({
          system_instruction: { parts: [{ text: finalSystemPrompt }] },
          contents: history || [] // History should be already in [{role, parts}] format from frontend
        });

        const options = {
          hostname: 'generativelanguage.googleapis.com',
          path: `/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
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
              const result = JSON.parse(aiData);
              if (result.error) throw new Error(result.error.message);
              
              const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Mmmh, sto riflettendo... Mi scuso, riprovi tra un istante.";
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ html: text }));
            } catch (ep) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: "Errore AI", details: aiData }));
            }
          });
        });
        
        aiReq.on('error', e => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Connessione AI fallita." }));
        });
        aiReq.write(payload);
        aiReq.end();
        
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Errore interno del server.' }));
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

    // 5. Add Security Headers (RELAXED for local interoperability)
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https://images.unsplash.com; frame-src 'self' blob:; connect-src 'self' blob:; object-src 'self' blob:;",
      'Referrer-Policy': 'no-referrer-when-downgrade'
    });
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log('Travel Manager SECURITY HARDENED server running at http://localhost:' + PORT);
});

