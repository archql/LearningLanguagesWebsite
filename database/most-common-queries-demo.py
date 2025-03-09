import sqlite3

def fetch_all_users():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Users")
    users = cursor.fetchall()
    conn.close()
    return users

def fetch_user_progress():
    conn = sqlite3.connect("user_progress.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM UserProgress") 
    progress = cursor.fetchall()
    conn.close()
    return progress

def join_users_progress():
    conn = sqlite3.connect("user_progress.db")  
    cursor = conn.cursor()
    
    # here ATTACH is very important to be able to join tables
    cursor.execute('ATTACH DATABASE "users.db" AS users_db')

    cursor.execute("""
        SELECT Users.username, UserProgress.lesson_id, UserProgress.status, UserProgress.score
        FROM users_db.Users
        JOIN UserProgress ON users_db.Users.user_id = UserProgress.user_id
    """)  
    results = cursor.fetchall()
    conn.close()
    return results

def update_user_score(user_id, lesson_id, new_score):
    conn = sqlite3.connect("user_progress.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE UserProgress SET score = ? WHERE user_id = ? AND lesson_id = ?", 
                   (new_score, user_id, lesson_id))
    conn.commit()
    conn.close()

def delete_user(user_id):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Users WHERE user_id = ?", (user_id,))
    conn.commit()
    conn.close()

# functions demo
print("all users:", fetch_all_users())
print("users' progress:", fetch_user_progress())

try:
    print("joined data:", join_users_progress())
except sqlite3.OperationalError as e:
    print("Error while joining tables:", e)

update_user_score(1, 1, 95)  
print("data after update:", fetch_user_progress())

delete_user(2) 
print("after deleting:", fetch_all_users())