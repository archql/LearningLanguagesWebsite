from flask import request, jsonify
import json
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
            user_conn = sqlite3.connect('users.db')  # Подключение к базе данных пользователей
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

        # Подключаемся к основной базе данных
        conn = get_db_connection()  # Функция get_db_connection должна подключать к нужной базе
        try:
            # Получаем все темы
            topics_data = conn.execute(
                """
                SELECT DISTINCT topic 
                FROM Lessons 
                WHERE language = ?
                """,
                (user_language,)
            ).fetchall()

            if not topics_data:
                return jsonify([])

            result = []
            for topic_row in topics_data:
                topic_name = topic_row["topic"]

                # Получаем все уроки по данной теме
                lessons = conn.execute(
                    """
                    SELECT lesson_id, title, data 
                    FROM Lessons 
                    WHERE topic = ? AND language = ?
                    """,
                    (topic_name, user_language),
                ).fetchall()

                lessons_list = [
                    {
                        "id": lesson["lesson_id"],
                        "title": lesson["title"],
                        "route": f"/lessons/{lesson['lesson_id']}",
                        "description": lesson["data"]
                    }
                    for lesson in lessons
                ]

                # Получаем прогресс пользователя по данной теме
                try:
                    progress_conn = sqlite3.connect('user_progress.db')  # Подключаемся к базе данных user_progress
                    progress_conn.row_factory = sqlite3.Row
                    completed_lessons = progress_conn.execute(
                        """
                        SELECT COUNT(*) FROM UserProgress
                        WHERE user_id = ? AND lesson_id IN (
                            SELECT lesson_id FROM Lessons WHERE topic = ? AND language = ?
                        )
                        """,
                        (user_id, topic_name, user_language),
                    ).fetchone()[0]

                    total_lessons = len(lessons_list)
                    completion_percentage = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0

                except Exception as e:
                    app.logger.error(f"User progress database error: {str(e)}")
                    completed_lessons = 0
                    total_lessons = 0
                    completion_percentage = 0
                finally:
                    progress_conn.close()

                result.append({
                    "title": topic_name,
                    "lessons": lessons_list,
                    "completionPercentage": completion_percentage
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
    @jwt_required()
    def get_exercises(lesson_id):
        
        user_id = get_jwt_identity()

        conn = get_db_connection()

        #try:
        lesson = conn.execute(
                "SELECT * FROM Lessons WHERE lesson_id = ?",
                (lesson_id,)
            ).fetchone()
        if not lesson:
            return jsonify({"error": "Lesson not found"}), 404
        
        lesson_data = json.loads(lesson['data'])


        practice = lesson_data.get("practice", [])
        
        

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

        for i, ex in enumerate(practice):
            if ex["type"] == "multiple_choice":
                exercise_be["mcRange"].append(i)
                exercise_be["mcQuestions"].append(ex["data"][0])
                exercise_be["mcCorrectAnswers"].append(ex["data"][1])
                exercise_be["mcOptions"].append(ex["data"][2:])
        
        
        return jsonify(exercise_be)

        """
        except Exception as e:
            app.logger.error(f"Lessons database error: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500

        finally:
            conn.close()
        """