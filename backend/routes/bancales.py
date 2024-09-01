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

# Define los endpoints
@ns.route('/')
class BancalList(Resource):
    @ns.doc('list_bancales')
    def get(self):
        """Obtener todos los bancales con sus celdas"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM bancales')
        bancales = cursor.fetchall()

        # Para cada bancal, obtener sus celdas
        for bancal in bancales:
            cursor.execute('SELECT * FROM celdas WHERE id_bancal = %s', (bancal['id_bancal'],))
            celdas = cursor.fetchall()
            bancal['celdas'] = celdas  # Añadir las celdas al objeto del bancal

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
        """Obtener un bancal por ID junto con el estado de sus celdas"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Obtener datos del bancal
        cursor.execute('SELECT * FROM bancales WHERE id_bancal = %s', (id_bancal,))
        bancal = cursor.fetchone()

        if not bancal:
            ns.abort(404, "Bancal no encontrado")

        # Obtener datos de las celdas del bancal
        cursor.execute('SELECT * FROM celdas WHERE id_bancal = %s', (id_bancal,))
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
        cursor.execute('DELETE FROM celdas WHERE id_bancal = %s', (id_bancal,))

        # Ahora eliminar el bancal
        cursor.execute('DELETE FROM bancales WHERE id_bancal = %s', (id_bancal,))

        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Bancal eliminado exitosamente"}, 200
