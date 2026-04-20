# FITP Tournament Daily Report Agent

Un agente autonomo che scansiona il portale FITP (P.U.C.) alla ricerca di tornei di tennis in zone geografiche specifiche, li filtra secondo criteri prestabiliti e invia un report via email.

## Funzionalità
- **Filtro Geografico**: Cerca tornei entro un raggio specificato (es. 20km) da coordinate date.
- **Filtri Avanzati**: 
  - Solo Singolare.
  - Solo Maschile.
  - Esclusione automatica tornei TPRA.
- **Sicurezza**: Sanificazione HTML (anti-XSS) e connessione SMTP sicura (STARTTLS).
- **Report**: Email HTML premium con tabella riassuntiva e link diretti ai dettagli dei tornei.

## Requisiti
- Python 3.10+
- Un account Gmail (con Password per le App attivata)

## Installazione

1. Clona la repository:
   ```bash
   git clone <url-repository>
   cd fitp-email-agent
   ```

2. Crea un ambiente virtuale e installa le dipendenze:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Configura le variabili d'ambiente:
   Copia il file `.env.example` in `.env` e inserisci le tue credenziali:
   ```bash
   cp .env.example .env
   ```

## Utilizzo
Per lanciare l'agente manualmente:
```bash
python main.py
```

## Automazione (Windows)
Puoi usare lo script `setup_scheduler.ps1` per pianificare l'esecuzione automatica (es. tutte le mattine alle 08:45). Eseguilo in una finestra PowerShell con privilegi di Amministratore.
