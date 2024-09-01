from flask_restx import Namespace, Resource, fields
from backend.db import get_db_connection
from flask import request

# Crea el Namespace
ns = Namespace('celdas_temporales', description='Operaciones relacionadas con las celdas temporales')

# Define el modelo de datos para las celdas temporales
celda_temporal_model = ns.model('CeldaTemporal', {
    'id': fields.Integer(readOnly=True, description='Identificador único de la celda temporal'),
    'id_bancal': fields.Integer(required=True, description='Identificador del bancal'),
    'fila': fields.Integer(required=True, description='Número de fila de la celda'),
    'columna': fields.Integer(required=True, description='Número de columna de la celda'),
    'contenido': fields.String(required=True, description='Contenido de la celda (id de planta)'),
    'semana': fields.Integer(required=True, description='Semana del año'),
    'ano': fields.Integer(required=True, description='Año')
})

@ns.route('/')
class CeldaTemporalList(Resource):
    @ns.doc('list_celdas_temporales')
    def get(self):
        """Obtener todas las celdas temporales"""
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute('SELECT * FROM celdas_temporales')
            celdas = cursor.fetchall()
            cursor.close()
            conn.close()
            return celdas, 200
        except Exception as e:
            return {"message": "Error al obtener celdas temporales", "error": str(e)}, 500

    @ns.doc('create_celda_temporal')
    @ns.expect(celda_temporal_model)
    def post(self):
        """Crear una nueva celda temporal"""
        new_celda = request.json
        print('Datos recibidos para crear celda:', new_celda)  # Log para ver los datos recibidos

        # Verificar que el campo 'contenido' esté presente y no esté vacío
        if 'contenido' not in new_celda or not new_celda['contenido']:
            return {"message": "El campo 'contenido' es requerido y no puede estar vacío."}, 400

        try:
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
        except Exception as e:
            print('Error al crear celda temporal:', e)  # Log para ver el error
            return {"message": "Error al crear la celda temporal", "error": str(e)}, 500

    def options(self):
        """Responder a solicitudes OPTIONS"""
        return {'status': 'ok'}, 200

@ns.route('/<int:id>')
@ns.response(404, 'Celda temporal no encontrada')
@ns.param('id', 'El identificador de la celda temporal')
class CeldaTemporal(Resource):
    @ns.doc('get_celda_temporal')
    def get(self, id):
        """Obtener una celda temporal por ID"""
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute('SELECT * FROM celdas_temporales WHERE id = %s', (id,))
            celda = cursor.fetchone()
            cursor.close()
            conn.close()
            if not celda:
                ns.abort(404, "Celda temporal no encontrada")
            return celda
        except Exception as e:
            return {"message": "Error al obtener la celda temporal", "error": str(e)}, 500

    @ns.doc('update_celda_temporal')
    @ns.expect(celda_temporal_model)
    def put(self, id):
        """Actualizar una celda temporal existente"""
        update_data = request.json
        print('Datos recibidos para actualizar celda:', update_data)  # Log para ver los datos recibidos

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                '''
                UPDATE celdas_temporales SET contenido = %s, semana = %s, ano = %s
                WHERE id = %s
                ''',
                (update_data['contenido'], update_data['semana'], update_data['ano'], id)
            )
            conn.commit()
            cursor.close()
            conn.close()
            return {"message": "Celda temporal actualizada exitosamente"}, 200
        except Exception as e:
            print('Error al actualizar celda temporal:', e)  # Log para ver el error
            return {"message": "Error al actualizar la celda temporal", "error": str(e)}, 500

    @ns.doc('delete_celda_temporal')
    def delete(self, id):
        """Eliminar una celda temporal por ID"""
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('DELETE FROM celdas_temporales WHERE id = %s', (id,))
            conn.commit()
            cursor.close()
            conn.close()
            return {"message": "Celda temporal eliminada exitosamente"}, 200
        except Exception as e:
            print('Error al eliminar celda temporal:', e)  # Log para ver el error
            return {"message": "Error al eliminar la celda temporal", "error": str(e)}, 500

    def options(self, id):
        """Responder a solicitudes OPTIONS"""
        return {'status': 'ok'}, 200
