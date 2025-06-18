import os
import psycopg2
import numpy as np
from dotenv import load_dotenv
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
        SELECT "GlobalPropertyID",
               "cleanliness_score", "food_score", "sleep_score",
               "internet_score", "amenities_score",
               "DistanceFromAirportKm",
               "hasLocker", "hasFitness", "hasRelaxArea",
               "hasTurkishBath", "hasSpa", "hasFitnessRoom", "hasSauna"
        FROM "Hotels"
        WHERE cleanliness_score IS NOT NULL
          AND food_score IS NOT NULL
          AND sleep_score IS NOT NULL
          AND internet_score IS NOT NULL
          AND amenities_score IS NOT NULL
          AND "DistanceFromAirportKm" IS NOT NULL
    """)
    rows = cur.fetchall()

    if not rows:
        return

    final_scores = []

    distances = [row[6] for row in rows]
    scaler = MinMaxScaler()
    normalized_distances = scaler.fit_transform(np.array(distances).reshape(-1, 1))
    inverted_distances = 1 - normalized_distances.flatten()


    for i, row in enumerate(rows):
        hotel_id = row[0]
        cleanliness = row[1]
        food = row[2]
        sleep = row[3]
        internet = row[4]
        amenities_score = row[5]
        distance_score = inverted_distances[i]

        facilities = row[7:]
        facility_score = sum(facilities) / 7 


        final_score = round(
            0.20 * cleanliness +
            0.10 * food +
            0.10 * sleep +
            0.05 * internet +
            0.20 * amenities_score +
            0.10 * distance_score +
            0.25 * facility_score,
            6
        )

        final_scores.append((final_score, hotel_id))

       

    for score, hotel_id in final_scores:
        cur.execute("""
            UPDATE "Hotels"
            SET "final_score" = %s
            WHERE "GlobalPropertyID" = %s
        """, (score, hotel_id))

    conn.commit()
    cur.close()
    conn.close()
    
if __name__ == "__main__":
    main()

#Clean- Este frecvent cel mai important factor de satisfacție conform studiului, corelat cu RevPAR.
#Amenities - Reflectă percepția utilizatorilor asupra facilităților generale
#Sleep quality - Odihna e esențială pentru satisfacția generală
#Food - Aprecierea serviciilor de masă influențează frecvent scorul general.
#Internet - Important în special pentru turiști de business, dar cu impact mai redus în medie.
#Distance from airport- Distanțele mari afectează comoditatea, mai ales pentru turiști străini. 
#Facilities - Prezența efectivă a unor facilități (spa, saună etc.) diferențiază puternic hotelurile comparabile.