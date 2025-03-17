from flask import jsonify
import random
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import set_access_cookies
from flask import make_response
import sqlite3  
import ollama
import re
import json

def register_routes(app):
    DEFAULT_NOTE = {
        "quote": "The only true wisdom is in knowing you know nothing.",
        "author": "Socrates"
    }

    DEFAULT_CHALLENGE = {
        "title": "Learn a new word today!",
        "description": "Try to learn and use at least one new word in your vocabulary."
    }

    # Мэппинг сокращенных кодов языков на полные названия
    LANGUAGE_MAPPING = {
        'en': 'English',
        'de': 'German',
    }

    def clean_text(text):
        cleaned = re.sub(r'^[\"\']|[\"\']$|®|[*`]', '', text).strip()
        if len(cleaned.split()) < 3 and 'schema' not in cleaned.lower():
            return cleaned
        if any(word in cleaned.lower() for word in ['schema', 'json']):
            return None
        return cleaned

    def extract_cultural_note(text):
        patterns = [
            r'[{"]quote["\s]*:[\s"]*([^"]+)[\s"]*,[\s"]*author["\s]*:[\s"]*([^"]+)',
            r'[\"\']([^\"\']{10,})[\"\'][\s]*-[\s]*([A-Za-z ]{3,})',
            r'«([^»]{10,})»[\s]*$begin:math:text$?([A-Za-z ]{3,})$end:math:text$?',
            r'Quote:\s*([^\n]{10,})\s*Author:\s*([^\n]{3,})',
            r'([A-Za-z ,.\'’-]{20,})[\s]*[-—–][\s]*([A-Za-z ]{3,})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
            if match:
                quote = clean_text(match.group(1))
                author = clean_text(match.group(2))
                if quote and author and len(quote) > 10 and len(author) > 2:
                    return {"quote": quote, "author": author}
        return None
    """
    def extract_daily_challenge(text):
        patterns = [
            r'[{"]title["\s]*:[\s"]*([^"]+)[\s"]*,[\s"]*description["\s]*:[\s"]*([^"]+)[\s"]*,',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
            if match:
                title = clean_text(match.group(1))
                description = clean_text(match.group(2))
                if title and description:
                    return {"title": title, "description": description}
        return None
    """
    @app.route('/api/user/cultural-note', methods=['GET'])
    @jwt_required()
    def get_cultural_note():
        user_id = get_jwt_identity()
        today_date = datetime.now().date().isoformat()  # Текущая дата

        # Подключаемся к БД
        conn = sqlite3.connect("users.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Проверяем, есть ли уже культурная заметка за сегодня
        cursor.execute(
            "SELECT cultural_note, cultural_note_date, preferred_language FROM Users WHERE user_id = ?",
            (user_id,)
        )
        user = cursor.fetchone()

        if user and user["cultural_note"] and user["cultural_note_date"] == today_date:
            conn.close()
            return jsonify(json.loads(user["cultural_note"]))

        # Если заметки нет или она устарела, генерируем новую
        language_code = user["preferred_language"] if user and user["preferred_language"] else "en"
        language = LANGUAGE_MAPPING.get(language_code, "English")

        prompt = f"""
            Generate STRICT JSON without markdown:
            {{"quote": "Cultural/personal growth quote (min 5 words)", 
            "author": "Full name of author (min 3 letters)"}}
            - No explanations or extra text
            - Use {language}
            - Avoid technical terms like 'schema' or 'json' and repetition of the prompt "Cultural/personal growth quote (min 5 words)"
        """

        try:
            response = ollama.chat(
                model="llama3.2:1b",
                messages=[{'role': 'user', 'content': prompt}],
                options={"temperature": 0.7, "max_tokens": 100}
            )
            
            raw_content = response['message']['content'].strip()

            try:
                data = json.loads(raw_content)
                if 'quote' in data and 'author' in data:
                    cleaned_quote = clean_text(data['quote'])
                    cleaned_author = clean_text(data['author'])
                    if cleaned_quote and cleaned_author:
                        note_json = json.dumps({"quote": cleaned_quote, "author": cleaned_author})

                        # Сохраняем новую заметку в БД
                        cursor.execute(
                            "UPDATE Users SET cultural_note = ?, cultural_note_date = ? WHERE user_id = ?",
                            (note_json, today_date, user_id)
                        )
                        conn.commit()
                        conn.close()

                        return jsonify({"quote": cleaned_quote, "author": cleaned_author})
            except json.JSONDecodeError:
                pass

            extracted = extract_cultural_note(raw_content)
            return jsonify(extracted) if extracted else jsonify(DEFAULT_NOTE)

        except Exception as e:
            app.logger.error(f"LLM Request Failed: {str(e)}")

        conn.close()
        return jsonify(DEFAULT_NOTE), 503  # Фоллбэк, если генерация не удалась

    @app.route('/api/user/daily-challenge', methods=['GET'])
    @jwt_required()
    def get_daily_challenge():
        user_id = get_jwt_identity()
        today_date = datetime.now().date().isoformat()

        try:
            # Получаем язык пользователя и дату последнего челленджа
            conn = sqlite3.connect('users.db')
            conn.row_factory = sqlite3.Row
            user = conn.execute(
                "SELECT preferred_language, daily_challenge_date FROM Users WHERE user_id = ?",
                (user_id,)
            ).fetchone()
            conn.close()

            if not user:
                return jsonify({"error": "User not found"}), 404

            language_code = user['preferred_language'] or 'en'
            last_challenge_date = user['daily_challenge_date']
            is_completed = (last_challenge_date == today_date)

            # Запрашиваем все подходящие задания из lessons.db
            conn = sqlite3.connect('lessons.db')
            conn.row_factory = sqlite3.Row
            lessons = conn.execute(
                "SELECT lesson_id, topic, data FROM Lessons WHERE title = 'daily_challenge' AND language = ?",
                (language_code,)
            ).fetchall()
            conn.close()

            if not lessons:
                return jsonify({
                    "id": 0,
                    "title": "No challenge available",
                    "description": "No challenge available for today",
                    "isCompleted": is_completed
                })

            # Выбираем случайное задание
            selected_lesson = random.choice(lessons)

            return jsonify({
                "id": selected_lesson['lesson_id'],
                "title": selected_lesson['topic'],
                "description": selected_lesson['data'],
                "isCompleted": is_completed
            })

        except Exception as e:
            app.logger.error(f"Database error: {str(e)}")
            return jsonify({
                "id": 0,
                "title": "Error retrieving challenge",
                "description": "An error occurred while retrieving the challenge",
                "isCompleted": False
            }), 500


    @app.route('/api/user/progress', methods=['GET'])
    @jwt_required()
    def get_user_progress():
        user_id = get_jwt_identity()

        # Получаем прогресс пользователя из базы данных
        try:
            conn = sqlite3.connect('user_progress.db')
            conn.row_factory = sqlite3.Row
            conn1 = sqlite3.connect('lessons.db')
            conn1.row_factory = sqlite3.Row            

            # Получаем количество завершенных уроков сегодня
            today = datetime.now().strftime('%Y-%m-%d')
            print(today)
            user_progress_today = conn.execute(
                """
                SELECT COUNT(*) AS completed_today
                FROM UserProgress
                WHERE user_id = ? AND completion_time = ?
                """,
                (user_id, today)
            ).fetchone()

            # Получаем общее количество уроков
            total_lessons = conn1.execute(
                """
                SELECT COUNT(*) AS total_lessons 
                FROM Lessons
                """
            ).fetchone()

            # Получаем общее количество завершенных уроков
            user_progress = conn.execute(
                """
                SELECT COUNT(*) AS completed_lessons 
                FROM UserProgress 
                WHERE user_id = ?
                """,
                (user_id,)
            ).fetchone()

            completed_today = user_progress_today["completed_today"] if user_progress_today else 0
            total_lessons_count = total_lessons["total_lessons"] if total_lessons else 0
            completed_lessons_count = user_progress["completed_lessons"] if user_progress else 0

            # Отправляем данные в формате, который будет выводиться в вашем сообщении
            return jsonify({
                "completedLessonsToday": completed_today,
                "completedLessons": completed_lessons_count,
                "totalLessons": total_lessons_count
            })

        except Exception as e:
            app.logger.error(f"Database error: {str(e)}")
            return jsonify({
                "completedLessonsToday": 0,
                "completedLessons": 0,
                "totalLessons": 10
            })
        finally:
            conn.close()
            conn1.close()

    @app.route('/api/user/topics', methods=['GET'])
    @jwt_required()
    def get_user_topics():
        user_id = get_jwt_identity()

        try:
            conn = sqlite3.connect('user_progress.db')
            conn.row_factory = sqlite3.Row
            
            # Получаем все уникальные lesson_title для пользователя
            topics = conn.execute(
                "SELECT DISTINCT lesson_title FROM UserProgress WHERE user_id = ?",
                (user_id,)
            ).fetchall()

            result = []
            
            for topic in topics:
                lesson_title = topic["lesson_title"]
                
                # Для каждого lesson_title получаем связанные уроки
                lessons = conn.execute(
                    "SELECT lesson_id, lesson_title, status, score FROM UserProgress WHERE user_id = ? AND lesson_title = ?",
                    (user_id, lesson_title)
                ).fetchall()

                lessons_list = []
                completed_lessons = 0
                total_lessons = len(lessons)

                for lesson in lessons:
                    lesson_data = {
                        "id": lesson["lesson_id"],
                        "title": lesson["lesson_title"],
                        "route": f"/lessons/{lesson['lesson_id']}",  # Пример маршрута для урока
                        "completed": lesson["status"] == "completed",  # Статус завершения урока
                    }
                    lessons_list.append(lesson_data)

                    # Считаем количество завершенных уроков
                    if lesson["status"] == "completed":
                        completed_lessons += 1

                # Рассчитываем процент завершенных уроков
                completion_percentage = (completed_lessons / total_lessons) * 100 if total_lessons > 0 else 0

                # Добавляем объект Topic в итоговый результат
                result.append({
                    "title": lesson_title,
                    "lessons": lessons_list,
                    "completionPercentage": completion_percentage
                })
            

            return jsonify(result)


        except Exception as e:
            app.logger.error(f"Database error: {str(e)}")
            return jsonify([])  # Возвращаем пустой список в случае ошибки
        finally:
            conn.close()

            
    @app.route('/api/user/xp', methods=['GET'])
    @jwt_required()
    def get_user_xp():
        user_id = get_jwt_identity()

        try:
            conn = sqlite3.connect("gamification.db")
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            # Получаем количество опыта пользователя
            cursor.execute("SELECT experience_points FROM Gamification WHERE user_id = ?", (user_id,))
            result = cursor.fetchone()
            conn.close()

            if result:
                return jsonify(result["experience_points"])
            else:
                return jsonify(0)  # Если данных нет, возвращаем 0 XP

        except Exception as e:
            app.logger.error(f"Database error: {str(e)}")
            return jsonify(0), 500  # Возвращаем 0 в случае ошибки