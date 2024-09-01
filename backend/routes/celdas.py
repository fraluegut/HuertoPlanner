from flask_restx import Namespace, Resource, fields
from backend.db import get_db_connection
from flask import request  # Asegúrate de importar request

ns = Namespace('celdas', description='Operaciones relacionadas con las celdas')

celda_model = ns.model('Celda', {
    'id_celda': fields.Integer(readOnly=True, description='Identificador único de la celda'),
    'id_bancal': fields.Integer(required=True, description='Identificador del bancal'),
    'fila': fields.Integer(required=True, description='Número de fila de la celda'),
    'columna': fields.Integer(required=True, description='Número de columna de la celda'),
    'contenido': fields.String(description='Contenido de la celda (planta, etc.)')
})

@ns.route('/')
class CeldaList(Resource):
    @ns.doc('list_celdas')
    def get(self):
        """Obtener todas las celdas"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM celdas')
        celdas = cursor.fetchall()
        cursor.close()
        conn.close()
        return celdas

    @ns.doc('create_celda')
    @ns.expect(celda_model)
    def post(self):
        """Crear una nueva celda"""
        new_celda = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO celdas (id_bancal, fila, columna, contenido) 
            VALUES (%s, %s, %s, %s)
            ''',
            (new_celda['id_bancal'], new_celda['fila'], new_celda['columna'], new_celda['contenido'])
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Celda creada exitosamente"}, 201

@ns.route('/<int:id_celda>')
@ns.response(404, 'Celda no encontrada')
@ns.param('id_celda', 'El identificador de la celda')
class Celda(Resource):
    @ns.doc('get_celda')
    def get(self, id_celda):
        """Obtener una celda por ID"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM celdas WHERE id_celda = %s', (id_celda,))
        celda = cursor.fetchone()
        cursor.close()
        conn.close()
        if not celda:
            ns.abort(404, "Celda no encontrada")
        return celda

    @ns.doc('update_celda')
    @ns.expect(celda_model)
    def put(self, id_celda):
        """Actualizar una celda existente"""
        update_data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            UPDATE celdas SET contenido = %s 
            WHERE id_celda = %s
            ''',
            (update_data['contenido'], id_celda)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Celda actualizada exitosamente"}, 200

    @ns.doc('delete_celda')
    def delete(self, id_celda):
        """Eliminar una celda por ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM celdas WHERE id_celda = %s', (id_celda,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Celda eliminada exitosamente"}, 200
