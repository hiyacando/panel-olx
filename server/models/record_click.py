from datetime import datetime

class Click:
    clicked_users = set()  # Zbiór przechowujący ID użytkowników, którzy kliknęli na link

    def __init__(self, user_id, link):
        self.user_id = user_id
        self.link = link
        self.timestamp = datetime.now()  # Dodaj czas w momencie tworzenia obiektu Click


    def save(self):
        collection = Click.db['clicks']
        click_data = {
            'user_id': self.user_id,
            'link': self.link,
            'timestamp': self.timestamp 

        }
        collection.insert_one(click_data)
        Click.clicked_users.add(self.user_id)

    @staticmethod
    def get_clicks_by_link(link):
        collection = Click.db['clicks']
        clicks = collection.find({'link': link}, {'_id': False, 'user_id': True, 'timestamp': True, 'link': True})
        return clicks
    @staticmethod
    def get_all_clicks():
        collection = Click.db['clicks']
        all_clicks = collection.find({}, {'_id': False, 'user_id': True, 'timestamp': True, 'link': True})
        return list(all_clicks)
    
    @staticmethod
    def clear_all_clicks():
        collection = Click.db['clicks']
        collection.delete_many({})