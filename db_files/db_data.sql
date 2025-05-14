-- CREATE DATABASE EnglishDB;
-- \c englishdb;
-- \i '/Users/lucasgrospellier/Documents/english-app/db_files/db_data.sql'
-- Insert sample data
INSERT INTO users (login, password, firstname, lastname) 
VALUES 
('alice@example.com','$2b$10$dr5qfCazDFtHGwqY6RRLvuDWDnzsrkRyUJSPuKzC/7v7c1FPjxkSm','alice', 'dupont'), -- password : mdp
('lucas.grospellier@orange.fr','$2b$10$7AfJr7IsMcJAdCLVSVYTce244AnFFm50lS5/OEYSkJ0R4WkF6GPlW','lucas', 'grospellier');-- password : lucasmdp

INSERT INTO lesson (lesson_type, lesson_title, lesson_content, lesson_importance, lesson_level) 
VALUES 
('grammar', 'Futur continuous', 
    '{"description": "This lesson is about futur continuous", "examples": ["When you come out of school tomorrow, I''ll be boarding a plane.",
"Try to call before 8 o''clock. After that, we''ll be watching the match.",
"You can visit us during the first week of July. I won''t be working then."]}', 2, 'B2'),

('Vocabulary', 'Common English Idioms', 
'{"description": "This lesson covers common English idioms and their meanings.", 
   "examples": [
     {"idiom": "Break the ice", "meaning": "To start a conversation in a social setting."},
     {"idiom": "Piece of cake", "meaning": "Something that is very easy to do."},
     {"idiom": "Under the weather", "meaning": "Feeling unwell or sick."}
   ]}', 
 5, 'B1');

INSERT INTO question (question_type, question_content) 
VALUES 
('MCQ', '{"question": "What will you be doing tomorrow at 3 PM?", "options": ["I will be reading a book.", "I will read a book.", "I am reading a book.", "I have read a book."], "correct_answer": "I will be reading a book."}'),
('MCQ', '{"question": "What is the correct sentence for future continuous?", "options": ["He will be work tomorrow.", "He will be working tomorrow.", "He will work tomorrow.", "He will working tomorrow."], "correct_answer": "He will be working tomorrow."}');

INSERT INTO lesson_result (user_id, lesson_id, lesson_completion, lesson_right_answer) 
VALUES 
(1, 1, 90, 80),
(1, 2, 75, 60);
