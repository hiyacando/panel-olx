import jwt
from flask import current_app, Blueprint, request, jsonify
from models.user import User
from db import db

user_bp = Blueprint('user', __name__)

@user_bp.route('/get_user_info', methods=['GET'])
def get_user_info():
    token = request.headers.get('Authorization').split()[1]

    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_email = payload['sub']
        user = User.query.filter_by(email=user_email).first()
        if user:
            user_bookmarks = [bookmark.to_dict() for bookmark in user.bookmarks]
            group_name = None
            if user.group:
                group = user.group[0]
                group_name = group.name if group else None

            return jsonify({
                'user_uuid': user.user_uuid,
                'email': user_email,
                'role': user.role,
                'avatar': user.avatar,
                'user_bookmarks': user_bookmarks,
                'group_name': group_name,
            }), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Expired token'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
def get_all_users():
    users = User.query.all()
    users_data = []

    for user in users:
        group_name = None
        if user.group:
            group = user.group[0]
            group_name = group.name if group else None

        user_data = {
            'user_uuid': user.user_uuid,
            'email': user.email,
            'role': user.role,
            'avatar': user.avatar,
            'group_name': group_name,
        }
        users_data.append(user_data)

    return users_data


@user_bp.route('/get_all_users', methods=['GET'])
def get_all_users_route():
    token = request.headers.get('Authorization').split()[1]

    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_email = payload['sub']
        user = User.query.filter_by(email=user_email).first()

        if user and user.role == 'admin':
            users = get_all_users()
            return jsonify(users), 200
        else:
            return jsonify({'error': 'Unauthorized'}), 401
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Expired token'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

@user_bp.route('/get_user_by_id/<string:user_uuid>', methods=['GET'])
def get_user_by_uuid(user_uuid):
    user = User.query.get(user_uuid)
    if user:
        user_data = {
            'user_uuid': user.user_uuid,
            'email': user.email,
            'role': user.role,
            'avatar': user.avatar,
        
        }
        return jsonify(user_data), 200
    else:
        return jsonify({'error': 'User not found'}), 404    
@user_bp.route('/delete_user', methods=['POST'])
def delete_user():
    data = request.get_json()
    user_uuid_to_delete = data.get('user_uuid')

    if not user_uuid_to_delete:
        return jsonify({'error': 'user_uuid is missing'}), 400

    token = request.headers.get('Authorization').split()[1]

    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_email = payload['sub']
        user = User.query.filter_by(email=user_email).first()

        if user and user.role == 'admin':
            user_to_delete = User.query.filter_by(user_uuid=user_uuid_to_delete).first()
            if user_to_delete:
                if user_to_delete.group:
                    user_to_delete.group.members.remove(user_to_delete)

                db.session.delete(user_to_delete)
                db.session.commit()

                return jsonify({'message': 'User deleted successfully'}), 200
            else:
                return jsonify({'error': 'User not found'}), 404
        else:
            return jsonify({'error': 'Unauthorized'}), 401
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Expired token'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

def verifyUser(user_uuid):
    try:
        user = User.query.filter_by(user_uuid=user_uuid).first()
        if user:
            user.role = 'user' 
            db.session.commit()
            return {'message': 'User verified successfully'}, 200
        else:
            return {'error': 'User not found'}, 404
    except Exception as e:
        return {'error': str(e)}, 500
@user_bp.route('/verify_user/<string:user_uuid>', methods=['POST'])
def verify_user_route(user_uuid):
    token = request.headers.get('Authorization').split()[1]

    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_email = payload['sub']
        user = User.query.filter_by(email=user_email).first()
        if user and user.role == 'admin':
            return verifyUser(user_uuid)
        else:
            return jsonify({'error': 'Unauthorized'}), 401
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Expired token'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401