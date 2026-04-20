import smtplib
import os
import html
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class EmailManager:
    def __init__(self):
        self.sender = os.getenv("GMAIL_SENDER")
        self.password = os.getenv("GMAIL_APP_PASSWORD")
        self.recipient = os.getenv("EMAIL_RECIPIENT")

    def _build_html_body(self, results_by_zone: dict) -> str:
        date_str = datetime.now().strftime("%d/%m/%Y")
        
        # Build sections for each zone
        zones_html = ""
        for zone_name, tournaments in results_by_zone.items():
            rows_html = ""
            for i, t in enumerate(tournaments, 1):
                # Escaping inputs for security
                e_name = html.escape(t.name)
                e_club = html.escape(t.club)
                e_city = html.escape(t.city)
                e_cats = html.escape(t.category_limits)
                
                dist_str = f"{t.distance} km" if t.distance is not None else "N/D"
                # Handle dates "18/04 -> 03/05"
                dates_str = f"{t.start_date}"
                if t.end_date and t.end_date != t.start_date:
                    dates_str += f" &rarr; {t.end_date}"

                rows_html += f"""
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 8px; font-size: 13px; color: #555;">{i}</td>
                    <td style="padding: 12px 8px; font-weight: 600; font-size: 14px; color: #333;">{e_name}</td>
                    <td style="padding: 12px 8px; font-size: 13px; color: #666;">{e_club}</td>
                    <td style="padding: 12px 8px; font-size: 13px; color: #666;">{e_city}</td>
                    <td style="padding: 12px 8px; font-size: 13px; color: #333; font-weight: 500;">{dist_str}</td>
                    <td style="padding: 12px 8px; font-size: 13px; color: #666; white-space: nowrap;">{dates_str}</td>
                    <td style="padding: 12px 8px; font-size: 12px; color: #777;">{e_cats}</td>
                    <td style="padding: 12px 8px;">
                        <a href="{t.link}" style="color: #333; text-decoration: underline; font-size: 13px; font-weight: 500;">Dettagli</a>
                    </td>
                </tr>
                """

            zones_html += f"""
            <div style="margin-bottom: 40px; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <h2 style="color: #333; font-size: 20px; margin-top: 0; display: flex; align-items: center; font-family: 'Playfair Display', serif;">
                    <span style="font-size: 24px; margin-right: 10px;">🎾</span> 
                    TORNEI ZONA {zone_name.upper()} - {len(tournaments)} Tornei
                </h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="text-align: left; border-bottom: 2px solid #eee;">
                            <th style="padding: 10px 8px; color: #333; font-size: 12px; font-weight: 700;">#</th>
                            <th style="padding: 10px 8px; color: #333; font-size: 12px; font-weight: 700;">Nome Torneo</th>
                            <th style="padding: 10px 8px; color: #333; font-size: 12px; font-weight: 700;">Circolo</th>
                            <th style="padding: 10px 8px; color: #333; font-size: 12px; font-weight: 700;">Località</th>
                            <th style="padding: 10px 8px; color: #333; font-size: 12px; font-weight: 700;">Distanza</th>
                            <th style="padding: 10px 8px; color: #333; font-size: 12px; font-weight: 700;">Date</th>
                            <th style="padding: 10px 8px; color: #333; font-size: 12px; font-weight: 700;">Categoria/Limiti</th>
                            <th style="padding: 10px 8px; color: #333; font-size: 12px; font-weight: 700;">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows_html if rows_html else '<tr><td colspan="8" style="padding: 20px; text-align: center; color: #999;">Nessun torneo trovato nel raggio selezionato.</td></tr>'}
                    </tbody>
                </table>
            </div>
            """

        full_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap');
            </style>
        </head>
        <body style="margin:0; padding:0; background-color: #f7f7f7; font-family: 'Inter', sans-serif;">
            <div style="max-width: 900px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: #333; font-size: 32px; font-weight: 800; margin-bottom: 8px;">FITP Daily Report</h1>
                    <p style="color: #888; font-size: 16px; margin: 0;">Riepilogo tornei per il giorno {date_str}</p>
                </div>
                
                {zones_html}
                
                <div style="text-align: center; border-top: 1px solid #ddd; padding-top: 20px; margin-top: 40px;">
                    <p style="color: #aaa; font-size: 12px;">
                        Questo report è stato generato automaticamente per Edoardo Mondelli.
                        <br>Dati estratti dal Portale Unico Competizioni FITP.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        return full_html

    def send_report(self, results_by_zone: dict):
        if not all([self.sender, self.password, self.recipient]):
            print("Configurazione email mancante nel file .env")
            return

        subject = f"🎾 Tornei FITP - Report Giornaliero {datetime.now().strftime('%d/%m/%Y')}"
        
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"FITP Agent <{self.sender}>"
        msg["To"] = self.recipient

        html_body = self._build_html_body(results_by_zone)
        msg.attach(MIMEText(html_body, "html"))

        try:
            with smtplib.SMTP("smtp.gmail.com", 587) as server:
                server.starttls()
                server.login(self.sender, self.password)
                server.sendmail(self.sender, self.recipient, msg.as_string())
            print(f"Email inviata con successo a {self.recipient}!")
        except Exception as e:
            print(f"Errore durante l'invio dell'email: {e}")

if __name__ == "__main__":
    # Test script with dummy data
    from fitp_scraper import Tournament
    dummy_results = {
        "Test Zone": [
            Tournament("Trofeo Primavera", "TC Milano", "Milano", "MI", "18/04", "03/05", "https://fitp.it", 5.2, "LIM. 4.4-3.1", "SM/SF"),
            Tournament("Open Estate", "Sporting Club", "Tortona", "AL", "20/04", "01/05", "https://fitp.it", 12.0, "LIM. 2.1-3.5", "SM")
        ]
    }
    manager = EmailManager()
    manager.send_report(dummy_results)
