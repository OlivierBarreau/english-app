-- \i '/Users/lucasgrospellier/Documents/english-app/table_config.sql'
-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    firstname VARCHAR(100),
    lastname VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS lesson_result (
    id SERIAL PRIMARY KEY,
    lesson_completion INT,
    lesson_right_answer INT,
    lesson_isdone BOOLEAN,
    lesson_questions_results JSON
);


CREATE TABLE IF NOT EXISTS program (
    id SERIAL PRIMARY KEY,
    program_completion INT,
    program_right_answer INT
);

-- Create the lesson table
CREATE TABLE IF NOT EXISTS lesson (
    id SERIAL PRIMARY KEY,
    lesson_type VARCHAR(100),
    lesson_title VARCHAR(100),
    lesson_content JSON,
    lesson_importance INT,
    lesson_level VARCHAR(100)
);

-- Create the question table with a foreign key to the lesson table
CREATE TABLE IF NOT EXISTS question (
    id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES lesson(id) ON DELETE CASCADE, -- Foreign key referencing the lesson table
    question_type VARCHAR(100),
    question_content JSON
);
