from flask import Blueprint, jsonify, request
from models.products import Product
from models.record_click import Click
from scraping import run_scraping
from middlewares import auth_middleware
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
    products = Product.query.filter_by(model=model).all()
    product_list = []

    for product in products:
        product_data = {
            'id': product.id,
            'model': product.model,
            'link': product.link,
            'title': product.title,
            'price': product.price,
            'is_damaged': product.is_damaged,
            'status': product.status
        }
        product_list.append(product_data)

    return jsonify(product_list)
@scraper_bp.route('/record_click', methods=['POST'])
def record_click():
    data = request.get_json()
    user_uuid = data.get('user_uuid')
    link = data.get('link')
    existing_click = Click.get_click_by_user_and_link(user_uuid, link)

    if existing_click:
        return jsonify({'message': 'Click already recorded'}), 400

    click = Click(user_uuid=user_uuid, link=link)
    click.save()
    product = Product.get_product_by_link(link)

    if product:
        product.update_status('red')

    return jsonify({'message': 'Click recorded successfully'}), 200

@scraper_bp.route('/record_click/<path:link>', methods=['GET'])
def get_recorded_clicks(link):
    clicks = Click.get_clicks_by_link(link)
    return jsonify(clicks)

@scraper_bp.route('/recorded_clicks', methods=['GET'])
def get_all_recorded_clicks():
    all_clicks = Click.get_all_clicks()
    return jsonify(all_clicks)

@scraper_bp.route('/product_status/<path:link>', methods=['GET'])
def get_product_status(link):
    product = Product.get_product_by_link(link)

    if product:
        status = product.get_status()
        response = jsonify({'status': status})
        return response
    else:
        return jsonify({'status': 'not found'}), 404
