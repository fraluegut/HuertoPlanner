from flask_restx import Namespace, Resource, fields
from backend.db import get_db_connection

# Crea el Namespace
ns = Namespace('plantas_en_bancales', description='Operaciones relacionadas con las plantas en los bancales')

# Define el modelo de datos para las plantas en los bancales
plantas_en_bancales_model = ns.model('PlantaEnBancal', {
    'id_planta': fields.Integer(readOnly=True, description='Identificador único de la planta en bancal'),
    'id_celda': fields.Integer(required=True, description='ID de la celda'),
    'id_especie': fields.Integer(required=True, description='ID de la especie'),
    'semana_plantada': fields.Integer(required=True, description='Semana en que fue plantada'),
    'duracion_semanas': fields.Integer(required=True, description='Duración en semanas'),
    'estado_semanal': fields.String(description='Estado semanal de la planta')
})

# Define los endpoints
@ns.route('/')
class PlantasEnBancalesList(Resource):
    @ns.doc('list_plantas_en_bancales')
    def get(self):
        """Obtener todas las plantas en bancales"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM plantas_en_bancales')
        plantas = cursor.fetchall()
        cursor.close()
        conn.close()
        return plantas

    @ns.doc('create_planta_en_bancal')
    @ns.expect(plantas_en_bancales_model)
    def post(self):
        """Crear una nueva planta en bancal"""
        new_planta = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO plantas_en_bancales (id_celda, id_especie, semana_plantada, duracion_semanas, estado_semanal) 
            VALUES (%s, %s, %s, %s, %s)
            ''',
            (new_planta['id_celda'], new_planta['id_especie'], new_planta['semana_plantada'],
             new_planta['duracion_semanas'], new_planta.get('estado_semanal'))
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Planta en bancal creada exitosamente"}, 201

@ns.route('/<int:id_planta>')
@ns.response(404, 'Planta en bancal no encontrada')
@ns.param('id_planta', 'El identificador de la planta en bancal')
class PlantaEnBancal(Resource):
    @ns.doc('get_planta_en_bancal')
    def get(self, id_planta):
        """Obtener una planta en bancal por ID"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM plantas_en_bancales WHERE id_planta = %s', (id_planta,))
        planta = cursor.fetchone()
        cursor.close()
        conn.close()
        if not planta:
            ns.abort(404, "Planta en bancal no encontrada")
        return planta

    @ns.doc('update_planta_en_bancal')
    @ns.expect(plantas_en_bancales_model)
    def put(self, id_planta):
        """Actualizar una planta en bancal existente"""
        update_data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            UPDATE plantas_en_bancales SET id_celda = %s, id_especie = %s, semana_plantada = %s, 
            duracion_semanas = %s, estado_semanal = %s
            WHERE id_planta = %s
            ''',
            (update_data['id_celda'], update_data['id_especie'], update_data['semana_plantada'],
             update_data['duracion_semanas'], update_data.get('estado_semanal'), id_planta)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Planta en bancal actualizada exitosamente"}, 200

    @ns.doc('delete_planta_en_bancal')
    def delete(self, id_planta):
        """Eliminar una planta en bancal por ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM plantas_en_bancales WHERE id_planta = %s', (id_planta,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Planta en bancal eliminada exitosamente"}, 200
