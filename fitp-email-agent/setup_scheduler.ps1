# Script di configurazione per lo Scheduler di Windows
# Imposta l'esecuzione automatica dell'agente FITP ogni mattina alle 08:45.

$TaskName = "FITP_Daily_Report_Agent"
$PythonPath = "C:\Users\edo_m\OneDrive\Documenti\VS_Wrk\fitp-email-agent\.venv\Scripts\python.exe"
$ScriptPath = "C:\Users\edo_m\OneDrive\Documenti\VS_Wrk\fitp-email-agent\main.py"
$WorkingDirectory = "C:\Users\edo_m\OneDrive\Documenti\VS_Wrk\fitp-email-agent"

# 1. Definisci l'azione (cosa deve fare lo scheduler)
$Action = New-ScheduledTaskAction -Execute $PythonPath -Argument $ScriptPath -WorkingDirectory $WorkingDirectory

# 2. Definisci il trigger (quando deve farlo: Ogni giorno alle 08:45)
$Trigger = New-ScheduledTaskTrigger -Daily -At 8:45AM

# 3. Definisci le impostazioni (es. esegui il prima possibile se un'esecuzione viene saltata)
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# 4. Registra il task (sovrascrive se già esistente)
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description "Invia report giornaliero tornei FITP Milano e Tortona."

Write-Host "Task Scheduler configurato con successo!"
Write-Host "Il report verra inviato ogni mattina alle 08:45."
Write-Host "Per testare subito il task, puoi eseguire: Start-ScheduledTask -TaskName '$TaskName'"
