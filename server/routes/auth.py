import datetime
import jwt
import bcrypt
import uuid as uuid_module
from flask import current_app, Blueprint, request, jsonify
from models.user import User
from db import db
from .group import Group
auth_bp = Blueprint('auth', __name__)

def generate_jwt_token(user_email, user_uuid):
    user = User.query.filter_by(email=user_email).first()
    if user:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
            'sub': user_email,
            'user_uuid': user_uuid,
            'role': user.role,
        }
        token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
        return token
    else:
        return None

def verify_jwt_token(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return "Expired"
    except jwt.InvalidTokenError:
        return "Invalid"

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        user_uuid = user.user_uuid
        token = generate_jwt_token(email, user_uuid)
        return jsonify({'token': token, 'user_uuid': user_uuid})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already exists'}), 400

    user_uuid = str(uuid_module.uuid4())
    dicebear_url = f"https://api.dicebear.com/7.x/pixel-art/svg?seed={user_uuid}"
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    new_user = User(user_uuid=user_uuid, email=email, password=hashed_password, avatar=dicebear_url)
    db.session.add(new_user)
    db.session.commit()

    token = generate_jwt_token(email, user_uuid)
    return jsonify({'token': token})
