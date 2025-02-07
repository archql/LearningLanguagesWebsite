from flask import Flask, request, Response
from flask_cors import CORS
import random
import yaml

app = Flask(__name__)
CORS(app)

# Маршрут для генерации случайного числа
@app.route('/api/random', methods=['GET'])
def get_random_number():
    # Получаем параметры из запроса (если они есть, 0 and 100 by default)
    min_value = int(request.args.get('min', 0))
    max_value = int(request.args.get('max', 100))
    
    # Генерация случайного числа
    random_number = random.randint(min_value, max_value)
    
    # Формируем данные в формате YAML
    data = {
        'randomNumber': random_number,
        'min': min_value,
        'max': max_value
    }
    yaml_data = yaml.dump(data, allow_unicode=True)
    
    # Возвращаем результат в формате YAML
    return Response(yaml_data, content_type='application/x-yaml')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)