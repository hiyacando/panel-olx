from db import db

group_members = db.Table(
    'group_members',
    db.Column('id', db.Integer, primary_key=True, autoincrement=True),
    db.Column('group', db.String(36), db.ForeignKey('groups.group_uuid')),
    db.Column('member', db.String(36), db.ForeignKey('users.user_uuid')),
    db.Column('role', db.String(255), default="member")
)

class Group(db.Model):
    __tablename__ = 'groups'
    id = db.Column(db.Integer, unique=True, primary_key=True, autoincrement=True)
    group_uuid = db.Column(db.String(36), primary_key=True, index=True)
    name = db.Column(db.String(255))
    members = db.relationship('User', secondary=group_members, back_populates='group')
    

    def __init__(self, group_uuid, name):
        self.group_uuid = group_uuid
        self.name = name
    def add_member(self, user_uuid, role="member"):
        from models.user import User

        user = User.query.filter_by(user_uuid=user_uuid).first()

        if user:
            if user in self.members:
                return {'error': 'Uzytkownik jest juz czlonkiem grupy'}, 400

            self.members.append(user)

            db.session.execute(
                group_members.update().values({'role': role}).where(
                    db.and_(group_members.c.group == self.group_uuid, group_members.c.member == user_uuid)
                )
            )

            db.session.commit()

            return {'message': 'Dodano uzytkownika do grupy'}, 200
        else:
            return {'error': 'Nie znaleziono uzytkownika'}, 404
    def remove_group(self):
        for user in self.members:
            user.group = None
            user.group_role = None
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "group_uuid": self.group_uuid,
            "name": self.name,
            "members": [member.user_uuid for member in self.members],
        }
