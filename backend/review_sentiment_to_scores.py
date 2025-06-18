from transformers import pipeline
from dotenv import load_dotenv
import psycopg2
import os

def main():
    load_dotenv()

    conn = psycopg2.connect(
        dbname=os.getenv("DATABASE_NAME"),
        user=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"),
        host=os.getenv("DATABASE_HOST"),
        port=os.getenv("DATABASE_PORT")
    )
    cur = conn.cursor()

    print("📦 Se încarcă modelul HuggingFace...")
    classifier = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

    def convert_star_score(result):
        label = result["label"]  
        try:
            stars = int(label[0])
            return float(stars)
        except:
            return None

    def analyze_aspect(text, aspect):
        try:
            prompt = f"{aspect}: {text}"
            result = classifier(prompt[:512])[0]
            return convert_star_score(result)
        except Exception as e:
            print(f"⚠️ Eroare aspect '{aspect}': {e}")
            return None

    print("🔎 Se extrag review-uri din baza de date...")
    cur.execute("""SELECT id, positive, negative FROM "Hotel_Reviews" """)
    rows = cur.fetchall()
    print(f"📋 {len(rows)} recenzii găsite.")

    for review_id, pos, neg in rows:
        text = f"{pos or ''}. {neg or ''}".strip()

        scores = {
            "cleanliness_text": analyze_aspect(text, "curățenie"),
            "food_text": analyze_aspect(text, "mâncare"),
            "sleep_text": analyze_aspect(text, "somn"),
            "internet_text": analyze_aspect(text, "internet"),
            "amenities_text": analyze_aspect(text, "facilități"),
        }

        cur.execute("""
            UPDATE "Hotel_Reviews"
            SET cleanliness_text = %s,
                food_text = %s,
                sleep_text = %s,
                internet_text = %s,
                amenities_text = %s
            WHERE id = %s
        """, (
            scores["cleanliness_text"],
            scores["food_text"],
            scores["sleep_text"],
            scores["internet_text"],
            scores["amenities_text"],
            review_id
        ))

        print(f"✅ Review ID {review_id} actualizat cu scoruri aspectuale.")

    conn.commit()
    cur.close()
    conn.close()
    print("🎉 Procesul a fost finalizat cu succes.")

if __name__ == "__main__":
    main()
