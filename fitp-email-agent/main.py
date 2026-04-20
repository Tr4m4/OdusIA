import os
import logging
from dotenv import load_dotenv
from fitp_scraper import FITPScraper
from email_manager import EmailManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("agent.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("FITP-Agent")

def main():
    load_dotenv()
    logger.info("Starting FITP Daily Report Agent...")
    
    scraper = FITPScraper()
    email_manager = EmailManager()
    
    # 1. Configuration for Milano
    milano_lat = float(os.getenv("MILANO_LAT", 45.5017))
    milano_lon = float(os.getenv("MILANO_LON", 9.2359))
    milano_radius = float(os.getenv("MILANO_RADIUS", 20))
    
    # 2. Configuration for Tortona
    tortona_lat = float(os.getenv("TORTONA_LAT", 44.8954))
    tortona_lon = float(os.getenv("TORTONA_LON", 8.8655))
    tortona_radius = float(os.getenv("TORTONA_RADIUS", 20))
    
    results = {}
    
    try:
        logger.info("Fetching tournaments for Milano area...")
        results["Milano"] = scraper.fetch_tournaments(milano_lat, milano_lon, milano_radius, "Milano")
        
        logger.info("Fetching tournaments for Tortona area...")
        results["Tortona"] = scraper.fetch_tournaments(tortona_lat, tortona_lon, tortona_radius, "Tortona")
        
        # Count total
        total_found = sum(len(v) for v in results.values())
        logger.info(f"Scan complete. Total tournaments found: {total_found}")
        
        # 3. Send email report
        logger.info("Generating and sending email report...")
        email_manager.send_report(results)
        
    except Exception as e:
        logger.error(f"Execution failed: {e}", exc_info=True)

if __name__ == "__main__":
    main()
