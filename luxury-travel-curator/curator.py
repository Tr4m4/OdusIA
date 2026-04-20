import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

class LuxuryTravelCurator:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY non trovata. Assicurati di avere un file .env configurato.")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.5-pro')

    def _get_system_instruction(self):
        with open("SYSTEM_INSTRUCTIONS.md", "r", encoding="utf-8") as f:
            return f.read()

    def curate(self, location, spa_detail, price_range, travel_focus):
        """
        Esegue la curatela basata sui 4 parametri obbligatori.
        """
        system_prompt = self._get_system_instruction()
        
        user_input = f"""
        [INPUT PARAMETERS]
        LUOGO: {location}
        DETTAGLIO SPA ESSENZIALE: {spa_detail}
        FASCIA PREZZO: {price_range}
        FOCUS DEL VIAGGIO: {travel_focus}
        """
        
        prompt = f"{system_prompt}\n\n{user_input}\n\nGenera ora il REPORT DI CONSULENZA seguendo rigorosamente la struttura e il tono richiesti."
        
        response = self.model.generate_content(prompt)
        return response.text

if __name__ == "__main__":
    # Esempio di utilizzo interattivo
    print("--- LUXURY TRAVEL CURATOR v. 3.0 ---")
    loc = input("Inserisci il LUOGO: ")
    spa = input("Inserisci il DETTAGLIO SPA ESSENZIALE: ")
    prc = input("Inserisci la FASCIA PREZZO: ")
    foc = input("Inserisci il FOCUS DEL VIAGGIO: ")
    
    try:
        curator = LuxuryTravelCurator()
        print("\nAnalisi in corso (Profilazione e Sinestesia)... attendere.\n")
        report = curator.curate(loc, spa, prc, foc)
        print(report)
    except Exception as e:
        print(f"Errore durante la curatela: {e}")
