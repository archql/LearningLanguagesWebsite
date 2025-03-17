from flask import request, jsonify
import json
import sqlite3
import ollama
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

        try:
            conn = sqlite3.connect("lessons.db")
            conn.row_factory = sqlite3.Row

            # Подключаем другие базы данных
            conn.execute('ATTACH DATABASE "users.db" AS users_db')
            conn.execute('ATTACH DATABASE "user_progress.db" AS progress_db')

            # Получаем язык пользователя
            user_data = conn.execute(
                'SELECT preferred_language FROM users_db.Users WHERE user_id = ?',
                (user_id,)
            ).fetchone()

            if user_data and user_data["preferred_language"]:
                user_language = user_data["preferred_language"]

            # Получаем все темы
            topics_data = conn.execute(
                "SELECT DISTINCT topic FROM Lessons WHERE language = ? and lesson_id < 100000", (user_language,)
            ).fetchall()

            if not topics_data:
                return jsonify([])

            result = []
            for topic_row in topics_data:
                topic_name = topic_row["topic"]

                # Получаем все уроки по теме с прогрессом пользователя
                lessons = conn.execute(
                    """
                    SELECT l.lesson_id, l.title, l.data, COALESCE(up.score, 0) AS score
                    FROM Lessons l
                    LEFT JOIN progress_db.UserProgress up 
                    ON l.lesson_id = up.lesson_id AND up.user_id = ?
                    WHERE l.topic = ? AND l.language = ?
                    """,
                    (user_id, topic_name, user_language),
                ).fetchall()

                lessons_list = [
                    {
                        "id": lesson["lesson_id"],
                        "title": lesson["title"],
                        "route": f"/lessons/{lesson['lesson_id']}",
                        "description": lesson["data"],
                        "completed": lesson["score"]
                    }
                    for lesson in lessons
                ]

                # Получаем прогресс пользователя по данной теме
                progress_data = conn.execute(
                    """
                    SELECT COUNT(*) AS completed_lessons
                    FROM progress_db.UserProgress
                    WHERE user_id = ? AND lesson_id IN (
                        SELECT lesson_id FROM Lessons WHERE topic = ? AND language = ?
                    )
                    """,
                    (user_id, topic_name, user_language),
                ).fetchone()

                completed_lessons = progress_data["completed_lessons"] if progress_data else 0
                total_lessons = len(lessons_list)
                completion_percentage = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0

                result.append({
                    "title": topic_name,
                    "lessons": lessons_list,
                    "completionPercentage": completion_percentage
                })

            return jsonify(result)

        except Exception as e:
            app.logger.error(f"Database error: {str(e)}")
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
                "conclusion": lesson_data.get("conclusion", ""),
                "language": lesson_data.get("language", "")

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
        try:
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
            

            fbCounter = 0
            mcCounter = 0
            for i, ex in enumerate(practice):
                if ex["type"] == "fill_blank":
                    exercise_be["fbRange"].append(fbCounter)
                    fbCounter+=1
                    exercise_be["fbBeforeBlank"].append(ex["data"][0])
                    exercise_be["fbAfterBlank"].append(ex["data"][1])
                    exercise_be["fbCorrectAnswers"].append(ex["data"][2])
                    exercise_be["fbGivenAnswers"].append("null")
                elif ex["type"] == "multiple_choice":
                    exercise_be["mcRange"].append(mcCounter)
                    mcCounter+=1
                    exercise_be["mcQuestions"].append(ex["data"][0])
                    exercise_be["mcCorrectAnswers"].append(ex["data"][1])
                    exercise_be["mcOptions"].append(ex["data"][2:])
                    exercise_be["mcGivenAnswers"].append("null")
            
            
            return jsonify(exercise_be)

        
        except Exception as e:
            app.logger.error(f"Lessons database error: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500

        finally:
            conn.close()

    
    @app.route('/api/user/vocabulary/add', methods=['POST'])
    @jwt_required()
    def add_vocabulary():
        user_id = get_jwt_identity()
        data = request.get_json()

        # Получаем слово и язык перевода из запроса
        word = data.get('word')
        language_code = data.get('language')  # Язык, переданный с фронтенда

        if not word or not language_code:
            return jsonify({"message": "Both word and language are required"}), 400

        # Подключаемся к БД
        conn = sqlite3.connect("vocabulary.db")
        cursor = conn.cursor()

        LANGUAGE_MAPPING = {
        'en': 'English',
        'de': 'German',
        'ru': 'Russian', 
        'by': 'Belarusian'
        }
        # Создаем промпт для ЛЛМ
        language = LANGUAGE_MAPPING.get(language_code, "English")

        prompt = f"""
            Translate the word '{word}' into {language}. Only return the translation, no extra text.
            Output should be one word only.
        """

        try:
            # Получаем перевод через ЛЛМ
            response = ollama.chat(
                model="llama3.2:1b",
                messages=[{'role': 'user', 'content': prompt}],
                options={"temperature": 0.7, "max_tokens": 1}
            )

            translation = response['message']['content'].strip()

            if not translation:
                return jsonify({"message": "Failed to generate translation"}), 500

            # Записываем слово и перевод в БД
            try:
                cursor.execute("""
                    INSERT INTO Vocabulary (user_id, word, translation)
                    VALUES (?, ?, ?)
                    ON CONFLICT(user_id, word, translation) DO NOTHING
                """, (user_id, word, translation))
                conn.commit()
            except sqlite3.IntegrityError:
                # Слово уже существует в базе, ничего не делаем
                pass

            conn.close()

            return jsonify({"message": "Word and translation added successfully", "word": word, "translation": translation}), 200

        except Exception as e:
            app.logger.error(f"LLM Request Failed: {str(e)}")
            conn.close()
            return jsonify({"message": "Error processing translation request"}), 500
    

    from datetime import datetime

    @app.route('/api/user/progress/submit', methods=['POST'])
    @jwt_required()
    def submit_lesson():
        user_id = get_jwt_identity()
        data = request.get_json()
        lesson_id = data.get('lessonId')
        score = data.get('score')
        game_score = data.get('game_score')

        if lesson_id is None or score is None:
            return jsonify({"message": "lessonId and score are required"}), 400

        try:
            # Подключение к БД lessons
            conn_lessons = sqlite3.connect("lessons.db")
            cursor_lessons = conn_lessons.cursor()

            # Получаем название урока
            cursor_lessons.execute("SELECT topic, title FROM Lessons WHERE lesson_id = ?", (lesson_id,))
            lesson = cursor_lessons.fetchone()
            conn_lessons.close()

            if not lesson:
                return jsonify({"message": "Lesson not found"}), 404
            
            topic_title = lesson[0]
            lesson_title = lesson[1]
            
            # Текущее время прохождения урока
            completion_time = datetime.now().strftime('%Y-%m-%d')  # Формат: 'YYYY-MM-DDTHH:MM:SS'

            # Подключение к БД user_progress
            conn_progress = sqlite3.connect("user_progress.db")
            cursor_progress = conn_progress.cursor()

            # Запись прогресса
            cursor_progress.execute("""
                INSERT INTO UserProgress (user_id, lesson_id, topic_title, lesson_title, status, score, completion_time)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id, lesson_id) DO NOTHING
                """, (user_id, lesson_id, topic_title, lesson_title, "completed", score, completion_time))
            conn_progress.commit()
            conn_progress.close()

            # Подключение к БД gamification
            conn_gamification = sqlite3.connect("gamification.db")
            cursor_gamification = conn_gamification.cursor()

            # Обновление опыта
            cursor_gamification.execute("""
                INSERT INTO Gamification (user_id, experience_points)
                VALUES (?, ?)
                ON CONFLICT(user_id) DO UPDATE SET experience_points = (SELECT experience_points FROM Gamification WHERE user_id = ?) + ?
                """, (user_id, game_score, user_id, game_score))
            conn_gamification.commit()
            conn_gamification.close()

            # Если lesson_id больше 99999, обновляем поле daily_challenge_date в таблице Users
            if lesson_id > 99999:
                current_date = datetime.now().strftime('%Y-%m-%d')
                conn_users = sqlite3.connect("users.db")
                cursor_users = conn_users.cursor()

                cursor_users.execute("""
                    UPDATE Users
                    SET daily_challenge_date = ?
                    WHERE user_id = ?
                """, (current_date, user_id))
                conn_users.commit()
                conn_users.close()

            return jsonify({"message": "Lesson progress saved and experience points awarded"}), 200

        except Exception as e:
            return jsonify({"message": "Internal server error", "error": str(e)}), 500

