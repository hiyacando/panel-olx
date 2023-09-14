import datetime
import jwt
import bcrypt
import uuid
from flask import current_app, Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

def generate_jwt_token(user_email, user_id):
    user = auth_bp.db.users.find_one({'email': user_email})
    if user:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
            'sub': user_email,
            'user_id': user_id, 
            'role': user.get('role', 'unverifed')
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

def verifyUser(user_id):
    # Sprawdzanie, czy użytkownik istnieje w bazie danych
    user = auth_bp.db.users.find_one({'id': user_id})
    if user:
        # Aktualizacja roli użytkownika na "user"
        auth_bp.db.users.update_one({'id': user_id}, {'$set': {'role': 'user'}})
        return jsonify({'message': 'User verified successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
@auth_bp.route('/verify_user/<string:user_id>', methods=['POST'])
def verify_user_route(user_id):
    token = request.headers.get('Authorization').split()[1]
    
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_email = payload['sub']
        user = auth_bp.db.users.find_one({'email': user_email})
        
        if user and user.get('role') == 'admin':
            return verifyUser(user_id)  # Wywołanie metody verifyUser
        else:
            return jsonify({'error': 'Unauthorized'}), 401
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Expired token'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = auth_bp.db.users.find_one({'email': email})
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        user_id = user['id'] 
        token = generate_jwt_token(email, user_id) 
        return jsonify({'token': token, 'user_id': user_id})  
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    existing_user = auth_bp.db.users.find_one({'email': email})
    if existing_user:
        return jsonify({'error': 'Email already exists'}), 400
    user_id = str(uuid.uuid4())
    style = "male"
    dicebear_url = f"https://avatars.dicebear.com/api/{style}/{user_id}.svg"
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    new_user_data = {'id': user_id, 'email': email, 'password': hashed_password, 'role': 'unverifed', 'avatar': dicebear_url}
    auth_bp.db.users.insert_one(new_user_data)

    token = generate_jwt_token(email, user_id)
    return jsonify({'token': token})

@auth_bp.route('/get_user_info', methods=['GET'])
def get_user_info():
    token = request.headers.get('Authorization').split()[1]
    
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_email = payload['sub']
        user = auth_bp.db.users.find_one({'email': user_email})
        if user:
            user_id = user.get('id')
            user_avatar = user.get('avatar')

            return jsonify({'user_id': user_id, 'email': user_email, 'role': user.get('role'), 'avatar': user_avatar}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Expired token'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

@auth_bp.route('/admin-panel', methods=['GET'])
def admin_panel():
    token = request.headers.get('Authorization').split()[1]
    
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_email = payload['sub']
        user = auth_bp.db.users.find_one({'email': user_email})
        
        if user and user.get('role') == 'admin':
            return jsonify({'message': 'Welcome to the admin panel!'}), 200
        else:
            return jsonify({'error': 'Unauthorized'}), 401
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Expired token'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
def get_all_users():
    users = list(auth_bp.db.users.find({}, {'_id': False, 'password': False}))
    return users
@auth_bp.route('/get_all_users', methods=['GET'])
def get_all_users_route():
    token = request.headers.get('Authorization').split()[1]
    
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_email = payload['sub']
        user = auth_bp.db.users.find_one({'email': user_email})
        
        if user and user.get('role') == 'admin':
            users = get_all_users()  
            return jsonify(users), 200
        else:
            return jsonify({'error': 'Unauthorized'}), 401
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Expired token'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
@auth_bp.route('/delete_user', methods=['POST'])
def delete_user():
    data = request.get_json()
    user_id_to_delete = data.get('user_id')
    
    token = request.headers.get('Authorization').split()[1]
    
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_email = payload['sub']
        user = auth_bp.db.users.find_one({'email': user_email})
        
        if user and user.get('role') == 'admin':
         
            user_to_delete = auth_bp.db.users.find_one({'id': user_id_to_delete})
            
            if user_to_delete:
                auth_bp.db.users.delete_one({'id': user_id_to_delete})
                return jsonify({'message': 'User deleted successfully'}), 200
            else:
                return jsonify({'error': 'User not found'}), 404
        else:
            return jsonify({'error': 'Unauthorized'}), 401
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Expired token'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
@auth_bp.route('/get_user_by_id/<string:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = auth_bp.db.users.find_one({'id': user_id}, {'_id': False, 'password': False})
    if user:
        return jsonify(user), 200
    else:
        return jsonify({'error': 'User not found'}), 404