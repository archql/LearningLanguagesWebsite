import sqlite3

def insert_test_users():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.executemany('''INSERT INTO Users (username, email, password, preferred_language) VALUES (?, ?, ?, ?)''', # question marks are the place holders for values
                        [("user1", "user1@example.com", "pass1", "English"),
                         ("user2", "user2@example.com", "pass2", "Spanish")])
    conn.commit()
    conn.close()

def insert_test_lessons():
    conn = sqlite3.connect("lessons.db")
    cursor = conn.cursor()
    cursor.executemany('''INSERT INTO Lessons (title, description, theory) VALUES (?, ?, ?)''',
                        [("Lesson 1", "Introduction to language", "Basic theory"),
                         ("Lesson 2", "Grammar Basics", "Intermediate theory")])
    conn.commit()
    conn.close()

def insert_test_user_progress():
    conn = sqlite3.connect("user_progress.db")
    cursor = conn.cursor()
    cursor.executemany('''INSERT INTO UserProgress (user_id, lesson_id, status, score) VALUES (?, ?, ?, ?)''',
                        [(1, 1, "Completed", 85),
                         (2, 2, "In Progress", 70)])
    conn.commit()
    conn.close()

def insert_test_gamification():
    conn = sqlite3.connect("gamification.db")
    cursor = conn.cursor()
    cursor.executemany('''INSERT INTO Gamification (user_id, experience_points) VALUES (?, ?)''',
                        [(1, 100),
                         (2, 150)])
    conn.commit()
    conn.close()

def insert_test_vocabulary():
    conn = sqlite3.connect("vocabulary.db")
    cursor = conn.cursor()
    cursor.executemany('''INSERT INTO Vocabulary (user_id, word, translation) VALUES (?, ?, ?)''',
                        [(1, "hello", "hola"),
                         (2, "book", "libro")])
    conn.commit()
    conn.close()

def main():
    insert_test_users()
    insert_test_lessons()
    insert_test_user_progress()
    insert_test_gamification()
    insert_test_vocabulary()
    print("Test data inserted successfully.")

if __name__ == "__main__":
    main()