import os
import psycopg2
from dotenv import load_dotenv
import numpy as np
from sklearn.preprocessing import MinMaxScaler

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


    cur.execute("""
        SELECT hotel_id,
               AVG(cleanliness_text)::float,
               AVG(food_text)::float,
               AVG(sleep_text)::float,
               AVG(internet_text)::float,
               AVG(amenities_text)::float
        FROM Hotel_Reviews
        GROUP BY hotel_id
    """)
    results = cur.fetchall()

    hotel_ids = [row[0] for row in results]
    scores_matrix = [row[1:] for row in results]  

    scaler = MinMaxScaler()
    normalized_scores = scaler.fit_transform(scores_matrix)

    for i, hotel_id in enumerate(hotel_ids):
        clean, food, sleep, internet, amenities = normalized_scores[i]

        cur.execute("""
            UPDATE Hotels
            SET cleanliness_score = %s,
                food_score = %s,
                sleep_score = %s,
                internet_score = %s,
                amenities_score = %s
            WHERE GlobalPropertyID = %s
        """, (clean, food, sleep, internet, amenities, hotel_id))

    conn.commit()
    cur.close()
    conn.close()
