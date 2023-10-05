from flask import Blueprint, jsonify, request
from models.bookmark import Bookmark
from middlewares import auth_middleware
from models.user import User
from db import db
import uuid as uuid_module

bookmark_bp = Blueprint('bookmark', __name__)

bookmark_bp.before_request(auth_middleware)

@bookmark_bp.route('/get_all_bookmarks', methods=['GET'])
def get_bookmarks():
    bookmarks = Bookmark.get_all_bookmarks()
    bookmarks_data = [{'bookmark_uuid': bookmark.bookmark_uuid, 'model': bookmark.model, 'url': bookmark.url, 'title': bookmark.title} for bookmark in bookmarks]
    return jsonify(bookmarks_data), 200

@bookmark_bp.route('/add_bookmark', methods=['POST'])
def add_bookmark():
    data = request.get_json()
    bookmark_uuid = str(uuid_module.uuid4())
    model = data.get('model')
    url = data.get('url')
    title = data.get('title')

    if not model or not url or not title:
        return jsonify({'error': 'Brak wymaganych danych'}), 400

    new_bookmark = Bookmark(bookmark_uuid=bookmark_uuid, model=model, url=url, title=title)
    new_bookmark.save()

    return jsonify({'message': 'Zakładka dodana do bazy danych'}), 201

@bookmark_bp.route('/associate_bookmark', methods=['POST'])
def associate_bookmark():
    try:
        user_uuid = request.json.get('user_uuid')
        bookmark_uuid = request.json.get('bookmark_uuid')

        user = User.query.filter_by(user_uuid=user_uuid).first_or_404()
        bookmark = Bookmark.query.filter_by(bookmark_uuid=bookmark_uuid).first()

        if bookmark:
            user.bookmarks.append(bookmark)
            db.session.commit()
            return jsonify({'message': f'Bookmark {bookmark_uuid} associated with user {user_uuid} successfully'}), 200
        else:
            return jsonify({'error': f'Bookmark {bookmark_uuid} not found'}), 404

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500
