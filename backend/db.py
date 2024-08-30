import mysql.connector
from mysql.connector import Error
import config

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=config.DB_HOST,
            database=config.DB_NAME,
            user=config.DB_USER,
            password=config.DB_PASSWORD,
            port=config.DB_PORT
        )
        if conn.is_connected():
            print("Conexión exitosa a la base de datos")
            return conn
    except Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None
