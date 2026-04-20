import requests
from geopy.distance import geodesic
from geopy.geocoders import Nominatim
import time
import logging
import os
from datetime import datetime
from dotenv import load_dotenv
from dataclasses import dataclass
from typing import Optional, List, Dict

load_dotenv()

# Logger configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

FITP_API_URL = "https://dp-myfit-test-function-v2.azurewebsites.net/api/v2/tornei/puc/list"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "Origin": "https://www.fitp.it",
    "Referer": "https://www.fitp.it/",
}

@dataclass
class Tournament:
    name: str
    club: str
    city: str
    province: str
    start_date: str
    end_date: str
    link: str
    distance: Optional[float] = None
    category_limits: Optional[str] = None
    gender: Optional[str] = None
    zone: Optional[str] = None

class FITPScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.geocoder = Nominatim(user_agent="fitp-email-agent/1.0")
        self.geo_cache = {
            # Provincia di Milano
            "Milano,MI,Italia": (45.4642, 9.1900),
            "Sesto San Giovanni,MI,Italia": (45.5363, 9.2349),
            "Cinisello Balsamo,MI,Italia": (45.5596, 9.2148),
            "Cernusco sul Naviglio,MI,Italia": (45.5228, 9.3293),
            "Monza,MB,Italia": (45.5845, 9.2744),
            "Vimodrone,MI,Italia": (45.5001, 9.2849),
            "Segrate,MI,Italia": (45.4879, 9.2950),
            "Cologno Monzese,MI,Italia": (45.5302, 9.2782),
            "Liscate,MI,Italia": (45.4758, 9.3661),
            "Pioltello,MI,Italia": (45.5023, 9.3295),
            "Paderno Dugnano,MI,Italia": (45.5714, 9.1678),
            "Rozzano,MI,Italia": (45.3813, 9.1554),
            "San Donato Milanese,MI,Italia": (45.4098, 9.2731),
            "San Giuliano Milanese,MI,Italia": (45.3976, 9.2854),
            "Rho,MI,Italia": (45.5284, 9.0401),
            "Pero,MI,Italia": (45.5100, 9.0833),
            "Corsico,MI,Italia": (45.4312, 9.1111),
            "Basiglio,MI,Italia": (45.3562, 9.1601),
            "Lacchiarella,MI,Italia": (45.3262, 9.1411),
            "Paullo,MI,Italia": (45.4200, 9.4000),
            "Zelo Buon Persico,LO,Italia": (45.4167, 9.4333),
            "Cassina de' Pecchi,MI,Italia": (45.5167, 9.3667),
            "Gorgonzola,MI,Italia": (45.5333, 9.4000),
            "Melzo,MI,Italia": (45.5000, 9.4333),
            "Vignate,MI,Italia": (45.5000, 9.3833),
            "Settala,MI,Italia": (45.4500, 9.4000),
            "Peschiera Borromeo,MI,Italia": (45.4333, 9.3167),
            "Pantigliate,MI,Italia": (45.4333, 9.3500),

            # Provincia di Alessandria (Tortona area)
            "Tortona,AL,Italia": (44.8954, 8.8655),
            "Alessandria,AL,Italia": (44.9133, 8.6154),
            "Novi Ligure,AL,Italia": (44.7614, 8.7901),
            "Castelnuovo Scrivia,AL,Italia": (44.9800, 8.8750),
            "Pontecurone,AL,Italia": (44.9567, 8.9133),
            "Voghera,PV,Italia": (44.9960, 9.0084),
            "Sale,AL,Italia": (44.9916, 8.8031),
            "Vigevano,PV,Italia": (45.3141, 8.8594),
            "Casale Monferrato,AL,Italia": (45.1333, 8.4500),
            "Valenza,AL,Italia": (45.0167, 8.6333),
            "Ovada,AL,Italia": (44.6333, 8.6667),
            "Acqui Terme,AL,Italia": (44.6667, 8.4667),
            "Serravalle Scrivia,AL,Italia": (44.7333, 8.8667),
            "Arquata Scrivia,AL,Italia": (44.6833, 8.8833),
            "Pozzolo Formigaro,AL,Italia": (44.8000, 8.7833),
            "Castellazzo Bormida,AL,Italia": (44.8333, 8.5833),
            "Isola Sant'Antonio,AL,Italia": (45.0333, 8.8500),
            "Bassignana,AL,Italia": (45.0000, 8.7333),
            "Giarole,AL,Italia": (45.0667, 8.5667),
            "Occimiano,AL,Italia": (45.0667, 8.5167),
        }

    def _get_coords(self, city: str, province: str) -> Optional[tuple]:
        key = f"{city},{province},Italia"
        if key in self.geo_cache:
            return self.geo_cache[key]
        
        try:
            time.sleep(1.5) # More conservative rate limit protection
            location = self.geocoder.geocode(key, timeout=10)
            if location:
                self.geo_cache[key] = (location.latitude, location.longitude)
                return self.geo_cache[key]
        except Exception as e:
            logger.warning(f"Geocoding failed for {key}: {e}")
        return None

    def _format_classification(self, cat_class: str) -> str:
        if not cat_class:
            return "N/D"
        # Split by semicolon and filter empty
        parts = [p for p in cat_class.split(";") if p.strip()]
        if not parts:
            return "N/D"
        
        # Sort or just take min/max if it represents a range
        # Usually it's something like 4.NC;4.6;4.5...
        # We'll just show the first and last for simplicity or the whole string if short
        if len(parts) <= 3:
            return ", ".join(parts)
        return f"LIM. {parts[0]}-{parts[-1]}"

    def fetch_tournaments(self, lat: float, lon: float, radius: float, zone_name: str) -> List[Tournament]:
        logger.info(f"Fetching tournaments for {zone_name} (radius: {radius}km)")
        
        # Decide which provinces to filter by for better performance
        # Milano (45.5, 9.2): MI, MB, LO, PV
        # Tortona (44.9, 8.8): AL, PV, AT
        if zone_name == "Milano":
            target_provinces = ["MI", "MB", "LO", "PV"]
            region_id = 3 # Lombardia
        else:
            target_provinces = ["AL", "PV", "AT"]
            region_id = 1 # Piemonte

        payload = {
            "id_regione": region_id,
            "id_disciplina": 4332, # Tennis
            "data_inizio": datetime.now().strftime("%d/%m/%Y"),
            "rowstoskip": 0,
            "fetchrows": 200, # Fetch more to be sure
            "sortcolumn": "data_inizio",
            "sortorder": "asc",
        }
        
        all_tournaments = []
        try:
            resp = self.session.post(FITP_API_URL, json=payload, timeout=20)
            resp.raise_for_status()
            data = resp.json()
            items = data.get("competizioni", [])
            
            for item in items:
                nome = item.get("nome_torneo", "").strip()
                tipo = item.get("tipo_torneo", "").lower()
                id_fonte = item.get("id_fonte", "")
                
                # -- FILTERS --
                # 1. Solo Maschile
                if "maschile" not in tipo:
                    continue
                
                # 2. Solo Singolare (esclude Doppio)
                if "doppio" in tipo:
                    continue
                
                # 3. No TPRA (Controllo nome + campo id_fonte)
                if "TPRA" in nome.upper() or id_fonte == "TORNEI TPRA":
                    continue

                province = item.get("sigla_provincia", "").upper()
                if province not in target_provinces:
                    continue # Skip far away provinces immediately
                
                city = item.get("citta", "")
                coords = self._get_coords(city, province)
                dist = None
                if coords:
                    dist = round(geodesic((lat, lon), coords).km, 1)
                
                # Inclusion logic: 
                # a) Within radius
                # b) Fallback if geocoding failed, but only for the primary provinces (MI, MB for Milano; AL for Tortona)
                primary_provinces = ["MI", "MB"] if zone_name == "Milano" else ["AL"]
                
                if (dist is not None and dist <= radius) or (dist is None and province in primary_provinces):
                    guid = item.get("guid", "")
                    # Direct link to competition details
                    link = f"https://www.fitp.it/Tornei/Dettaglio-Competizione?competitionId={guid}" if guid else "#"
                    
                    all_tournaments.append(Tournament(
                        name=nome,
                        club=item.get("tennisclub", "N/D").strip(),
                        city=city,
                        province=province,
                        start_date=item.get("data_inizio", ""),
                        end_date=item.get("data_fine", ""),
                        link=link,
                        distance=dist,
                        category_limits=self._format_classification(item.get("cat_class", "")),
                        gender=item.get("tipo_torneo", "N/D"),
                        zone=zone_name
                    ))
        except Exception as e:
            logger.error(f"Error fetching for {zone_name}: {e}")

        # Sort by distance
        all_tournaments.sort(key=lambda x: x.distance if x.distance is not None else 999)
        return all_tournaments

if __name__ == "__main__":
    # Test script
    scraper = FITPScraper()
    # Milano test
    results = scraper.fetch_tournaments(45.5017, 9.2359, 20, "Milano")
    for t in results[:5]:
        print(f"{t.name} - {t.distance}km - {t.category_limits}")
