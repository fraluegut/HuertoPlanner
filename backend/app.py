# app.py

from flask import Flask, jsonify, request
import psycopg2
from psycopg2.extras import RealDictCursor
import config
from models import especies, datos_produccion, plantas_por_celda, bancales, celdas, plantas_en_bancales

app = Flask(__name__)


# Función para conectarse a la base de datos
def get_db_connection():
    conn = psycopg2.connect(
        host=config.DB_HOST,
        database=config.DB_NAME,
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        port=config.DB_PORT
    )
    return conn


# Ruta de ejemplo para obtener todas las especies
@app.route('/api/especies', methods=['GET'])
def get_especies():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute('SELECT * FROM especies')
    especies = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(especies)


# Ruta para crear una nueva especie
@app.route('/api/especies', methods=['POST'])
def create_especie():
    new_especie = request.get_json()
    nombre = new_especie['nombre']
    nombre_cientifico = new_especie['nombre_cientifico']
    duracion_crecimiento_semanas = new_especie['duracion_crecimiento_semanas']
    produccion_predeterminada = new_especie['produccion_predeterminada_por_planta']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        '''
        INSERT INTO especies (nombre, nombre_cientifico, duracion_crecimiento_semanas, produccion_predeterminada_por_planta)
        VALUES (%s, %s, %s, %s) RETURNING id_especie;
        ''',
        (nombre, nombre_cientifico, duracion_crecimiento_semanas, produccion_predeterminada)
    )
    especie_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"id_especie": especie_id, "message": "Especie creada exitosamente"}), 201


# Ruta para actualizar una especie existente
@app.route('/api/especies/<int:id_especie>', methods=['PUT'])
def update_especie(id_especie):
    update_data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        '''
        UPDATE especies SET nombre = %s, nombre_cientifico = %s, duracion_crecimiento_semanas = %s, produccion_predeterminada_por_planta = %s
        WHERE id_especie = %s;
        ''',
        (update_data['nombre'], update_data['nombre_cientifico'], update_data['duracion_crecimiento_semanas'],
         update_data['produccion_predeterminada_por_planta'], id_especie)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Especie actualizada exitosamente"}), 200


# Otras rutas y lógica de la API...

if __name__ == '__main__':
    app.run(debug=True)
