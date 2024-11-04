# PBL6/app/routes/user/generate_music/__init__.py

from flask import Blueprint, request, send_file, jsonify, render_template
from transformers import pipeline
import scipy.io.wavfile
import os
import uuid
import tempfile

generate_music_bp = Blueprint('generate_music', __name__)

# Initialize the text-to-audio synthesizer
synthesiser = pipeline("text-to-audio", model="facebook/musicgen-small")

@generate_music_bp.route('/', methods=['GET'])
def custom_music():
    return render_template('user/generate_music/generate_music.html')

@generate_music_bp.route('/generate_music', methods=['POST'])
def generate_music():
    try:
        # Get the input text from the request
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Request must contain 'text' in JSON body"}), 400

        text = data['text']

        # Generate the audio using the model
        music = synthesiser(text, forward_params={"do_sample": True})

        # Tạo tên tệp tin duy nhất
        unique_filename = f"musicgen_{uuid.uuid4().hex}.wav"

        # Tạo tệp tin tạm thời
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            scipy.io.wavfile.write(tmp_file.name, rate=music["sampling_rate"], data=music["audio"])
            tmp_file_path = tmp_file.name

        # Trả về tệp tin âm thanh
        response = send_file(
            tmp_file_path,
            as_attachment=True,
            download_name=unique_filename,
            mimetype="audio/wav"
        )

        # Sau khi gửi tệp tin, xóa tệp tin tạm thời
        @response.call_on_close
        def remove_file():
            os.remove(tmp_file_path)

        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500
