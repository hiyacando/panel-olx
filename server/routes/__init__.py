from flask import Blueprint
from middlewares import auth_middleware

from .auth import auth_bp
from .scraper import scraper_bp

def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(scraper_bp, url_prefix='/scraper')

def init_app(app):
    register_blueprints(app)

def configure_app(app):
    app.config['SOME_CONFIG'] = 'some_value'

from . import auth, scraper
