from flask_restx import Namespace, Resource, fields
from backend.db import get_db_connection
from flask import request

# Crea el Namespace
ns = Namespace('bancales', description='Operaciones relacionadas con los bancales')

# Define el modelo de datos para los bancales
bancal_model = ns.model('Bancal', {
    'id_bancal': fields.Integer(readOnly=True, description='Identificador único del bancal'),
    'nombre': fields.String(required=True, description='Nombre del bancal'),
    'filas': fields.Integer(required=True, description='Número de filas del bancal'),
    'columnas': fields.Integer(required=True, description='Número de columnas del bancal')
})

# Modelo para celdas temporales
celda_temporal_model = ns.model('CeldaTemporal', {
    'id_celda': fields.Integer(readOnly=True, description='Identificador único de la celda'),
    'id_bancal': fields.Integer(required=True, description='Identificador del bancal'),
    'fila': fields.Integer(required=True, description='Número de fila de la celda'),
    'columna': fields.Integer(required=True, description='Número de columna de la celda'),
    'contenido': fields.String(description='Contenido de la celda (planta, etc.)'),
    'semana': fields.Integer(required=True, description='Semana del año'),
    'ano': fields.Integer(required=True, description='Año')
})


# Endpoints
@ns.route('/')
class BancalList(Resource):
    @ns.doc('list_bancales')
    def get(self):
        """Obtener todos los bancales junto con el estado de sus celdas temporales"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Obtener todos los bancales
        cursor.execute('SELECT * FROM bancales')
        bancales = cursor.fetchall()

        # Obtener todas las celdas temporales
        cursor.execute('SELECT * FROM celdas_temporales')
        celdas_temporales = cursor.fetchall()

        # Agrupar celdas por id_bancal
        for bancal in bancales:
            bancal['celdas'] = [celda for celda in celdas_temporales if celda['id_bancal'] == bancal['id_bancal']]

        cursor.close()
        conn.close()
        return bancales

    @ns.doc('create_bancal')
    @ns.expect(bancal_model)
    def post(self):
        """Crear un nuevo bancal"""
        new_bancal = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO bancales (nombre, filas, columnas) 
            VALUES (%s, %s, %s)
            ''',
            (new_bancal['nombre'], new_bancal['filas'], new_bancal['columnas'])
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Bancal creado exitosamente"}, 201


@ns.route('/<int:id_bancal>')
@ns.response(404, 'Bancal no encontrado')
@ns.param('id_bancal', 'El identificador del bancal')
class Bancal(Resource):
    @ns.doc('get_bancal')
    def get(self, id_bancal):
        """Obtener un bancal por ID junto con el estado de sus celdas por semana"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Obtener datos del bancal
        cursor.execute('SELECT * FROM bancales WHERE id_bancal = %s', (id_bancal,))
        bancal = cursor.fetchone()

        if not bancal:
            ns.abort(404, "Bancal no encontrado")

        # Obtener datos de las celdas temporales del bancal
        cursor.execute('SELECT * FROM celdas_temporales WHERE id_bancal = %s', (id_bancal,))
        celdas = cursor.fetchall()

        # Cerrar la conexión
        cursor.close()
        conn.close()

        # Añadir las celdas al objeto del bancal
        bancal['celdas'] = celdas

        return bancal

    @ns.doc('update_bancal')
    @ns.expect(bancal_model)
    def put(self, id_bancal):
        """Actualizar un bancal existente"""
        update_data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            UPDATE bancales SET nombre = %s, filas = %s, columnas = %s 
            WHERE id_bancal = %s
            ''',
            (update_data['nombre'], update_data['filas'], update_data['columnas'], id_bancal)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Bancal actualizado exitosamente"}, 200

    @ns.doc('delete_bancal')
    def delete(self, id_bancal):
        """Eliminar un bancal por ID"""
        conn = get_db_connection()
        cursor = conn.cursor()

        # Eliminar primero las celdas relacionadas
        cursor.execute('DELETE FROM celdas_temporales WHERE id_bancal = %s', (id_bancal,))

        # Ahora eliminar el bancal
        cursor.execute('DELETE FROM bancales WHERE id_bancal = %s', (id_bancal,))

        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Bancal eliminado exitosamente"}, 200
