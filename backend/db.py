import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv(Path(__file__).resolve().parent.parent / '.env')

MONGO_URI = os.getenv('MONGO_URI')
if not MONGO_URI:
    raise ValueError('MONGO_URI is not set. Add it to the .env file in the project root.')

client = MongoClient(MONGO_URI)
db = client['taskflow']
