
class Product:
    def __init__(self, model, link, title, price, is_damaged, status="green"):
        self.model = model
        self.link = link
        self.title = title
        self.price = price
        self.is_damaged = is_damaged
        self.status = status

    def save(self):
        collection = self.db['products']
        product_data = {
            'model': self.model,
            'link': self.link,
            'title': self.title,
            'price': self.price,
            'is_damaged': self.is_damaged,
            'status': self.status
        }
        collection.insert_one(product_data)
    @staticmethod
    def get_products_by_model(model):
        collection = Product.db['products'] 
        products = list(collection.find({'model': model}))
        return products
    @staticmethod
    def clear_all_products():
        collection = Product.db['products']
        collection.delete_many({})

    def update_status(self, status='green'):
        if status not in ('red', 'green', 'blue'):
            raise ValueError("Invalid status. Valid statuses are 'red', 'green', or 'blue'.")
        self.status = status
        
    def get_status(self):
        return self.status