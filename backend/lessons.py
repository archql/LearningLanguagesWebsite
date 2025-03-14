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

    @app.route('/api/lesson/<int:id>', methods=['GET'])
    @jwt_required()
    def get_lesson(id):
        user_id = get_jwt_identity()

        conn = get_db_connection()
        try:
            lesson = conn.execute(
                "SELECT * FROM Lessons WHERE lesson_id = ?",
                (id,)
            ).fetchone()

            if not lesson:
                return jsonify({"error": "Lesson not found"}), 404

            # Данные урока извлекаются из поля data (в формате JSON)
            lesson_data = json.loads(lesson['data'])

            # Преобразуем данные в формат Lesson
            result = {
                "topic": lesson_data.get("topic", ""),
                "vocabulary_list": lesson_data.get("vocabulary_list", []),
                "introduction": lesson_data.get("introduction", ""),
                "presentation": lesson_data.get("presentation", ""),
                "practice": lesson_data.get("practice", []),
                "conclusion": lesson_data.get("conclusion", "")
            }

            return jsonify(result)

        except Exception as e:
            app.logger.error(f"Lessons database error: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500

        finally:
            conn.close()

    @app.route("/api/exercises/<int:lesson_id>", methods=["GET"])
    def get_exercises(lesson_id):
        lesson = get_lesson_by_id(lesson_id)
        if not lesson:
            return jsonify({"error": "Lesson not found"}), 404
        
        practice = lesson.get("practice", [])
        
        exercise_be = {
            "mcRange": [],
            "mcQuestions": [],
            "mcOptions": [],
            "mcCorrectAnswers": [],
            "fbRange": [],
            "fbBeforeBlank": [],
            "fbAfterBlank": [],
            "fbCorrectAnswers": [],
            "mcGivenAnswers": [],
            "fbGivenAnswers": []
        }
        
        for i, ex in enumerate(practice):
            if ex["type"] == "fill_blank":
                exercise_be["fbRange"].append(i)
                exercise_be["fbBeforeBlank"].append(ex["data"][0])
                exercise_be["fbAfterBlank"].append(ex["data"][1])
                exercise_be["fbCorrectAnswers"].append(ex["data"][2])
            elif ex["type"] == "multiple_choice":
                exercise_be["mcRange"].append(i)
                exercise_be["mcQuestions"].append(ex["data"][0])
                exercise_be["mcCorrectAnswers"].append(ex["data"][1])
                exercise_be["mcOptions"].append(ex["data"][2:])
        
        return jsonify(exercise_be)