from flask import Blueprint, jsonify, request, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from db.database import get_mysql_connection
import pytz
from itsdangerous import URLSafeTimedSerializer

user_controller = Blueprint('user_controller', __name__)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token ausente!'}), 401

        try:
            serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
            data = serializer.loads(token, max_age=1800)  # 1800 segundos = 30 minutos
            current_user = data['username']
        except:
            return jsonify({'message': 'Token inválido!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

# Rota para criar uma nova pessoa
@user_controller.route('/register', methods=['POST'])
def create_person():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Nome de usuário e senha são necessários!'}), 400

    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Verifica se o nome de usuário já existe
    cursor.execute("SELECT * FROM people WHERE username = %s", (username,))
    user = cursor.fetchone()

    if user:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Nome de usuário já existe!'}), 409

    # Cria o novo usuário
    hashed_password = generate_password_hash(password)
    cursor.execute("INSERT INTO people (username, password) VALUES (%s, %s)", (username, hashed_password))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({'message': 'Novo usuário criado!'}), 201

@user_controller.route('/consulta/user', methods=['GET'])
def consultar_users(current_user):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM people")
    users = cursor.fetchall()
    cursor.close()
    conn.close()

    if not users:
        return jsonify({'message': 'Usuários não encontrados!'}), 404
    return jsonify(users), 200

@user_controller.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Credenciais não fornecidas!'}), 401

    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM people WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not user:
        return jsonify({'message': 'Usuário não encontrado!'}), 401

    if not check_password_hash(user['password'], password):
        return jsonify({'message': 'Senha incorreta!'}), 401

    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    token = serializer.dumps({'username': username})

    return jsonify({'message': 'Login efetuado com sucesso!', 'token': token}), 200

