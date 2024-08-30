from flask_restx import Namespace, Resource, fields
from flask import request
from backend.db import get_db_connection

# Crea el Namespace
ns = Namespace('especies', description='Operaciones relacionadas con las especies')

# Define el modelo de datos para las especies
especie_model = ns.model('Especie', {
    'id_especie': fields.Integer(readOnly=True, description='Identificador único de la especie'),
    'nombre': fields.String(required=True, description='Nombre de la especie'),
    'nombre_cientifico': fields.String(required=True, description='Nombre científico de la especie'),
    'duracion_crecimiento_semanas': fields.Integer(required=True, description='Duración de crecimiento en semanas'),
    'produccion_predeterminada_por_planta': fields.String(required=True, description='Producción predeterminada por planta')
})

# Define los endpoints
@ns.route('/')
class EspecieList(Resource):
    @ns.doc('list_especies')
    def get(self):
        """Obtener todas las especies"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM especies')
        especies = cursor.fetchall()
        cursor.close()
        conn.close()
        return especies

    @ns.doc('create_especie')
    @ns.expect(especie_model)
    def post(self):
        """Crear una nueva especie"""
        new_especie = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO especies (nombre, nombre_cientifico, duracion_crecimiento_semanas, produccion_predeterminada_por_planta) 
            VALUES (%s, %s, %s, %s)
            ''',
            (new_especie['nombre'], new_especie['nombre_cientifico'], new_especie['duracion_crecimiento_semanas'], new_especie['produccion_predeterminada_por_planta'])
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Especie creada exitosamente"}, 201

@ns.route('/<int:id_especie>')
@ns.response(404, 'Especie no encontrada')
@ns.param('id_especie', 'El identificador de la especie')
class Especie(Resource):
    @ns.doc('get_especie')
    def get(self, id_especie):
        """Obtener una especie por ID"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM especies WHERE id_especie = %s', (id_especie,))
        especie = cursor.fetchone()
        cursor.close()
        conn.close()
        if not especie:
            ns.abort(404, "Especie no encontrada")
        return especie

    @ns.doc('update_especie')
    @ns.expect(especie_model)
    def put(self, id_especie):
        """Actualizar una especie existente"""
        update_data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            UPDATE especies SET nombre = %s, nombre_cientifico = %s, duracion_crecimiento_semanas = %s, 
            produccion_predeterminada_por_planta = %s
            WHERE id_especie = %s
            ''',
            (update_data['nombre'], update_data['nombre_cientifico'], update_data['duracion_crecimiento_semanas'],
             update_data['produccion_predeterminada_por_planta'], id_especie)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Especie actualizada exitosamente"}, 200

    @ns.doc('delete_especie')
    def delete(self, id_especie):
        """Eliminar una especie por ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM especies WHERE id_especie = %s', (id_especie,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Especie eliminada exitosamente"}, 200
