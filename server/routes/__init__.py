<<<<<<< HEAD
from routes.auth import *
from routes.scraper import *
from routes.group import *
from routes.user import *
from routes.bookmark import *
def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(scraper_bp, url_prefix='/scraper')
    app.register_blueprint(group_bp, url_prefix='/group')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(bookmark_bp, url_prefix='/bookmark')
=======
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
>>>>>>> 979f07e58878b477623e44de98eece5415194b69
