from flask import Flask, jsonify, request
from flask_restx import Api, Resource, fields
from db import get_db_connection
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

# Configuración de Flask-RESTx para la API y Swagger
api = Api(app, version='1.0', title='HuertoPlan API',
          description='API para gestionar los datos de producción y especies de un huerto.')

### Namespaces y Modelos

# 1. Namespace para Especies
ns_especies = api.namespace('especies', description='Operaciones relacionadas con las especies')

especie_model = api.model('Especie', {
    'nombre': fields.String(required=True, description='Nombre común de la especie'),
    'nombre_cientifico': fields.String(required=True, description='Nombre científico de la especie'),
    'duracion_crecimiento_semanas': fields.Integer(required=True, description='Duración de crecimiento en semanas'),
    'produccion_predeterminada_por_planta': fields.String(required=True, description='Producción predeterminada por planta')
})

# 2. Namespace para Datos de Producción
ns_produccion = api.namespace('produccion', description='Operaciones relacionadas con los datos de producción')

produccion_model = api.model('Produccion', {
    'id_especie': fields.Integer(required=True, description='ID de la especie'),
    'produccion_por_planta_kg': fields.String(required=True, description='Producción por planta en kg'),
    'produccion_por_planta_unidades': fields.String(required=True, description='Producción por planta en unidades'),
    'produccion_personalizada_por_planta_kg': fields.String(description='Producción personalizada por planta en kg'),
    'produccion_personalizada_por_planta_unidades': fields.String(description='Producción personalizada por planta en unidades')
})

# 3. Namespace para Plantas por Celda
ns_plantas_por_celda = api.namespace('plantas_por_celda', description='Operaciones relacionadas con plantas por celda')

plantas_por_celda_model = api.model('PlantasPorCelda', {
    'id_especie': fields.Integer(required=True, description='ID de la especie'),
    'plantas_sugeridas_por_celda': fields.Integer(required=True, description='Número sugerido de plantas por celda'),
    'plantas_personalizadas_por_celda': fields.Integer(description='Número personalizado de plantas por celda')
})

# 4. Namespace para Bancales
ns_bancales = api.namespace('bancales', description='Operaciones relacionadas con los bancales')

bancal_model = api.model('Bancal', {
    'nombre': fields.String(required=True, description='Nombre del bancal'),
    'filas': fields.Integer(required=True, description='Número de filas en el bancal'),
    'columnas': fields.Integer(required=True, description='Número de columnas en el bancal')
})

# 5. Namespace para Celdas
ns_celdas = api.namespace('celdas', description='Operaciones relacionadas con las celdas')

celda_model = api.model('Celda', {
    'id_bancal': fields.Integer(required=True, description='ID del bancal al que pertenece la celda'),
    'fila': fields.String(required=True, description='Fila de la celda'),
    'columna': fields.Integer(required=True, description='Columna de la celda'),
    'id_planta': fields.Integer(description='ID de la planta en la celda')
})

# 6. Namespace para Plantas en Bancales
ns_plantas_en_bancales = api.namespace('plantas_en_bancales', description='Operaciones relacionadas con plantas en bancales')

plantas_en_bancales_model = api.model('PlantasEnBancal', {
    'id_celda': fields.Integer(required=True, description='ID de la celda'),
    'id_especie': fields.Integer(required=True, description='ID de la especie'),
    'semana_plantada': fields.Integer(required=True, description='Semana en que se plantó'),
    'duracion_semanas': fields.Integer(required=True, description='Duración en semanas'),
    'estado_semanal': fields.Raw(description='Estado semanal en formato JSON')
})


### Endpoints para cada entidad

# Endpoints para Especies
@ns_especies.route('/')
class EspecieList(Resource):
    @ns_especies.doc('list_especies')
    def get(self):
        """Obtener todas las especies"""
        conn = get_db_connection()
        print("Vamos bien")
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor(dictionary=True)  # Utiliza 'dictionary=True' para obtener resultados como diccionarios
        cursor.execute('SELECT * FROM especies')
        especies = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(especies)

    @ns_especies.doc('create_especie')
    @ns_especies.expect(especie_model)
    def post(self):
        """Crear una nueva especie"""
        new_especie = request.json
        nombre = new_especie['nombre']
        nombre_cientifico = new_especie['nombre_cientifico']
        duracion_crecimiento_semanas = new_especie['duracion_crecimiento_semanas']
        produccion_predeterminada = new_especie['produccion_predeterminada_por_planta']

        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO especies (nombre, nombre_cientifico, duracion_crecimiento_semanas, produccion_predeterminada_por_planta)
            VALUES (%s, %s, %s, %s) RETURNING id_especie;
            ''',
            (nombre, nombre_cientifico, duracion_crecimiento_semanas, produccion_predeterminada)
        )
        especie_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        return {"id_especie": especie_id, "message": "Especie creada exitosamente"}, 201

@ns_especies.route('/<int:id_especie>')
@ns_especies.response(404, 'Especie no encontrada')
@ns_especies.param('id_especie', 'El identificador de la especie')
class Especie(Resource):
    @ns_especies.doc('get_especie')
    def get(self, id_especie):
        """Obtener una especie por ID"""
        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM especies WHERE id_especie = %s', (id_especie,))
        especie = cursor.fetchone()
        cursor.close()
        conn.close()
        if especie is None:
            api.abort(404, "Especie no encontrada")
        return jsonify(especie)

    @ns_especies.doc('update_especie')
    @ns_especies.expect(especie_model)
    def put(self, id_especie):
        """Actualizar una especie existente"""
        update_data = request.json
        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor()
        cursor.execute(
            '''
            UPDATE especies SET nombre = %s, nombre_cientifico = %s, duracion_crecimiento_semanas = %s, produccion_predeterminada_por_planta = %s
            WHERE id_especie = %s;
            ''',
            (update_data['nombre'], update_data['nombre_cientifico'], update_data['duracion_crecimiento_semanas'], update_data['produccion_predeterminada_por_planta'], id_especie)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Especie actualizada exitosamente"}, 200

    @ns_especies.doc('delete_especie')
    def delete(self, id_especie):
        """Eliminar una especie por ID"""
        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor()
        cursor.execute('DELETE FROM especies WHERE id_especie = %s', (id_especie,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Especie eliminada exitosamente"}, 200

# Endpoints para Datos de Producción
@ns_produccion.route('/')
class ProduccionList(Resource):
    @ns_produccion.doc('list_produccion')
    def get(self):
        """Obtener todos los datos de producción"""
        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM datos_produccion')
        produccion = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(produccion)

    @ns_produccion.doc('create_produccion')
    @ns_produccion.expect(produccion_model)
    def post(self):
        """Crear nuevos datos de producción"""
        new_produccion = request.json
        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO datos_produccion (id_especie, produccion_por_planta_kg, produccion_por_planta_unidades, produccion_personalizada_por_planta_kg, produccion_personalizada_por_planta_unidades)
            VALUES (%s, %s, %s, %s, %s) RETURNING id_produccion;
            ''',
            (new_produccion['id_especie'], new_produccion['produccion_por_planta_kg'], new_produccion['produccion_por_planta_unidades'],
             new_produccion.get('produccion_personalizada_por_planta_kg'), new_produccion.get('produccion_personalizada_por_planta_unidades'))
        )
        produccion_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        return {"id_produccion": produccion_id, "message": "Producción creada exitosamente"}, 201

