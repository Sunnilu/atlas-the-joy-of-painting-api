-- Create the database
CREATE DATABASE joy_of_painting;
\c joy_of_painting;

-- Episodes table
CREATE TABLE episodes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    season INT NOT NULL,
    episode_number INT NOT NULL,
    air_date DATE
);

-- Paintings table
CREATE TABLE paintings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    episode_id INT REFERENCES episodes(id) ON DELETE CASCADE
);

-- Colors table
CREATE TABLE colors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hex_code VARCHAR(7) UNIQUE
);

-- Junction table for Paintings ↔ Colors (Many-to-Many)
CREATE TABLE painting_colors (
    painting_id INT REFERENCES paintings(id) ON DELETE CASCADE,
    color_id INT REFERENCES colors(id) ON DELETE CASCADE,
    PRIMARY KEY (painting_id, color_id)
);

-- Guests table (optional)
CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Junction table for Episodes ↔ Guests (Many-to-Many)
CREATE TABLE episode_guests (
    episode_id INT REFERENCES episodes(id) ON DELETE CASCADE,
    guest_id INT REFERENCES guests(id) ON DELETE CASCADE,
    PRIMARY KEY (episode_id, guest_id)
);

-- Indexes for faster querying
CREATE INDEX idx_episode_season ON episodes (season);
CREATE INDEX idx_episode_title ON episodes (title);
