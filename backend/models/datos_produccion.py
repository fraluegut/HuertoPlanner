# models/datos_produccion.py

from flask import jsonify, request
from app import get_db_connection

def get_produccion():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM datos_produccion')
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(result)

def create_produccion(id_especie, produccion_kg, produccion_unidades, produccion_personalizada_kg, produccion_personalizada_unidades):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        '''
        INSERT INTO datos_produccion (id_especie, produccion_por_planta_kg, produccion_por_planta_unidades, produccion_personalizada_por_planta_kg, produccion_personalizada_por_planta_unidades)
        VALUES (%s, %s, %s, %s, %s) RETURNING id_produccion;
        ''',
        (id_especie, produccion_kg, produccion_unidades, produccion_personalizada_kg, produccion_personalizada_unidades)
    )
    produccion_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    conn.close()
    return produccion_id

# Otros métodos relacionados con datos de producción...
