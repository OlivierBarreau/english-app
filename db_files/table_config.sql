-- \i '/Users/lucasgrospellier/Documents/english-app/db_files/table_config.sql'
-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    firstname VARCHAR(100),
    lastname VARCHAR(100)
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


CREATE TABLE IF NOT EXISTS lesson_result (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,  -- Links to the user who took the lesson
    lesson_id INT REFERENCES lesson(id) ON DELETE CASCADE,  -- Links to the lesson being completed
    lesson_completion INT,  -- Percentage of lesson completed
    lesson_right_answer INT  -- Percentage of correct answers
);



CREATE TABLE IF NOT EXISTS program (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,  -- Links to the user who took the lesson
    program_completion INT,
    program_right_answer INT
);


-- Create the question table with a foreign key to the lesson table
CREATE TABLE IF NOT EXISTS question (
    id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES lesson(id) ON DELETE CASCADE, -- Foreign key referencing the lesson table
    question_type VARCHAR(100),
    question_content JSON
);


-- Table d'association entre les lecons et un programme
CREATE TABLE IF NOT EXISTS program_lessons (
    program_id INT REFERENCES program(id) ON DELETE CASCADE,
    lesson_id INT REFERENCES lesson(id) ON DELETE CASCADE,
    lesson_order INT,  -- Position de la leçon dans le programme
    PRIMARY KEY (program_id, lesson_id)
);


CREATE TABLE IF NOT EXISTS question_result (
    id SERIAL PRIMARY KEY,
    lesson_result_id INT REFERENCES lesson_result(id) ON DELETE CASCADE,  -- Links to the lesson result
    question_id INT REFERENCES question(id) ON DELETE CASCADE,  -- Links to the question
    is_answer_correct BOOLEAN,  -- Was the answer correct? (true/false)
    user_answer VARCHAR(100)  -- The user's answer
);

