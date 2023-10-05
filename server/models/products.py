from db import db
from sqlalchemy import Float

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String(255))
    link = db.Column(db.String(255))
    title = db.Column(db.String(255))
    price = db.Column(Float)
    is_damaged = db.Column(db.Boolean)
    status = db.Column(db.String(255), default="green")

    def __init__(self, model, link, title, price, is_damaged):
        self.model = model
        self.link = link
        self.title = title
        self.price = price
        self.is_damaged = is_damaged

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_products_by_model(model):
        return Product.query.filter_by(model=model).all()

    @staticmethod
    def clear_all_products():
        Product.query.delete()
        db.session.commit()

    def update_status(self, status='green'):
        if status not in ('red', 'green', 'blue'):
            raise ValueError("Invalid status. Valid statuses are 'red', 'green', or 'blue'.")
        self.status = status
        db.session.commit()

    def get_status(self):
        return self.status
    @staticmethod
    def get_product_by_link(link):
        return Product.query.filter_by(link=link).first()
