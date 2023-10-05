from datetime import datetime
from db import db

<<<<<<< HEAD
class Click(db.Model):
    __tablename__ = 'clicks'
=======
class Click:
    clicked_users = set()  
>>>>>>> 979f07e58878b477623e44de98eece5415194b69

    id = db.Column(db.Integer, primary_key=True)
    user_uuid = db.Column(db.String(36))
    link = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, user_uuid, link):
        self.user_uuid = user_uuid
        self.link = link
<<<<<<< HEAD
=======
        self.timestamp = datetime.now() 

>>>>>>> 979f07e58878b477623e44de98eece5415194b69

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
<<<<<<< HEAD
        Click.query.delete()
        db.session.commit()
    @staticmethod
    def get_click_by_user_and_link(user_uuid, link):
        return Click.query.filter_by(user_uuid=user_uuid, link=link).first()
=======
        collection = Click.db['clicks']
        collection.delete_many({})
>>>>>>> 979f07e58878b477623e44de98eece5415194b69
