"""
NeuroBloom — PostgreSQL database helper.
Reads connection credentials from .env via python-dotenv.
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Load .env from the same directory as this file
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))


def get_db():
    """Return a new PostgreSQL connection. Rows are accessible as dicts."""
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        dbname=os.getenv("DB_NAME", "neurobloom"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
        cursor_factory=RealDictCursor,
    )
    return conn


def init_db():
    """
    Initialise the database by running schema.sql.
    Safe to call on every startup — all statements use IF NOT EXISTS.
    """
    schema_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "schema.sql")
    with open(schema_path, "r") as f:
        sql = f.read()

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.commit()
    finally:
        conn.close()
