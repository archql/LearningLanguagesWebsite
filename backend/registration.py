from flask import request, jsonify
import sqlite3

# Эта функция будет регистрировать все маршруты
def register_routes(app, bcrypt):
    DB_PATH = app.config['DB_PATH']

    def get_db_connection():
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    @app.route('/api/auth/register', methods=['POST'])
    def register():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        nickname = data.get("nickname")
        language = data.get("language")

        # Проверка, что все поля заполнены
        if not all([email, password, nickname, language]):
            return jsonify({
                "message": "All fields (email, password, nickname, language) are required",
                "result": False
            }), 400

        # Подключение к базе данных
        conn = get_db_connection()
        try:
            # Проверяем, существует ли пользователь с таким email или username
            existing_user = conn.execute("""
                SELECT email, username FROM Users 
                WHERE email = ? OR username = ?
            """, (email, nickname)).fetchone()

            if existing_user:
                conflict_fields = []
                if existing_user['email'] == email:
                    conflict_fields.append('email')
                if existing_user['username'] == nickname:
                    conflict_fields.append('username')

                message = f"User with this {', '.join(conflict_fields)} already exists"
                return jsonify({
                    "message": message,
                    "result": False
                }), 409

            # Хэшируем пароль
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

            # Добавляем нового пользователя в базу данных
            conn.execute("""
                INSERT INTO Users (username, email, password, preferred_language)
                VALUES (?, ?, ?, ?)
            """, (nickname, email, hashed_password, language))
            conn.commit()

            return jsonify({
                "message": "User registered successfully",
                "result": True
            }), 201

        except sqlite3.IntegrityError as e:
            # Обработка race condition (редкие случаи конфликта)
            return jsonify({
                "message": "Conflict during registration",
                "error": str(e),
                "result": False
            }), 409

        finally:
            conn.close()

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        # Подключение к базе данных
        conn = get_db_connection()
        user = conn.execute("""
            SELECT user_id, password FROM Users WHERE email = ?
        """, (email,)).fetchone()
        conn.close()

        # Проверка email и пароля
        if user and bcrypt.check_password_hash(user['password'], password):
            from flask_jwt_extended import create_access_token
            token = create_access_token(identity=user['user_id'])
            return jsonify({"token": token})

        return jsonify({"message": "Invalid email or password"}), 401

    @app.route('/api/auth/protected', methods=['GET'])
    def protected():
        from flask_jwt_extended import jwt_required
        return jsonify({"message": "You have access to this protected route!"})