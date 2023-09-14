from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from routes.auth import auth_bp
from models.products import Product
from models.urls import Url
from models.record_click import Click
from routes import init_app
from decouple import config

app = Flask(__name__)
CORS(app, supports_credentials=True)
SECRET_KEY = config('SECRET_KEY')

app.config['SECRET_KEY'] = SECRET_KEY 

client = MongoClient('mongodb://localhost:27017/') 
db = client['panel-olx']  

auth_bp.db = db
Product.db = db
Url.db = db
Click.db = db

init_app(app)
if __name__ == '__main__':
    app.run(port=2137, debug=True)
