# node:20-slim è ideale per gestire Puppeteer/Chromium senza il bloat di distro alpine
FROM node:20-slim

# Installiamo Chromium e le librerie necessarie (font inclusi) per Puppeteer
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && apt-get install -y fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && apt-get install -y chromium \
    && rm -rf /var/lib/apt/lists/*

# Configurazione fondamentale per Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app

# Installazione ottimizzata delle dipendenze Node (caching)
COPY package*.json ./
RUN npm ci --only=production

# Copia del codice sorgente
COPY . .

# Eseguiamo come root per gestire i permessi dei volumi Synology

EXPOSE 8765

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://127.0.0.1:8765/', (r) => { if (r.statusCode !== 200) process.exit(1); }).on('error', () => process.exit(1));"

CMD ["node", "server.js"]
