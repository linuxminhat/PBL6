from flask import Flask
from flask_jwt_extended import JWTManager
from mongoengine import connect, disconnect
from app.config import Config


def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='/static')
    app.config.from_object(Config)

    disconnect()
    connect(**app.config['MONGODB_SETTINGS'])

    # Initialize JWTManager
    jwt = JWTManager(app)

    from app.routes.auth import auth_bp
    from app.routes.user import user_bp
    from app.routes.admin import admin_bp
    from app.routes import home_bp

    app.register_blueprint(home_bp, url_prefix='/')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(admin_bp, url_prefix='/admin')

    return app
