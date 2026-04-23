# OdusIA Command Center & Networking Guide

Benvenuto nel tuo nuovo gateway di sviluppo unificato. Questa architettura è progettata per eliminare la confusione tra porte e progetti, fornendo un'interfaccia premium per l'intero ecosistema OdusIA.

## 🚀 Come avviare i progetti
Per avviare i server, apri i rispettivi terminali ed esegui i file `server.js`.

| Progetto | Comando | URL Locale |
| :--- | :--- | :--- |
| **Odus Hub** | `node odus-hub-server.js` | http://localhost:8760 |
| **Travel Manager** | `node travel-manager/server.js` | http://localhost:8765 |
| **Wellness Consultant** | `node wellness-consultant/dashboard/server.js` | http://localhost:8766 |
| **OECONOMIA** | `node oeconomia/server.js` | http://localhost:8767 |

---

## 🌐 Configurazione Local DNS (Consigliata)
Per un'esperienza da **Senior Principal**, puoi mappare i nomi di dominio locali (es. `travel.odus`) per non dover più usare i numeri delle porte.

### Guida Rapida (Windows)
1. Apri **PowerShell** come Amministratore.
2. Esegui il seguente comando per aggiungere le voci al file `hosts`:
```powershell
Add-Content -Path $env:windir\System32\drivers\etc\hosts -Value "`n127.0.0.1 travel.odus`n127.0.0.1 hub.odus`n127.0.0.1 oeconomia.odus`n127.0.0.1 wellness.odus"
```
3. Ora potrai accedere ai progetti digitando semplicemente `hub.odus`, `travel.odus`, ecc. (assicurandoti che il server corrispondente sia attivo).

---

## 🛡️ Prevenzione Regressioni
Tutti i file nuovi sono isolati nelle loro directory o nel root con nomi univoci. Nessun file esistente di `travel-manager` o degli agenti pre-esistenti è stato alterato in modo distruttivo.

**Porte OdusIA Standardizzate:** `876x` range.
