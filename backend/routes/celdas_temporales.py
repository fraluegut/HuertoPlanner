from flask_restx import Namespace, Resource, fields
from backend.db import get_db_connection
from flask import request

# Crea el Namespace
ns = Namespace('celdas_temporales', description='Operaciones relacionadas con las celdas temporales')

# Define el modelo de datos para las celdas temporales
celda_temporal_model = ns.model('CeldaTemporal', {
    'id_celda_temporal': fields.Integer(readOnly=True, description='Identificador único de la celda temporal'),
    'id_bancal': fields.Integer(required=True, description='Identificador del bancal'),
    'fila': fields.Integer(required=True, description='Número de fila de la celda'),
    'columna': fields.Integer(required=True, description='Número de columna de la celda'),
    'contenido': fields.String(description='Contenido de la celda (planta, etc.)'),
    'semana': fields.Integer(required=True, description='Semana del año'),
    'ano': fields.Integer(required=True, description='Año')
})

@ns.route('/')
class CeldaTemporalList(Resource):
    @ns.doc('list_celdas_temporales')
    def get(self):
        """Obtener todas las celdas temporales"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM celdas_temporales')
        celdas = cursor.fetchall()
        cursor.close()
        conn.close()
        return celdas

    @ns.doc('create_celda_temporal')
    @ns.expect(celda_temporal_model)
    def post(self):
        """Crear una nueva celda temporal"""
        new_celda = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO celdas_temporales (id_bancal, fila, columna, contenido, semana, ano) 
            VALUES (%s, %s, %s, %s, %s, %s)
            ''',
            (new_celda['id_bancal'], new_celda['fila'], new_celda['columna'], new_celda['contenido'], new_celda['semana'], new_celda['ano'])
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Celda temporal creada exitosamente"}, 201

@ns.route('/<int:id_celda_temporal>')
@ns.response(404, 'Celda temporal no encontrada')
@ns.param('id_celda_temporal', 'El identificador de la celda temporal')
class CeldaTemporal(Resource):
    @ns.doc('get_celda_temporal')
    def get(self, id_celda_temporal):
        """Obtener una celda temporal por ID"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM celdas_temporales WHERE id_celda_temporal = %s', (id_celda_temporal,))
        celda = cursor.fetchone()
        cursor.close()
        conn.close()
        if not celda:
            ns.abort(404, "Celda temporal no encontrada")
        return celda

    @ns.doc('update_celda_temporal')
    @ns.expect(celda_temporal_model)
    def put(self, id_celda_temporal):
        """Actualizar una celda temporal existente"""
        update_data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            UPDATE celdas_temporales SET contenido = %s, semana = %s, ano = %s
            WHERE id_celda_temporal = %s
            ''',
            (update_data['contenido'], update_data['semana'], update_data['ano'], id_celda_temporal)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Celda temporal actualizada exitosamente"}, 200

    @ns.doc('delete_celda_temporal')
    def delete(self, id_celda_temporal):
        """Eliminar una celda temporal por ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM celdas_temporales WHERE id_celda_temporal = %s', (id_celda_temporal,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Celda temporal eliminada exitosamente"}, 200
