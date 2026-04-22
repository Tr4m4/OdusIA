#!/bin/bash
# ==============================================================================
# Setup script MASTER per Synology NAS (Container Manager / Docker)
# Progetto: OdusIA Global Ecosystem
# ==============================================================================

set -euo pipefail

log() { echo -e "[$(date +'%Y-%m-%dT%H:%M:%S%z')] [INFO] $1"; }
warn() { echo -e "[$(date +'%Y-%m-%dT%H:%M:%S%z')] [WARNING] $1" >&2; }
error() { echo -e "[$(date +'%Y-%m-%dT%H:%M:%S%z')] [ERROR] $1" >&2; exit 1; }

TARGET_DIR="/volume1/docker/VS_Wrk"
WORKSPACE_DIR="$(pwd)"

log "=========================================================="
log "Inizio deploy MASTER OdusIA Ecosystem su NAS"
log "Servizi: 1) Hub 2) Travel 3) Wellness 4) Oeconomia 5) News"
log "=========================================================="

if [ "$WORKSPACE_DIR" != "$TARGET_DIR" ]; then
    log "Sei fuori dalla cartella target canonica ($TARGET_DIR)."
    log "Assicurati di aver trasferito l'intero blocco 'VS_Wrk' sulla NAS."
fi

# Impostazione permessi (esegui come amministratore)
log "Applico permessi di base..."
chmod -R 755 .
chown -R $USER:users . || warn "Chown fallito, possibile esecuzione in contesto root o non-admin mode."

# Controllo Orchestratore
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    error "Orchestratore Docker Compose non trovato! Esegui il build via interfaccia Synology o installa un engine."
fi

log "Build e deploy dei 5 microservizi in background..."
$COMPOSE_CMD up -d --build --remove-orphans

log "=========================================================="
log "Deploy Complessivo completato con successo!"
log "Verifica i layer attivi con: docker ps"
log "- Command Center: Porta 8760"
log "- Travel Manager: Porta 8765"
log "- Wellness Hub:   Porta 8766"
log "- OECONOMIA:      Porta 8767"
log "- AletheIA News:  Background Cron (08:00 AM)"
log "=========================================================="
