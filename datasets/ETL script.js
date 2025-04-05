import psycopg2
import pandas as pd
from datetime import datetime

# Load your structured DataFrame here instead if using interactively
# For this example, assume `parsed_df` is already defined

# Connection settings (replace with your actual database details)
conn = psycopg2.connect(
    dbname="your_db_name",
    user="your_username",
    password="your_password",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# Create table
cur.execute("""
    CREATE TABLE IF NOT EXISTS episodes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        air_date DATE NOT NULL,
        season_number INTEGER,
        episode_number INTEGER,
        subject TEXT,
        colors_used TEXT,
        description TEXT
    );
""")
conn.commit()

# Insert data
for _, row in parsed_df.iterrows():
    cur.execute("""
        INSERT INTO episodes (title, air_date, season_number, episode_number, subject, colors_used, description)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
    """, (
        row["title"],
        row["air_date"].date(),
        row["season_number"],
        row["episode_number"],
        row["subject"],
        row["colors_used"],
        row["description"]
    ))

conn.commit()
cur.close()
conn.close()
