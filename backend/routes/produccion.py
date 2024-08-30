from flask_restx import Namespace, Resource, fields
from backend.db import get_db_connection

# Crea el Namespace
ns = Namespace('produccion', description='Operaciones relacionadas con los datos de producción')

# Define el modelo de datos para la producción
produccion_model = ns.model('Produccion', {
    'id_produccion': fields.Integer(readOnly=True, description='Identificador único de la producción'),
    'id_especie': fields.Integer(required=True, description='ID de la especie'),
    'produccion_por_planta_kg': fields.String(required=True, description='Producción por planta en kilogramos'),
    'produccion_por_planta_unidades': fields.String(required=True, description='Producción por planta en unidades'),
    'produccion_personalizada_por_planta_kg': fields.String(description='Producción personalizada por planta en kilogramos'),
    'produccion_personalizada_por_planta_unidades': fields.String(description='Producción personalizada por planta en unidades')
})

# Define los endpoints
@ns.route('/')
class ProduccionList(Resource):
    @ns.doc('list_produccion')
    def get(self):
        """Obtener todas las producciones"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM datos_produccion')
        producciones = cursor.fetchall()
        cursor.close()
        conn.close()
        return producciones

    @ns.doc('create_produccion')
    @ns.expect(produccion_model)
    def post(self):
        """Crear una nueva producción"""
        new_produccion = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO datos_produccion (id_especie, produccion_por_planta_kg, produccion_por_planta_unidades, 
            produccion_personalizada_por_planta_kg, produccion_personalizada_por_planta_unidades) 
            VALUES (%s, %s, %s, %s, %s)
            ''',
            (new_produccion['id_especie'], new_produccion['produccion_por_planta_kg'], new_produccion['produccion_por_planta_unidades'],
             new_produccion.get('produccion_personalizada_por_planta_kg'), new_produccion.get('produccion_personalizada_por_planta_unidades'))
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Producción creada exitosamente"}, 201

@ns.route('/<int:id_produccion>')
@ns.response(404, 'Producción no encontrada')
@ns.param('id_produccion', 'El identificador de la producción')
class Produccion(Resource):
    @ns.doc('get_produccion')
    def get(self, id_produccion):
        """Obtener una producción por ID"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM datos_produccion WHERE id_produccion = %s', (id_produccion,))
        produccion = cursor.fetchone()
        cursor.close()
        conn.close()
        if not produccion:
            ns.abort(404, "Producción no encontrada")
        return produccion

    @ns.doc('update_produccion')
    @ns.expect(produccion_model)
    def put(self, id_produccion):
        """Actualizar una producción existente"""
        update_data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            UPDATE datos_produccion SET id_especie = %s, produccion_por_planta_kg = %s, produccion_por_planta_unidades = %s, 
            produccion_personalizada_por_planta_kg = %s, produccion_personalizada_por_planta_unidades = %s
            WHERE id_produccion = %s
            ''',
            (update_data['id_especie'], update_data['produccion_por_planta_kg'], update_data['produccion_por_planta_unidades'],
             update_data.get('produccion_personalizada_por_planta_kg'), update_data.get('produccion_personalizada_por_planta_unidades'), id_produccion)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Producción actualizada exitosamente"}, 200

    @ns.doc('delete_produccion')
    def delete(self, id_produccion):
        """Eliminar una producción por ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM datos_produccion WHERE id_produccion = %s', (id_produccion,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Producción eliminada exitosamente"}, 200
