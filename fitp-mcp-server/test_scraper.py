"""
Script di test per verificare che lo scraper FITP funzioni correttamente.
"""
import sys
import os
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.path.insert(0, os.path.dirname(__file__))

from scraper import cerca_tornei_nelle_zone, formatta_risultati

print("Test scraper FITP in corso...")
print("(Questo puo' richiedere qualche secondo per le chiamate HTTP + geocoding)\n")

risultati = cerca_tornei_nelle_zone(solo_prossimi=True)
output = formatta_risultati(risultati)
print(output)

tot = sum(len(v) for v in risultati.values())
print(f"\nTest completato. Tornei trovati: {tot}")
