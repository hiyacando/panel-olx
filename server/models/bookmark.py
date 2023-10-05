from db import db
from models.user import user_bookmarks
class Bookmark(db.Model):
    __tablename__ = 'bookmarks'

    id = db.Column(db.Integer, unique=True, primary_key=True, autoincrement=True)
    bookmark_uuid = db.Column(db.String(36), unique=True, primary_key=True)
    model = db.Column(db.String(32))
    url = db.Column(db.String(255))
    title = db.Column(db.String(24))
    users = db.relationship('User', secondary=user_bookmarks, back_populates='bookmarks', lazy='dynamic')

    def __init__(self, model, bookmark_uuid, url, title):
        self.bookmark_uuid = bookmark_uuid
        self.model = model
        self.url = url
        self.title = title

    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def get_all_bookmarks():
        return Bookmark.query.all()
    def to_dict(self):
        return {
            'id': self.id,
            'bookmark_uuid': self.bookmark_uuid,
            'model': self.model,
            'title': self.title,
            'url': self.url,
        }