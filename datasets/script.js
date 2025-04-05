-- Create the episodes table
CREATE TABLE episodes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    air_date DATE NOT NULL,
    season_number INTEGER,
    episode_number INTEGER,
    description TEXT
);

