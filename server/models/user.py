class User:
    def __init__(self, id, email, password, role="unverifed"):
        self.id = id
        self.email = email
        self.password = password
        self.role = role
