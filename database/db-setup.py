import sqlite3

def create_users_db():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS Users (
                        user_id INTEGER PRIMARY KEY,
                        username TEXT NOT NULL,
                        email TEXT NOT NULL,
                        password TEXT NOT NULL,
                        preferred_language TEXT
                    )''')
    conn.commit()
    conn.close()

def create_lessons_db():
    conn = sqlite3.connect("lessons.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS Lessons (
                        lesson_id INTEGER PRIMARY KEY,
                        title TEXT NOT NULL,
                        description TEXT,
                        theory TEXT
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
                        status TEXT,
                        score INTEGER,
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
                        user_id INTEGER,
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
