from flask_restx import Namespace, Resource, fields
from backend.db import get_db_connection
from flask import request

ns = Namespace('plantas_fases', description='Operaciones relacionadas con las plantas')

# Modelo para las fases de las plantas
especie_fase_model = ns.model('EspecieFase', {
    'especie_id': fields.Integer(required=True, description='Identificador de la especie'),
    'nombre_especie': fields.String(required=True, description='Nombre común de la especie'),
    'siembra_semanas': fields.Integer(default=0, description='Semanas de siembra'),
    'germinacion_semanas': fields.Integer(default=0, description='Semanas de germinación'),
    'crecimiento_semanas': fields.Integer(default=0, description='Semanas de crecimiento vegetativo'),
    'floracion_semanas': fields.Integer(default=0, description='Semanas de floración'),
    'fructificacion_semanas': fields.Integer(default=0, description='Semanas de fructificación'),
    'maduracion_semanas': fields.Integer(default=0, description='Semanas de maduración del fruto'),
    'cosecha_semanas': fields.Integer(default=0, description='Semanas de cosecha'),
    'senescencia_semanas': fields.Integer(default=0, description='Semanas de senescencia')
})

@ns.route('/<int:especie_id>')
class EspecieFase(Resource):
    @ns.doc('get_especie_fase')
    def get(self, especie_id):
        """Obtener fases de crecimiento para una especie específica"""
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM especie_fases WHERE especie_id = %s', (especie_id,))
        fases = cursor.fetchone()
        cursor.close()
        conn.close()
        if not fases:
            ns.abort(404, "Fases no encontradas para la especie especificada")
        return fases