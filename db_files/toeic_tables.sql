-- TOEIC Test Tables

-- Table for TOEIC test instances
CREATE TABLE IF NOT EXISTS toeic_tests (
    id SERIAL PRIMARY KEY,
    test_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table for TOEIC questions
CREATE TABLE IF NOT EXISTS toeic_questions (
    id SERIAL PRIMARY KEY,
    section VARCHAR(20) CHECK (section IN ('listening', 'reading')) NOT NULL,
    question_type VARCHAR(20) CHECK (question_type IN ('image', 'multiple-choice', 'true-false', 'fill-in-blank')) NOT NULL,
    question_order INT NOT NULL,
    question_content JSONB NOT NULL,
    correct_answer VARCHAR(255) NOT NULL
);

-- Table for TOEIC test results for each user
CREATE TABLE IF NOT EXISTS toeic_results (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    listening_score INT NOT NULL DEFAULT 0,
    reading_score INT NOT NULL DEFAULT 0,
    total_score INT NOT NULL DEFAULT 0,
    completion_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES toeic_tests(id) ON DELETE CASCADE
);

-- Table for user answers to each TOEIC question
CREATE TABLE IF NOT EXISTS toeic_answers (
    id SERIAL PRIMARY KEY,
    result_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (result_id) REFERENCES toeic_results(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES toeic_questions(id) ON DELETE CASCADE
);

-- Insert sample questions for listening section
INSERT INTO toeic_questions (section, question_type, question_order, question_content, correct_answer) VALUES
(
    'listening', 
    'image', 
    1, 
    '{"question": "What does the woman suggest?", "imageUrl": "/images/toeic/sample1.jpg", "options": ["Ordering a new computer", "Fixing the current computer", "Buying a different brand", "Asking for a refund"]}'::jsonb,
    'Fixing the current computer'
),
(    'listening', 
    'multiple-choice', 
    2, 
    '{"question": "What are the speakers discussing?", "options": ["A business proposal", "A marketing strategy", "A budget report", "A client meeting"]}'::jsonb,
    'A business proposal'
),
(    'listening', 
    'multiple-choice', 
    3, 
    '{"question": "When will the meeting take place?", "options": ["Monday morning", "Tuesday afternoon", "Wednesday morning", "Thursday afternoon"]}'::jsonb,
    'Wednesday morning'
),
(    'listening', 
    'image', 
    4, 
    '{"question": "What is the man doing?", "imageUrl": "/images/toeic/sample2.jpg", "options": ["Walking to his car", "Opening an umbrella", "Looking for his keys", "Waiting for a taxi"]}'::jsonb,
    'Opening an umbrella'
),
(    'listening', 
    'multiple-choice', 
    5, 
    '{"question": "What is the woman concerned about?", "options": ["The weather forecast", "The delivery time", "The product quality", "The payment method"]}'::jsonb,
    'The delivery time'
);

-- Insert sample questions for reading section
INSERT INTO toeic_questions (section, question_type, question_order, question_content, correct_answer) VALUES
(
    'reading', 
    'multiple-choice', 
    1, 
    '{"question": "What is the primary purpose of this memo?", "text": "TO: All Staff\nFROM: HR Department\nSUBJECT: Office Renovation\n\nPlease be advised that the office renovation will begin on Monday, June 15th. During this time, Sections A and B will be temporarily relocated to the 3rd floor. We anticipate the work to be completed by July 31st. Thank you for your patience.", "options": ["To announce a staff relocation", "To explain a renovation schedule", "To request renovation suggestions", "To apologize for construction delays"]}'::jsonb,
    'To explain a renovation schedule'
),
(    'reading', 
    'true-false', 
    2, 
    '{"question": "According to the memo, the renovation will last for approximately six weeks.", "text": "TO: All Staff\nFROM: HR Department\nSUBJECT: Office Renovation\n\nPlease be advised that the office renovation will begin on Monday, June 15th. During this time, Sections A and B will be temporarily relocated to the 3rd floor. We anticipate the work to be completed by July 31st. Thank you for your patience."}'::jsonb,
    'True'
),
(    'reading', 
    'multiple-choice', 
    3, 
    '{"question": "What does the advertisement suggest?", "text": "GRAND OPENING SALE!\nTechWorld Electronics\n50% off all laptops and tablets\nThis weekend only: May 12-13\nFirst 100 customers receive a free wireless mouse.\nOpen 9 AM - 9 PM", "options": ["The store is permanently closing", "The sale happens every weekend", "This is a new store opening", "The store sells only laptops"]}'::jsonb,
    'This is a new store opening'
),
(    'reading', 
    'fill-in-blank', 
    4, 
    '{"question": "The company''s quarterly profits ________ by 15% compared to last year.", "options": ["increased", "increasing", "increase", "increases"]}'::jsonb,
    'increased'
),
(    'reading', 
    'multiple-choice', 
    5, 
    '{"question": "What is being announced in this email?", "text": "Dear Valued Customer,\n\nWe are writing to inform you that starting June 1st, our customer service hours will be extended to 24/7. This change is being made to better accommodate our international clients and to improve overall customer satisfaction.\n\nThank you for your continued support.\n\nCustomer Service Department", "options": ["A website maintenance", "A policy change", "A price increase", "Extended service hours"]}'::jsonb,
    'Extended service hours'
);
