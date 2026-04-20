"""
Script di discovery per trovare i parametri esatti dell'API FITP.
"""
import sys, io, json, requests
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE_API = "https://sgatapiexternalv2.azurewebsites.net"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "it-IT,it;q=0.9",
    "Origin": "https://www.fitp.it",
    "Referer": "https://www.fitp.it/",
}

session = requests.Session()
session.headers.update(HEADERS)

# ─── Test 1: endpoint CompetitionSearch ───────────────────────────────────────
endpoints_to_try = [
    f"{BASE_API}/DigitalPlatform/CompetitionSearch",
    f"{BASE_API}/DigitalPlatform/GetCompetitions",
    f"{BASE_API}/DigitalPlatform/SearchCompetition",
    f"{BASE_API}/api/Competition/Search",
    f"{BASE_API}/api/DigitalPlatform/CompetitionSearch",
]

params_to_try = [
    {"disciplineId": "4332", "provinceId": "MI"},
    {"disciplineId": "4332", "provinceCode": "MI"},
    {"disciplineId": "4332", "province": "MI"},
    {"disciplineId": "4332", "regionCode": "LOM"},
]

print("=== Discovery API FITP ===\n")
for endpoint in endpoints_to_try:
    for params in params_to_try[:1]:  # solo i primi params per non fare troppe chiamate
        try:
            resp = session.get(endpoint, params=params, timeout=10)
            print(f"GET {endpoint}")
            print(f"  Status: {resp.status_code}")
            print(f"  Content-Type: {resp.headers.get('content-type', 'N/A')}")
            if resp.status_code == 200:
                try:
                    data = resp.json()
                    print(f"  JSON keys: {list(data.keys()) if isinstance(data, dict) else type(data)}")
                    print(f"  Response preview: {str(resp.text[:300])}")
                except Exception:
                    print(f"  HTML response preview: {resp.text[:200]}")
            print()
        except Exception as e:
            print(f"  Errore: {e}\n")
