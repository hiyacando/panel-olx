from flask import request, jsonify, current_app
import jwt

def auth_middleware():
    if request.method == 'OPTIONS':
        return None

    token = request.headers.get('Authorization')
    if not token or not token.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid token'}), 401

    token = token.split('Bearer ')[1]

    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        request.current_user = payload  
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Expired token'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

    return None 
