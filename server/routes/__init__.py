from flask import Blueprint
from middlewares import auth_middleware

# Tworzenie blueprinta dla 'auth'
from .auth import auth_bp
# Tworzenie blueprinta dla 'scraper'
from .scraper import scraper_bp

# Rejestracja blueprintów
def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(scraper_bp, url_prefix='/scraper')

# Inicjalizacja i konfiguracja blueprintów
def init_app(app):
    register_blueprints(app)
    # Dodatkowe konfiguracje blueprintów lub inne operacje inicjalizacyjne
    # można umieścić tutaj

# Przykładowe inne konfiguracje dla całej aplikacji
def configure_app(app):
    app.config['SOME_CONFIG'] = 'some_value'

# Importowanie modułów, aby blueprinty były dostępne
from . import auth, scraper