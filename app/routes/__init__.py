from flask import Blueprint, render_template, session

home_bp = Blueprint('home', __name__)

@home_bp.route('/', methods=['GET'])
def index():
    session
    return render_template('index.html')