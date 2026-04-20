# FITP MCP Server

Server MCP locale per la ricerca dei tornei di tennis nelle tue zone preferite,
usando l'API ufficiale del Portale Unico Competizioni (PUC) della FITP.

## Zone configurate

| Zona | Punto di riferimento | Raggio |
|------|---------------------|--------|
| Milano - Via Valsugana | Lat 45.5017, Lon 9.2359 | 20 km |
| Tortona | Lat 44.8954, Lon 8.8655 | 10 km |

## Struttura del progetto

```
fitp-mcp-server/
├── server.py                      # Server MCP (FastMCP)
├── scraper.py                     # Scraper con API FITP + geocoding
├── requirements.txt               # Dipendenze Python
├── test_scraper.py                # Script di test standalone
├── claude_desktop_config_snippet.json  # Config da incollare in Claude Desktop
└── .venv/                         # Virtual environment Python
```

## Come avviarlo

```powershell
# Avvia server in modalità stdio (per Claude Desktop)
C:\Users\edo_m\OneDrive\Documenti\VS_Wrk\fitp-mcp-server\.venv\Scripts\python.exe server.py

# Test standalone (senza MCP)
C:\Users\edo_m\OneDrive\Documenti\VS_Wrk\fitp-mcp-server\.venv\Scripts\python.exe test_scraper.py
```

## Integrazione con Claude Desktop

Aggiungi il contenuto di `claude_desktop_config_snippet.json` al tuo file di configurazione di Claude Desktop:

- **Percorso config**: `%APPDATA%\Claude\claude_desktop_config.json`

Incolla il blocco dentro la chiave `"mcpServers"` del tuo file esistente.

## Tool disponibile

### `cerca_tornei_fitp`

Cerca i tornei di tennis nelle due zone pre-configurate.

**Parametri:**
- `solo_prossimi` (bool, default `true`): se `true`, mostra solo tornei futuri

**Output:** Elenco tornei con circolo, città, distanza in km, date e link al PUC.

## Modificare le zone

Edita il file `scraper.py`, sezione `ZONE`, per aggiungere o modificare le aree di ricerca.
Ogni zona ha:
- `nome`: etichetta testuale
- `lat`, `lon`: coordinate del punto centrale
- `raggio_km`: raggio di ricerca in km
- `id_regione`: ID numerico FITP (3=Lombardia, 1=Piemonte, 2=Valle d'Aosta, 4=Veneto...)
- `sigla_provincia_filter`: pre-filtra per provincia prima del geocoding (es. "AL" per Alessandria)

## Aggiungere città alla cache geocoding

Se noti che alcune città non vengono geolocalizzate correttamente, aggiungi le coordinate
direttamente alla cache `_geo_cache` in `scraper.py`:

```python
_geo_cache["NomeCitta,XX,Italia"] = (lat, lon)
```
