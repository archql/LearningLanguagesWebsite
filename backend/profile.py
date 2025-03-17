from flask import request, jsonify
import sqlite3
import yaml
import os
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity

# Эта функция будет регистрировать все маршруты
def register_routes(app):

    DB_PATH = app.config['DB_PATH']

    def get_db_connection():
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    # Эндпоинт для получения информации о текущем пользователе
    @app.route('/api/user/current', methods=['GET'])
    @jwt_required()
    def get_current_user():
        user_id = get_jwt_identity()  # Получаем ID текущего пользователя из JWT

        conn = get_db_connection()
        try:
            # Получаем данные пользователя из базы
            user = conn.execute("""
                SELECT user_id, username, email, preferred_language 
                FROM Users 
                WHERE user_id = ?
            """, (user_id,)).fetchone()

            if user:
                # Формируем ответ, соответствующий интерфейсу User
                return jsonify({
                    "id": user["user_id"],
                    "email": user["email"],
                    "login": user["username"],
                    "language": user["preferred_language"]
                })
            else:
                return jsonify({"message": "User not found"}), 404
        except Exception as e:
            app.logger.error(f"Error fetching user data: {str(e)}")
            return jsonify({"message": "Error fetching user data"}), 500
        finally:
            conn.close()
    
    @app.route('/api/user/reset', methods=['POST'])
    @jwt_required()  # Добавляем декоратор для проверки JWT
    def reset_user_progress():
        # Подключение к базе данных
        conn = sqlite3.connect('user_progress.db')
        cursor = conn.cursor()
        # Извлекаем user_id из контекста JWT
        user_id = get_jwt_identity()
        # Удаляем все данные по user_id
        cursor.execute("DELETE FROM UserProgress WHERE user_id = ?", (user_id,))
        conn.commit()
        # Закрытие соединения
        conn.close()

        conn_users = sqlite3.connect("users.db")
        cursor_users = conn_users.cursor()

        cursor_users.execute("""
            UPDATE Users
            SET daily_challenge_date = ?
            WHERE user_id = ?
        """, ('2000-12-12', user_id))
        conn_users.commit()
        conn_users.close()

        conn = sqlite3.connect('gamification.db')
        cursor = conn.cursor()
        # Извлекаем user_id из контекста JWT
        user_id = get_jwt_identity()
        # Удаляем все данные по user_id
        cursor.execute("DELETE FROM Gamification WHERE user_id = ?", (user_id,))
        conn.commit()

        # Закрытие соединения
        conn.close()

        return jsonify({"message": "User progress reset successful"}), 200

    # get vocabulary list for vocabulary tab
    @app.route('/api/user/vocabulary', methods=['GET'])
    @jwt_required()  # Требуется авторизация для этого запроса
    def get_vocabulary():
        user_id = get_jwt_identity()

        try:
            # Подключаемся к базе данных для извлечения словаря
            conn = sqlite3.connect("vocabulary.db")
            cursor = conn.cursor()

            # Извлекаем все слова и переводы для конкретного пользователя
            cursor.execute("""
                SELECT word, translation 
                FROM Vocabulary 
                WHERE user_id = ?
            """, (user_id,))
            rows = cursor.fetchall()

            # Группируем слова по секциям, если это необходимо
            vocabulary_groups = {}

            for row in rows:
                word = row[0]
                translation = row[1]
                section = "default"  # По умолчанию все слова в одной секции
                if section not in vocabulary_groups:
                    vocabulary_groups[section] = []

                vocabulary_groups[section].append({
                    "word": word,
                    "meaning": translation
                })

            # Закрываем соединение с базой данных
            conn.close()

            # Формируем список групп слов для отправки на фронтенд
            vocabulary_response = [{"section": section, "words": words} for section, words in vocabulary_groups.items()]

            return jsonify(vocabulary_response), 200

        except Exception as e:
            return jsonify({"message": f"An error occurred: {str(e)}"}), 500


    @app.route('/api/user/vocabulary/file', methods=['GET'])
    @jwt_required()  # Требуется авторизация для этого запроса
    def download_vocabulary():
        user_id = get_jwt_identity()

        try:
            # Подключаемся к базе данных для извлечения словаря
            conn = sqlite3.connect("vocabulary.db")
            cursor = conn.cursor()

            # Извлекаем все слова и переводы для конкретного пользователя
            cursor.execute("""
                SELECT word, translation 
                FROM Vocabulary 
                WHERE user_id = ?
            """, (user_id,))
            rows = cursor.fetchall()

            # Создаем итоговый словарь для слов и переводов
            vocabulary_response = {}

            for row in rows:
                word = row[0]
                translation = row[1]
                vocabulary_response[word] = translation  # Добавляем слово и перевод

            # Закрываем соединение с базой данных
            conn.close()

            # Возвращаем результат в формате JSON
            return yaml.dump(vocabulary_response, sort_keys=False), 200

        except Exception as e:
            return jsonify({"message": f"An error occurred: {str(e)}"}), 500

    # upload YAML-файла
    @app.route('/api/user/vocabulary/file', methods=['POST'])
    @jwt_required()  # Требуется авторизация для этого запроса
    def upload_vocabulary():
        user_id = get_jwt_identity()

        if 'file' not in request.files:
            return jsonify({"message": "No file part"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"message": "No selected file"}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            try:
                # Открываем YAML файл и считываем его данные
                with open(file_path, 'r') as f:
                    vocabulary_data = yaml.safe_load(f)  # Считываем YAML в Python-словарь

                # Подключаемся к базе данных для сохранения словаря
                conn = sqlite3.connect("vocabulary.db")
                cursor = conn.cursor()
                print(vocabulary_data)
                # Вставляем каждую пару ключ-значение из словаря в базу данных
                for word, translation in vocabulary_data.items():
                    cursor.execute("""
                        INSERT INTO Vocabulary (user_id, word, translation)
                        VALUES (?, ?, ?)
                        ON CONFLICT(user_id, word, translation) DO NOTHING
                    """, (user_id, word, translation))

                conn.commit()
                conn.close()

                os.remove(file_path)  # Удаляем временный файл после обработки

                return jsonify({"message": "File successfully uploaded and vocabulary added"}), 200

            except Exception as e:
                return jsonify({"message": f"Error processing file: {str(e)}"}), 500
        else:
            return jsonify({"message": "Invalid file type"}), 400

    





    # delete word from the Vocabulary Tab
    @app.route('/api/user/vocabulary', methods=['DELETE'])
    @jwt_required()
    def delete_word():
        user_id = get_jwt_identity()
        word = request.args.get('word')
        translation = request.args.get('translation')

        if not word:
            return jsonify({"message": "Word parameter is required"}), 400

        try:
            conn = sqlite3.connect("vocabulary.db")
            cursor = conn.cursor()

            cursor.execute("""
                DELETE FROM Vocabulary 
                WHERE user_id = ? AND word = ? AND translation = ?
            """, (user_id, word, translation))

            if cursor.rowcount == 0:
                return jsonify({"message": "Word not found"}), 404

            conn.commit()
            conn.close()

            return jsonify({"message": f"Word '{word}' deleted successfully"}), 200

        except Exception as e:
            return jsonify({"message": f"An error occurred: {str(e)}"}), 500




    @app.route('/api/user/language', methods=['POST'])
    @jwt_required()
    def change_learning_language():
        user_id = get_jwt_identity()
        data = request.get_json()
        new_language = data.get("language")
        
        if not new_language:
            return jsonify({"message": "Language parameter is required"}), 400
        
        try:
            # Обновление языка пользователя в users.db
            conn = sqlite3.connect("users.db")
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE Users
                SET preferred_language = ?
                WHERE user_id = ?
            """, (new_language, user_id))
            conn.commit()
            conn.close()
            
            conn = sqlite3.connect("users.db")
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE Users
                SET preferred_language = ?, cultural_note = NULL, cultural_note_date = NULL
                WHERE user_id = ?
            """, (new_language, user_id))
            conn.commit()
            conn.close()
            # Сброс прогресса пользователя в user_progress.db
            conn = sqlite3.connect("user_progress.db")
            cursor = conn.cursor()
            cursor.execute("DELETE FROM UserProgress WHERE user_id = ?", (user_id,))
            conn.commit()
            conn.close()


            cursor_users.execute("""
                UPDATE Users
                SET daily_challenge_date = ?
                WHERE user_id = ?
            """, ('2000-12-12', user_id))
            conn_users.commit()
            conn_users.close()


            conn = sqlite3.connect('gamification.db')
            cursor = conn.cursor()
            # Извлекаем user_id из контекста JWT
            user_id = get_jwt_identity()
            # Удаляем все данные по user_id
            cursor.execute("DELETE FROM Gamification WHERE user_id = ?", (user_id,))
            conn.commit()
            
            return jsonify({"message": "Language updated and progress reset successfully"}), 200
        except Exception as e:
            return jsonify({"message": f"An error occurred: {str(e)}"}), 500


# Проверка, что файл имеет допустимый формат
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'yaml', 'yml'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