# Endpoints para Plantas por Celda
@ns_plantas_por_celda.route('/')
class PlantasPorCeldaList(Resource):
    @ns_plantas_por_celda.doc('list_plantas_por_celda')
    def get(self):
        """Obtener todas las configuraciones de plantas por celda"""
        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM plantas_por_celda')
        plantas = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(plantas)

    @ns_plantas_por_celda.doc('create_plantas_por_celda')
    @ns_plantas_por_celda.expect(plantas_por_celda_model)
    def post(self):
        """Crear una nueva configuración de plantas por celda"""
        new_config = request.json
        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO plantas_por_celda (id_especie, plantas_sugeridas_por_celda, plantas_personalizadas_por_celda)
            VALUES (%s, %s, %s) RETURNING id_plantas_por_celda;
            ''',
            (new_config['id_especie'], new_config['plantas_sugeridas_por_celda'], new_config.get('plantas_personalizadas_por_celda'))
        )
        config_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        return {"id_plantas_por_celda": config_id, "message": "Configuración de plantas por celda creada exitosamente"}, 201

# Endpoints para Bancales
@ns_bancales.route('/')
class BancalList(Resource):
    @ns_bancales.doc('list_bancales')
    def get(self):
        """Obtener todos los bancales"""
        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM bancales')
        bancales = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(bancales)

    @ns_bancales.doc('create_bancal')
    @ns_bancales.expect(bancal_model)
    def post(self):
        """Crear un nuevo bancal"""
        new_bancal = request.json
        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO bancales (nombre, filas, columnas)
            VALUES (%s, %s, %s) RETURNING id_bancal;
            ''',
            (new_bancal['nombre'], new_bancal['filas'], new_bancal['columnas'])
        )
        bancal_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        return {"id_bancal": bancal_id, "message": "Bancal creado exitosamente"}, 201

# Endpoints para Celdas
@ns_celdas.route('/')
class CeldaList(Resource):
    @ns_celdas.doc('list_celdas')
    def get(self):
        """Obtener todas las celdas"""
        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM celdas')
        celdas = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(celdas)

    @ns_celdas.doc('create_celda')
    @ns_celdas.expect(celda_model)
    def post(self):
        """Crear una nueva celda"""
        new_celda = request.json
        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO celdas (id_bancal, fila, columna, id_planta)
            VALUES (%s, %s, %s, %s) RETURNING id_celda;
            ''',
            (new_celda['id_bancal'], new_celda['fila'], new_celda['columna'], new_celda.get('id_planta'))
        )
        celda_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        return {"id_celda": celda_id, "message": "Celda creada exitosamente"}, 201

# Endpoints para Plantas en Bancales
@ns_plantas_en_bancales.route('/')
class PlantasEnBancalList(Resource):
    @ns_plantas_en_bancales.doc('list_plantas_en_bancales')
    def get(self):
        """Obtener todas las plantas en bancales"""
        conn = get_db_connection()
        if conn is None:
            return {"message": "Error de conexión a la base de datos"}, 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM plantas_en_bancales')
        plantas = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(plantas)

    @ns_plantas_en_bancales.doc('create_plantas_en_bancal')
    @ns_plantas_en_bancales.expect(plantas_en_bancales_model)
    def post(self):
        """Crear una nueva planta en bancal"""
        new_planta = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO plantas_en_bancales (id_celda, id_especie, semana_plantada, duracion_semanas, estado_semanal)
            VALUES (%s, %s, %s, %s, %s) RETURNING id_planta;
            ''',
            (new_planta['id_celda'], new_planta['id_especie'], new_planta['semana_plantada'], new_planta['duracion_semanas'], new_planta['estado_semanal'])
        )
        planta_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        return {"id_planta": planta_id, "message": "Planta en bancal creada exitosamente"}, 201

if __name__ == '__main__':
    app.run(debug=True)
