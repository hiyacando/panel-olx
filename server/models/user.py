from db import db
from models.group import group_members

user_bookmarks = db.Table(
    'user_bookmarks',
    db.Column('user', db.String(36), db.ForeignKey('users.user_uuid'), primary_key=True),
    db.Column('bookmark', db.String(255), db.ForeignKey('bookmarks.bookmark_uuid'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, unique=True, primary_key=True, autoincrement=True)
    user_uuid = db.Column(db.String(36), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    role = db.Column(db.String(20), default='unverified')
    avatar = db.Column(db.String(255))
    bookmarks = db.relationship('Bookmark', secondary=user_bookmarks, back_populates='users')
    group = db.relationship('Group', secondary=group_members, back_populates='members')

    def __init__(self, user_uuid, email, password, role='unverified', avatar=None):
        self.user_uuid = user_uuid
        self.email = email
        self.password = password
        self.role = role
        self.avatar = avatar

    def associate_bookmark(self, bookmark):
        self.bookmarks.append(bookmark)
        
    def add_to_group(self, group):
        if group not in self.group:
            self.group.append(group)
            return {'message': 'Dodano uzytkownika do grupy'}
        else:
            return {'error': 'Uzytkownik jest juz czlonkiem grupy'}
