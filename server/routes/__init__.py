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
