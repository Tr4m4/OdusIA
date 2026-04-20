import requests
import json

FITP_API_URL = "https://dp-myfit-test-function-v2.azurewebsites.net/api/v2/tornei/puc/list"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json",
}

def inspect():
    payload = {
        "id_regione": 3, # Lombardia
        "id_disciplina": 4332,
        "data_inizio": "16/04/2026",
        "rowstoskip": 0,
        "fetchrows": 50,
        "sortcolumn": "data_inizio",
        "sortorder": "asc",
    }
    resp = requests.post(FITP_API_URL, json=payload, headers=HEADERS)
    items = resp.json().get("competizioni", [])
    
    for i, item in enumerate(items[:20]):
        print(f"--- Item {i} ---")
        print(f"Nome: {item.get('nome_torneo')}")
        print(f"Tipo: {item.get('tipo_torneo')}")
        print(f"Cat/Class: {item.get('cat_class')}")
        print(f"Is TPRA: {item.get('is_tpra')}") # Check if this field exists
        # Print all keys of the first item to see what's available
        if i == 0:
            print(f"Keys: {list(item.keys())}")

if __name__ == "__main__":
    inspect()
