from flask import Blueprint, jsonify, request
from bson import json_util
from middlewares import auth_middleware
from models.products import Product
from models.urls import Url
from models.record_click import Click
from scraping import run_scraping
scraper_bp = Blueprint('scraper', __name__)

scraper_bp.before_request(auth_middleware)

@scraper_bp.route('/scrape_data', methods=['POST'])
def scrape():
    Product.clear_all_products()
    Click.clear_all_clicks()
    run_scraping()
    return "Scraping completed."

@scraper_bp.route('/products/<model>', methods=['GET'])
def get_products_by_model(model):
    products = Product.get_products_by_model(model)
    return json_util.dumps(products)

@scraper_bp.route('/urls', methods=['GET'])
def get_urls():
    urls = Url.get_all_urls()
    return json_util.dumps(urls)

@scraper_bp.route('/record_click', methods=['POST'])
def record_click():
    data = request.get_json()
    user_id = data.get('user_id')
    link = data.get('link')
    existing_click = Click.db['clicks'].find_one({'user_id': user_id, 'link': link})
    if existing_click:
        return jsonify({'message': 'Click already recorded'}), 400

    click = Click(user_id=user_id, link=link)
    click.save()
    product = Product.db['products'].find_one({'link': link})
    if product:
        product['status'] = 'red'
        Product.db['products'].update_one({'link': link}, {'$set': {'status': 'red'}})

    return jsonify({'message': 'Click recorded successfully'}), 200

@scraper_bp.route('/record_click/<path:link>', methods=['GET'])
def get_recorded_clicks(link):
    clicks = Click.get_clicks_by_link(link)
    return json_util.dumps(clicks)

@scraper_bp.route('/recorded_clicks', methods=['GET'])
def get_all_recorded_clicks():
    all_clicks = Click.get_all_clicks()  
    return json_util.dumps(all_clicks)

@scraper_bp.route('/product_status/<path:link>', methods=['GET'])
def get_product_status(link):
    product = Product.db['products'].find_one({'link': link})
    if product:
        status = product.get('status', 'green')
        return jsonify({'status': status})
    else:
        return jsonify({'status': 'not found'}), 404
