#!/bin/bash
# ==============================================================================
# Script di Aggiornamento Automatico (Git Pull -> Docker Build -> Docker Up)
# Da posizionare sulla NAS in /volume1/docker/VS_Wrk
# ==============================================================================

# Idempotenza e log pattern
set -euo pipefail
log() { echo -e "[$(date +'%Y-%m-%dT%H:%M:%S%z')] [UPDATE] $1"; }
error() { echo -e "[$(date +'%Y-%m-%dT%H:%M:%S%z')] [ERROR] $1" >&2; exit 1; }

TARGET_DIR="/volume1/docker/VS_Wrk"

# Controllo se l'Orchestratore e Git sono disponibili nel path di root/cron
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    # Fallback tipico per Synology
    COMPOSE_CMD="/usr/local/bin/docker-compose"
fi

if ! command -v git &> /dev/null; then
    error "Git non trovato! Installalo dal Centro Pacchetti Synology (Git Server)."
fi

log "Inizio procedura di Continuous Deployment..."

cd "$TARGET_DIR" || error "Directory fallita. Assicurati che $TARGET_DIR esista."

# --- 1. AGGIORNAMENTO REPOSITORY ---

log "Updating: Main OdusIA Hub..."
git remote set-url origin https://${GH_TOKEN}@github.com/Tr4m4/OdusIA.git
git pull origin main || git pull origin master || log "Pull Hub saltato o fallito."

log "Updating: OeconomIA..."
if [ -d "oeconomia" ]; then
    cd oeconomia
    git remote set-url origin https://${GH_TOKEN}@github.com/nswgdqyfth-pixel/OeconomIA.git
    git pull origin main || git pull origin master || log "Pull OeconomIA saltato."
    cd ..
fi

log "Updating: Wellness Hub..."
if [ -d "wellness-consultant" ]; then
    cd wellness-consultant
    git remote set-url origin https://${GH_TOKEN}@github.com/nswgdqyfth-pixel/Wellness.git
    git pull origin main || git pull origin master || log "Pull Wellness saltato."
    cd ..
fi

log "Updating: Travel Manager..."
if [ -d "travel-manager" ]; then
    cd travel-manager
    # Usando lo stesso PAT se appartiene allo stesso utente, altrimenti aggiornalo a mano
    git pull origin main || git pull origin master || log "Pull Travel saltato."
    cd ..
fi

# --- 2. DOCKER ORCHESTRATION ---

log "Calcolo del delta delle immagini ed eventuale Build..."
$COMPOSE_CMD build

log "Riavvio intelligente dei container..."
$COMPOSE_CMD up -d --remove-orphans

log "Pulizia layer intermedi inutilizzati..."
docker image prune -f

log "Aggiornamento odierno completato! L'Ecosistema OdusIA e' all'ultima versione."
