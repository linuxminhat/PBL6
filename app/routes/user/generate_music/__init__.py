from flask import Blueprint, request, send_file, jsonify, render_template
import requests
import uuid
import tempfile
import os

generate_music_bp = Blueprint('generate_music', __name__)

@generate_music_bp.route('/', methods=['GET'])
def custom_music():
    return render_template('user/generate_music/generate_music.html')

@generate_music_bp.route('/generate_music', methods=['POST'])
def generate_music():
    try:
        # Lấy dữ liệu từ request
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Request must contain 'text' in JSON body"}), 400

        text = data['text']

        # Gửi yêu cầu POST đến API trên cổng 8000
        api_url = "http://localhost:8000/generate-music"
        response = requests.post(api_url, json={"text": text})

        if response.status_code != 200:
            return jsonify({"error": "Error from music generation API"}), response.status_code

        # Lưu tệp âm thanh tạm thời
        unique_filename = f"musicgen_{uuid.uuid4().hex}.wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            tmp_file.write(response.content)
            tmp_file_path = tmp_file.name

        # Trả về tệp âm thanh
        return send_file(
            tmp_file_path,
            as_attachment=True,
            download_name=unique_filename,
            mimetype="audio/wav"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
