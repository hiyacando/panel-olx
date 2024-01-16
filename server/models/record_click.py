from datetime import datetime
from db import db

class Click(db.Model):
    __tablename__ = 'clicks'

    id = db.Column(db.Integer, primary_key=True)
    user_uuid = db.Column(db.String(36))
    link = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, user_uuid, link):
        self.user_uuid = user_uuid
        self.link = link

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_clicks_by_link(link):
        return Click.query.filter_by(link=link).all()

    @staticmethod
    def get_all_clicks():
        return Click.query.all()

    @staticmethod
    def clear_all_clicks():
        Click.query.delete()
        db.session.commit()
    @staticmethod
    def get_click_by_user_and_link(user_uuid, link):
        return Click.query.filter_by(user_uuid=user_uuid, link=link).first()
