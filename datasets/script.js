-- Create main episodes table
CREATE TABLE episodes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    air_date DATE NOT NULL,
    season_number INT,
    episode_number INT,
    description TEXT
);

-- Subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Colors table
CREATE TABLE colors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Join table for episodes ↔ subjects
CREATE TABLE episode_subjects (
    episode_id INT REFERENCES episodes(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (episode_id, subject_id)
);

-- Join table for episodes ↔ colors
CREATE TABLE episode_colors (
    episode_id INT REFERENCES episodes(id) ON DELETE CASCADE,
    color_id INT REFERENCES colors(id) ON DELETE CASCADE,
    PRIMARY KEY (episode_id, color_id)
);
