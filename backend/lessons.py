from flask import request, jsonify
import sqlite3
from flask_jwt_extended import jwt_required, get_jwt_identity

def register_routes(app):
    LESSONS_DB_PATH = "lessons.db"

    def get_db_connection():
        conn = sqlite3.connect(LESSONS_DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    @app.route('/api/topics', methods=['GET'])
    @jwt_required()
    def get_topics():
        user_id = get_jwt_identity()
        user_language = 'en'  # Значение по умолчанию

        # Получаем язык пользователя из базы данных
        try:
            user_conn = sqlite3.connect('users.db')
            user_conn.row_factory = sqlite3.Row
            user = user_conn.execute(
                "SELECT preferred_language FROM Users WHERE user_id = ?",
                (user_id,)
            ).fetchone()
            if user and user['preferred_language']:
                user_language = user['preferred_language']
        except Exception as e:
            app.logger.error(f"User database error: {str(e)}")
        finally:
            user_conn.close()

        # Основная логика получения тем
        conn = get_db_connection()
        try:
            topics = conn.execute(
                """
                SELECT DISTINCT title 
                FROM Lessons 
                WHERE language = ?  -- Фильтрация по языку
                """,
                (user_language,)
            ).fetchall()

            if not topics:
                return jsonify([])

            result = []
            for topic in topics:
                lesson_title = topic["title"]

                lessons = conn.execute(
                    """
                    SELECT lesson_id, title, description 
                    FROM Lessons 
                    WHERE title = ? AND language = ?  -- Добавлено условие языка
                    """,
                    (lesson_title, user_language),
                ).fetchall()

                lessons_list = [
                    {
                        "id": lesson["lesson_id"],
                        "title": lesson["title"],
                        "route": f"/lessons/{lesson['lesson_id']}",
                        "description": lesson["description"]
                    }
                    for lesson in lessons
                ]

                result.append({
                    "title": lesson_title,
                    "lessons": lessons_list,
                    "completionPercentage": 0
                })
            
            return jsonify(result)
        
        except Exception as e:
            app.logger.error(f"Lessons database error: {str(e)}")
            return jsonify([])
        
        finally:
            conn.close()