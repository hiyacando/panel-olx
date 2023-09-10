class Url:
    def __init__(self, id, model, url, title):
        self.id = id
        self.model = model
        self.url = url
        self.title = title

    def save(self):
        collection = self.db['urls']
        url_data = {
            'id': self.id,
            'model': self.model,
            'url': self.url,
            'title': self.title
        }
        collection.insert_one(url_data)

    @staticmethod
    def get_all_urls():
        collection = Url.db['urls']
        urls = list(collection.find())
        return urls
