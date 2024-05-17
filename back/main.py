from flask import Flask, make_response
from flask_cors import CORS
from controllers.userController import user_controller
from controllers.pontosController import pontos_controller
from db.database import get_mysql_connection


app = Flask(__name__)

CORS(app)

conn = get_mysql_connection()

app.register_blueprint(user_controller)
app.register_blueprint(pontos_controller)
app.config['SECRET_KEY'] = 'DUJ2OJDLKHGF'

@app.route('/')
def root():
    return make_response('Servidor Conectado', 200)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
