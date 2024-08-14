import os

from flask.cli import load_dotenv
from models import Base
from sqlalchemy import create_engine

load_dotenv(path="./.env")

DB_PASS: str = os.environ.get("DB_PASS", "")
engine = create_engine("sqlite:///mydb.db")
# engine = create_engine(f"mysql+pymysql://esqpt_siq:{DB_PASS}@esq502.pt:3306/esqpt_siq")

Base.metadata.create_all(bind=engine)
