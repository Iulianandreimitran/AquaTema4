from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import time
import re
import pandas as pd
from Hotel_Scraping.hotel_urls import all_urls
from concurrent.futures import ThreadPoolExecutor, as_completed

options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')


urls = all_urls

facilitati_mapate = {
    'vestiare fitness/spa': 'vestiare',
    'fitness': 'fitness',
    'lounge spa/zonă de relaxare': 'zona_relaxare',
    'baie turcească/baie de aburi': 'baie_turceasca',
    'spa și centru de wellness': 'spa',
    'sală de fitness': 'sala_fitness',
    'saună': 'sauna',
}

WAIT_TIME = 5

def scrape_url(url):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(service=Service(), options=options)
    result = {}

    try:
        driver.get(url)
        time.sleep(WAIT_TIME)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        hotel_name = soup.find('h2', class_='ddb12f4f86 pp-header__title')
        hotel_name = hotel_name.text.strip() if hotel_name else 'N/A'

        try:
            loc_div = soup.find('div', class_='b99b6ef58f cb4b7a25d9')
            locatie = loc_div.find(text=True, recursive=False).strip()
        except:
            locatie = 'N/A'

        try:
            divuri = soup.find_all('div', class_='d208d2153d')
            if len(divuri) >= 6:
                aeroport_div = divuri[5].find('div', class_='aa225776f2 ca9d921c46 d1bc97eb82')
                aeroport_nume = aeroport_div.text.strip() if aeroport_div else 'N/A'
                distanta_div = divuri[5].find('div', class_='b99b6ef58f fb14de7f14 a0a56631d6')
                match = re.search(r'([\d.,]+)', distanta_div.text if distanta_div else '')
                distanta_km = match.group(1) if match else 'N/A'
            else:
                aeroport_nume = 'N/A'
                distanta_km = 'N/A'
        except:
            aeroport_nume = 'N/A'
            distanta_km = 'N/A'

        try:
            divuriFacilitati = soup.find_all('div', class_='b43e553776')
            wellness_div = next((div for div in divuriFacilitati if 'Wellness' in div.get_text(strip=True)), None)
            facilitati = {v: 0 for v in facilitati_mapate.values()}

            if wellness_div:
                ul = wellness_div.find('ul', class_='e9f7361569 b988733741 b049f18dec')
                for li in ul.find_all('li'):
                    text_span = li.find('span', class_='f6b6d2a959')
                    if text_span:
                        text = text_span.text.lower()
                        for cheie_text, cheie_interna in facilitati_mapate.items():
                            if cheie_text in text:
                                facilitati[cheie_interna] = 1
        except:
            facilitati = {v: 0 for v in facilitati_mapate.values()}

        try:
            lant_hotelier = soup.find('div', class_='b08850ce41 f546354b44 cc045b173b').text.strip()
        except:
            lant_hotelier = 'N/A'

        result = {
            "hotel": hotel_name,
            "locatie": locatie,
            "aeroport": aeroport_nume,
            "distanta_km": distanta_km,
            "lant_hotelier": lant_hotelier,
            "facilitati": facilitati,
            "url": url
        }

    except Exception as e:
        print(f"Erorr: {e}")

    driver.quit()
    return result


#Url-uri executate in paralel 
results = []
with ThreadPoolExecutor(max_workers=10) as executor: 
    tasks  = [executor.submit(scrape_url, url) for url in urls]

    for task in as_completed(tasks ):
        res = task.result()
        if res:
            results.append(res)

# csv 
df = pd.json_normalize(results)
df.to_csv("hoteluri_output2.csv", index=False, encoding="utf-8-sig")
print(f"Salvat {len(df)} hoteluri în hoteluri_output_parallel.csv")