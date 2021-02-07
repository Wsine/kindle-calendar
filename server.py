import requests
from threading import Thread
from flask import Flask
from flask import request, Response
from flask import render_template, send_from_directory
from api.service import run as service

app = Flask(__name__, template_folder='./', static_folder='')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/api/service/', methods=['POST'])
def api_service():
    year = request.args.get('year')
    resp = requests.post(
        f'http://localhost:8000/api/service/?year={year}',
        json=request.get_json())
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]
    response = Response(resp.content, resp.status_code, headers)
    return response

if __name__ == '__main__':
    Thread(target=service, daemon=True).start()
    app.run(port=8080)
