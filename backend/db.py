import os
from pymongo import MongoClient

# MongoDB Atlas connection placeholder
# In a real app, use environment variables
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://naomiiap:nayohmee@cluster0.tda1xix.mongodb.net/?appName=Cluster0")
client = MongoClient(MONGO_URI)
db = client['taskflow']

