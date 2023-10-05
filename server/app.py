from flask import Flask
from flask_cors import CORS
from decouple import config
from routes import register_blueprints
from db import db
app = Flask(__name__)
CORS(app, supports_credentials=True)
SECRET_KEY = config('SECRET_KEY')
app.config['SECRET_KEY'] = SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/panel-olx'

with app.app_context():
    db.init_app(app)
    db.create_all()
    register_blueprints(app)
    
if __name__ == '__main__':
    app.run(port=2137, debug=True)
