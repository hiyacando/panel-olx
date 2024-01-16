from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from models.products import Product
from models.bookmark import Bookmark
from db import db

def run_scraping(selected_model):
    chrome_driver_path = 'F:\\Program Data\\Visual Studio Code Workspace\\scraping\\panel-olx\\server\\chromedriver.exe'
    chrome_options = Options()
    chrome_options.add_argument("--disable-logging")
    chrome_options.add_argument("--incognito")
    driver = webdriver.Chrome(service=Service(chrome_driver_path), options=chrome_options)

    bookmarks = db.session.query(Bookmark).filter_by(model=selected_model).all()
    new_products_count = 0  

    for bookmark in bookmarks:
        url = bookmark.url
        model = bookmark.model

        for page_number in range(1, 4):
            page_url = f"{url}&page={page_number}"  

            driver.get(page_url)
            wait = WebDriverWait(driver, 3)
            ad_elements = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, '[data-cy="l-card"]')))

            for ad in ad_elements:
                try:
                    link_element = ad.find_element(By.CLASS_NAME, "css-rc5s2u")
                    link = link_element.get_attribute('href')
                    existing_product = Product.query.filter_by(link=link).first()
                    if existing_product:
                        print(f"Product with link '{link}' already exists. Skipping.")
                        continue

                    title_element = ad.find_element(By.CLASS_NAME, "css-16v5mdi.er34gjf0")
                    title = title_element.text

                    price_element = ad.find_element(By.CLASS_NAME, "css-10b0gli.er34gjf0")
                    price_with_negotiation = price_element.text
                    price_cleaned = float(price_with_negotiation.replace(" ", "").replace("zł", "").replace("donegocjacji", "").strip())

                    red_keywords = ["uszkodzone", "uszkodzony", "zbity", "pęknięty", "rozbity", "zgnieciony", "wgnieciony",
                                "wyszczerbiony", "pęknięcie", "złamany", "uszkodzenia", "defekt", "uszkodzona",
                                "uszkodzonego", "uszkodzonym", "uszkodzona", "uszkodzoną", "uszkodzonych"]  
                    
                    is_damaged = any(keyword.lower() in title.lower() for keyword in red_keywords)

                    product = Product(model=model, link=link, title=title, price=price_cleaned, is_damaged=is_damaged)
                    product.save()
                    new_products_count += 1 

                except Exception as e:
                    print("Błąd podczas przetwarzania tytułu:", e)
            
    driver.quit()
    print("Zakończono scraping i zapisywanie danych do bazy danych.")
    print(f"Dodano {new_products_count} nowych produktów.") 

if __name__ == '__main__':
    run_scraping()
