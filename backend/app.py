from flask import Flask
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'd9f8c1a7e3b54f8d91a6d6b2ef7a5c8db0f47e9f3b2c7a5d7e4f9c8d6a1b3e2c'
app.config['DB_PATH'] = 'users.db'  # Переносим конфигурацию сюда



app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')

# Убедитесь, что папка существует
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])


# Инициализация расширений
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

# Регистрация маршрутов из других файлов
from registration import register_routes as register_auth_routes
from dashboard import register_routes as register_dashboard_routes
from profile import register_routes as register_profile_routes
from lessons import register_routes as register_lessons_routes

register_lessons_routes(app)
register_auth_routes(app, bcrypt)  # Передаем bcrypt из основного приложения
register_dashboard_routes(app)
register_profile_routes(app)  # Регистрация маршрутов профиля

if __name__ == '__main__':
    app.run(debug=True)
