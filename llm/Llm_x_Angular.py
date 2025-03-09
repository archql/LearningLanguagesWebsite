from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama

app = Flask(__name__)
CORS(app)

def generate_response(model_name, prompt):
    try:
        response = ollama.chat(
            model=model_name,
            messages=[{'role': 'user', 'content': prompt}]
        )
        return response['message']['content']
    except Exception as e:
        return f"Error while polling Ollama: {e}"

@app.route('/api/generate_lesson', methods=['POST'])
def generate_lesson():
    data = request.get_json()
    model_name = data.get('model', 'llama3.2:1b')
    prompt = data.get('prompt')
    
    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400
    
    response = generate_response(model_name, prompt)
    return jsonify({'lesson': response})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
