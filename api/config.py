import os

from dotenv import load_dotenv
from models import Base
from sqlalchemy import create_engine, exc

# Load enviroment variables
load_dotenv(dotenv_path="./.env")

DB_PASS: str = os.environ.get("DB_PASS", "")
DB_USER = os.environ.get("DB_USER", "esqpt_siq")  # Ensure to set this in your .env file
DB_HOST = os.environ.get("DB_HOST", "esq502.pt")
DB_PORT = os.environ.get("DB_PORT", 3306)
DB_NAME = os.environ.get("DB_NAME", "esqpt_siq")

# connection_string=("sqlite:///mydb.db")

# Define connection string
connection_string = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

try:
    # Create the SQLAlchemy engine with improved configuration
    engine = create_engine(
        connection_string,
        pool_size=200,  # Adjust based on your needs
        max_overflow=10,  # Allow some overflow
        pool_timeout=30,  # Wait time for getting a connection
        pool_recycle=3600,  # Recycle connections every hour
    )

    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database setup completed successfully.")

except exc.SQLAlchemyError as e:
    print(f"An error occurred while setting up the database: {e}")
