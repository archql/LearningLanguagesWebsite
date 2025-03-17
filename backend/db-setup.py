import sqlite3

def create_users_db():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS Users (
                        user_id INTEGER PRIMARY KEY,
                        username TEXT NOT NULL,
                        email TEXT NOT NULL,
                        password TEXT NOT NULL,
                        preferred_language TEXT,
                        cultural_note TEXT,
                        cultural_note_date TEXT,
                        daily_challenge_date TEXT
                    )''')
    conn.commit()
    conn.close()

def create_lessons_db():
    conn = sqlite3.connect("lessons.db")
    cursor = conn.cursor()

    cursor.execute('''CREATE TABLE IF NOT EXISTS Lessons (
                        lesson_id INTEGER PRIMARY KEY AUTOINCREMENT,   
                        language TEXT NOT NULL,
                        topic TEXT NOT NULL,                        
                        title TEXT NOT NULL,                           
                        data TEXT  
                    )''')
    
    conn.commit()
    conn.close()

def create_user_progress_db():
    conn = sqlite3.connect("user_progress.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS UserProgress (
                        progress_id INTEGER PRIMARY KEY,
                        user_id INTEGER,
                        lesson_id INTEGER,
                        topic_title TEXT,
                        lesson_title TEXT,
                        status TEXT,
                        score BOOLEAN,
                        completion_time TEXT,
                        UNIQUE(user_id, lesson_id),
                        FOREIGN KEY(user_id) REFERENCES Users(user_id),
                        FOREIGN KEY(lesson_id) REFERENCES Lessons(lesson_id)
                    )''')
    conn.commit()
    conn.close()

def create_gamification_db():
    conn = sqlite3.connect("gamification.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS Gamification (
                        gamification_id INTEGER PRIMARY KEY,
                        user_id INTEGER UNIQUE,
                        experience_points INTEGER,
                        FOREIGN KEY(user_id) REFERENCES Users(user_id)
                    )''')
    conn.commit()
    conn.close()

def create_vocabulary_db():
    conn = sqlite3.connect("vocabulary.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS Vocabulary (
                        vocabulary_id INTEGER PRIMARY KEY,
                        user_id INTEGER,
                        word TEXT NOT NULL,
                        translation TEXT NOT NULL,
                        UNIQUE(user_id, word, translation),
                        FOREIGN KEY(user_id) REFERENCES Users(user_id)
                    )''')
    conn.commit()
    conn.close()

def main():
    create_users_db()
    create_lessons_db()
    create_user_progress_db()
    create_gamification_db()
    create_vocabulary_db()
    print("Databases created successfully.")

if __name__ == "__main__":
    main()
