import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "neurobloom.db")


def get_db():
    """Return a new database connection with row factory set."""
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    """Initialise the database by executing schema.sql."""
    connection = get_db()
    schema_path = os.path.join(BASE_DIR, "schema.sql")
    with open(schema_path, "r") as f:
        connection.executescript(f.read())
    connection.commit()
    connection.close()
