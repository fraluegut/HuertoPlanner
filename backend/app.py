# app.py
from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from routes.especies import ns as especies_ns
from routes.produccion import ns as produccion_ns
from routes.plantas_por_celda import ns as plantas_por_celda_ns
from routes.bancales import ns as bancales_ns
from routes.celdas import ns as celdas_ns
from routes.plantas_en_bancales import ns as plantas_en_bancales_ns
from routes.celdas_temporales import ns as celdas_temporales_ns
from routes.plantas_fases import ns as plantas_fases_ns  # Importa el nuevo archivo

app = Flask(__name__)
CORS(app)
api = Api(app, version='1.0', title='HuertoPlan API', description='API para gestionar los datos de producción y especies de un huerto.')

# Registrar los Namespaces
api.add_namespace(especies_ns, path='/especies')
api.add_namespace(produccion_ns, path='/produccion')
api.add_namespace(plantas_por_celda_ns, path='/plantas_por_celda')
api.add_namespace(bancales_ns, path='/bancales')
api.add_namespace(celdas_ns, path='/celdas')
api.add_namespace(plantas_en_bancales_ns, path='/plantas_en_bancales')
api.add_namespace(celdas_temporales_ns, path='/celdas_temporales')
api.add_namespace(plantas_fases_ns, path='/plantas_fases')  # Añade el nuevo namespace

if __name__ == '__main__':
    app.run(debug=True)
