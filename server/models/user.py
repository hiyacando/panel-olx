class User:
    def __init__(self, id, email, password, role="user"):
        self.id = id
        self.email = email
        self.password = password
        self.role = role
