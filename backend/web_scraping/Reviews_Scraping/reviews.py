import csv
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from concurrent.futures import ThreadPoolExecutor, as_completed
from reviews_url import all_urls

urls = all_urls

MAX_REVIEWS_PER_HOTEL = 30
WAIT_TIME = 4
OUTPUT_CSV = "recenzii2.csv"

def setup_driver():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    return webdriver.Chrome(service=Service(), options=options)

def parse_review(li, hotel_url, hotel_id):
    title = li.select_one("div.review_item_header_content span[itemprop='name']")
    score = li.select_one("span.review-score-badge")
    stay_date_p = li.select_one("p.review_staydate")

    positive, negative = "", ""
    for svg in li.select("svg.review_item_icon"):
        label = svg.get("aria-label", "").strip().lower()
        text = svg.find_next("span", itemprop="reviewBody")
        if "pozitive" in label:
            positive = text.text.strip() if text else ""
        else:
            negative = text.text.strip() if text else ""

    return {
        "hotel_id": hotel_id,
        "hotel_url": hotel_url,
        "title": title.text.strip() if title else "",
        "score": score.text.strip().replace(",", ".") if score else "",
        "stay_date": stay_date_p.text.replace("Sejur în", "").strip() if stay_date_p else "",
        "positive": positive,
        "negative": negative
    }

def extract_reviews(hotel_url, hotel_id):
    print(f"Processing hotel: {hotel_url}")
    driver = setup_driver()
    try:
        driver.get(hotel_url)
        time.sleep(WAIT_TIME)

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        review_items = soup.select("ul.review_list li.review_item.clearfix")[:MAX_REVIEWS_PER_HOTEL]

        reviews = [parse_review(li, hotel_url, hotel_id) for li in review_items]
        return reviews
    except Exception as e:
        print(f"Error: {e}")
        return []
    finally:
        driver.quit()

def save_to_csv(data, output_path):
    with open(output_path, "w", newline="", encoding="utf-8") as csvfile:
        fieldnames = ["hotel_id", "hotel_url", "title", "score", "stay_date", "positive", "negative"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow(row)

def run_scraper():
    all_reviews = []

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(extract_reviews, url, idx) for idx, url in enumerate(urls, start=45)]
        for future in as_completed(futures):
            result = future.result()
            if result:
                all_reviews.extend(result)

    save_to_csv(all_reviews, OUTPUT_CSV)

if __name__ == "__main__":
    run_scraper()
