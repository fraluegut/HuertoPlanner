# models/especies.py

from flask import jsonify, request
from app import get_db_connection

def get_all_especies():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM especies')
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(result)

def create_especie(nombre, nombre_cientifico, duracion_crecimiento, produccion_predeterminada):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        '''
        INSERT INTO especies (nombre, nombre_cientifico, duracion_crecimiento_semanas, produccion_predeterminada_por_planta)
        VALUES (%s, %s, %s, %s) RETURNING id_especie;
        ''',
        (nombre, nombre_cientifico, duracion_crecimiento, produccion_predeterminada)
    )
    especie_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    conn.close()
    return especie_id

# Otros métodos relacionados con especies...
