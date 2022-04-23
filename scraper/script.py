import random
import json
import sqlite3
import time
import datetime
import requests
import numpy as np
from bs4 import BeautifulSoup

user_agent_list = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
    'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36'
]

for i in range(1, 4):
    user_agent = random.choice(user_agent_list)
headers = {'User-Agent': user_agent}

conn = sqlite3.connect('db.sqlite3.db')
c = conn.cursor()

# Add terms you want to scrape here
terms = ['children+military', 'reintegration', 'military+families', 'divorce+military',
         'spouses+military', 'military+deployments', 'active+duty', 'military+ptsd', 'military+youth', 'military+reintegration', 'service+members+ptsd',
         'military+veterans', '\"war+and+terrorism\"', 'military', 'armed+forces', 'military+spouses', 'military+divorce',
         'military+parenting', 'service+members', 'soldiers', 'airmen', 'marines', 'sailor', 'coast+guardsmen', 'national+guardsmen',
         'reservists', 'veterans', 'posttraumatic+stress+disorder', 'reserve+component', 'war', 'terrorism']




# Function to create the database table. Only required to run on first iteration.
def create_db():
    # c.execute(
    #     '''CREATE TABLE articles(title TEXT, author TEXT, description TEXT, url TEXT)''')
    c.execute('''CREATE TABLE "home_article" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "title" varchar(200) NULL, "author" varchar(200) NULL, "year" varchar(200) NULL, "journal" varchar(200) NULL, "description" text NULL, "URL" varchar(200) NULL, "created" datetime NOT NULL, "user_id" bigint NULL REFERENCES "home_user" ("id") DEFERRABLE INITIALLY DEFERRED)''')

# Function to scrape multiple pages
def scrape():
    for term in terms:
        URL = 'https://scholar.google.com/scholar?start=00&q='+(term)+'&hl=en&as_sdt=0,1'
        # Scrape the first 5 pages of the key term (first 50 articles)
        for page in range(0, 2):
            new_url = URL[:41] + str(page) + URL[42:]
            time.sleep((30-5)*np.random.random()+5)
            html = requests.get(new_url, headers=headers).text
            soup = BeautifulSoup(html, 'html.parser')

            # Parsing through the data and grabbing what we need to populate our DB
            for result in soup.select('.gs_ri'):
                title = result.select_one('.gs_rt').text
                author = result.select_one('.gs_a').text
                description = result.select_one('.gs_rs').text
                url = result.select_one('.gs_rt a')['href']
                try:
                    all_article_versions = result.select_one(
                        'a~ a+ .gs_nph')['href']
                except:
                    all_article_versions = None
                c.execute('''INSERT INTO home_article VALUES(?,?,?,?,?,?,?,?,?)''',
                          (title, author, description, url))
            print('Finished scraping page ' + str(page) + ' of term: ' + term)

# create_db()
# scrape()
conn.commit()
conn.close()
