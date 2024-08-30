from flask_restx import Namespace, Resource, fields
from backend.db import get_db_connection

# Crea el Namespace
ns = Namespace('plantas_por_celda', description='Operaciones relacionadas con plantas por celda')

# Define el modelo de datos para las plantas por celda
planta_por_celda_model = ns.model('PlantaPorCelda', {
    'id_plantas_por_celda': fields.Integer(readOnly=True, description='Identificador único de la planta por celda'),
    'id_especie': fields.Integer(required=True, description='ID de la especie'),
    'numero_plantas': fields.Integer(required=True, description='Número de plantas por celda'),
    'numero_plantas_personalizado': fields.Integer(description='Número de plantas personalizado por celda')
})

# Define los endpoints
@ns.route('/')
class PlantasPorCeldaList(Resource):
    @ns.doc('list_plantas_por_celda')
    def get(self):
        """Obtener todas las plantas por celda"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM plantas_por_celda')
        plantas_por_celda = cursor.fetchall()
        cursor.close()
        conn.close()
        return plantas_por_celda

    @ns.doc('create_planta_por_celda')
    @ns.expect(planta_por_celda_model)
    def post(self):
        """Crear una nueva planta por celda"""
        new_planta = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO plantas_por_celda (id_especie, numero_plantas, numero_plantas_personalizado) 
            VALUES (%s, %s, %s)
            ''',
            (new_planta['id_especie'], new_planta['numero_plantas'], new_planta.get('numero_plantas_personalizado'))
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Planta por celda creada exitosamente"}, 201

@ns.route('/<int:id_plantas_por_celda>')
@ns.response(404, 'Planta por celda no encontrada')
@ns.param('id_plantas_por_celda', 'El identificador de la planta por celda')
class PlantaPorCelda(Resource):
    @ns.doc('get_planta_por_celda')
    def get(self, id_plantas_por_celda):
        """Obtener una planta por celda por ID"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM plantas_por_celda WHERE id_plantas_por_celda = %s', (id_plantas_por_celda,))
        planta = cursor.fetchone()
        cursor.close()
        conn.close()
        if not planta:
            ns.abort(404, "Planta por celda no encontrada")
        return planta

    @ns.doc('update_planta_por_celda')
    @ns.expect(planta_por_celda_model)
    def put(self, id_plantas_por_celda):
        """Actualizar una planta por celda existente"""
        update_data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            UPDATE plantas_por_celda SET id_especie = %s, numero_plantas = %s, numero_plantas_personalizado = %s 
            WHERE id_plantas_por_celda = %s
            ''',
            (update_data['id_especie'], update_data['numero_plantas'], update_data.get('numero_plantas_personalizado'), id_plantas_por_celda)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Planta por celda actualizada exitosamente"}, 200

    @ns.doc('delete_planta_por_celda')
    def delete(self, id_plantas_por_celda):
        """Eliminar una planta por celda por ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM plantas_por_celda WHERE id_plantas_por_celda = %s', (id_plantas_por_celda,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Planta por celda eliminada exitosamente"}, 200
