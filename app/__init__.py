from flask import Flask
from mongoengine import connect, disconnect
from app.config import Config
from flask_cors import CORS
import cloudinary
import os

def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='/static')
    app.config.from_object(Config)

    disconnect()
    connect(**app.config['MONGODB_SETTINGS'])
    # Initialize JWTManager
    # jwt = JWTManager(app)

    # cors_config = {
    #     "origins": ["http://localhost:5000", "http://127.0.0.1:5000"],
    #     "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    #     "allow_headers": ["Content-Type", "Authorization"],
    #     "expose_headers": ["X-Total-Count", "X-Page", "X-Per-Page"],
    #     "credentials": True
    # }
    # CORS(app, resources={r"/api/*": cors_config})

    from app.routes.auth import auth_bp
    from app.routes.user import user_bp
    from app.routes.admin import admin_bp
    from app.routes.artist import artist_bp
    from app.routes.music import music_bp
    from app.routes import home_bp

    app.register_blueprint(home_bp, url_prefix='/')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(artist_bp, url_prefix='/artist')
    app.register_blueprint(music_bp, url_prefix='/music')

    # Initialize Blueprint for API routes
    from app.routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    cloudinary.config(
        cloud_name='dddiwftri',  # Replace with your Cloudinary cloud name
        api_key='171257253152235',  # Replace with your Cloudinary API key
        api_secret=os.getenv('CLOUDINARY_API_SECRET')  # Replace with your Cloudinary API secret
    )
    return app
