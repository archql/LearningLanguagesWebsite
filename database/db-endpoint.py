from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# function to execute SQL-query with the opportunity to use ATTACH
def execute_query(query, attach_db=None):
    conn = sqlite3.connect("user_progress.db")
    cursor = conn.cursor()

    # if parameter attach_db is submitted:
    if attach_db:
        cursor.execute(f'ATTACH DATABASE "{attach_db}" AS attached_db')

    cursor.execute(query)
    result = cursor.fetchall()
    conn.close()
    return result

# the endpoint itself
@app.route('/api/query', methods=['GET'])
def query_database():
    query = request.args.get('query')
    attach_db = request.args.get('attach_db')  # parameter ATTACH
    
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        result = execute_query(query, attach_db)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

"""
this is how it will look like on the Angular side (example):

const query = 'SELECT * FROM Users JOIN UserProgress ON Users.user_id = UserProgress.user_id';
const encodedQuery = encodeURIComponent(query);  // Кодируем запрос
const attachDb = 'users.db';
const encodedAttachDb = encodeURIComponent(attachDb);  // Кодируем имя базы данных

// Теперь формируем URL
const url = `http://localhost:5000/api/query?query=${encodedQuery}&attach_db=${encodedAttachDb}`;



Отправка запроса:

import { HttpClient } from '@angular/common/http';

this.http.get(url).subscribe(response => {
  console.log(response);
});


"""

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)