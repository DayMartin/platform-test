import json
import requests
from flask import Blueprint, jsonify, request, Flask, render_template
from datetime import datetime, timezone
import folium
from geopy.distance import geodesic
import time


pontos_controller = Blueprint('pontos_controller', __name__)

def carregar_dados_locais():
    try:
        with open('back/positions.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {"data": []}

def salvar_dados_locais(dados):
    with open('back/positions.json', 'w') as file:
        json.dump(dados, file, indent=4)

def sincronizar_dados_github():
    dados_locais = carregar_dados_locais()

    try:
        response = requests.get('https://raw.githubusercontent.com/DayMartin/platform-test/master/positions.json')
        response.raise_for_status()

        dados_github = response.json()

        novos_dados = [d for d in dados_github['data'] if d not in dados_locais['data']]

        dados_locais['data'].extend(novos_dados)

        salvar_dados_locais(dados_locais)

        print('Dados sincronizados com sucesso.')
    except Exception as e:
        print(f'Erro ao sincronizar dados: {e}')

# Rota para criar novos pontos
@pontos_controller.route('/register/pontos', methods=['POST'])
def create_pontos():
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if latitude and longitude:
        current_time = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S+00:00')

        new_point = {
            "date_time": current_time,
            "latitude": latitude,
            "longitude": longitude
        }

        dados_locais = carregar_dados_locais()
        dados_locais['data'].append(new_point)
        salvar_dados_locais(dados_locais)

        return jsonify({'message': 'Novo ponto criado!'}), 201
    else:
        return jsonify({'error': 'latitude e longitude são necessários!'}), 400

# Rota para buscar todos os pontos
@pontos_controller.route('/get/pontos', methods=['GET'])
def get_pontos():
    try:
        dados_locais = carregar_dados_locais()
        return jsonify(dados_locais), 200
    except FileNotFoundError:
        return jsonify({'error': 'Arquivo de dados não encontrado'}), 404

# Rota para criar o mapa
@pontos_controller.route('/mapa', methods=['GET'])
def mapa():
    sincronizar_dados_github()
    dados_locais = carregar_dados_locais()

    m = folium.Map(location=[float(dados_locais['data'][0]['latitude']), float(dados_locais['data'][0]['longitude'])], zoom_start=12)

    total_distance = 0

    for i, point in enumerate(dados_locais['data']):
        folium.Marker(location=[float(point['latitude']), float(point['longitude'])]).add_to(m)
        if i > 0:
            prev_point = dados_locais['data'][i - 1]
            current_point = point
            distance = geodesic((prev_point['latitude'], prev_point['longitude']), (current_point['latitude'], current_point['longitude'])).kilometers
            total_distance += distance * 1000  # Convertendo para metros e somando

            # Adicionando um marcador com a distância acumulada até este ponto
            folium.Marker(location=[float(point['latitude']), float(point['longitude'])], 
                          icon=folium.DivIcon(html=f"<div style='font-size: 14px;'>{round(total_distance, 2)} metros</div>")).add_to(m)  # Defina o tamanho da fonte aqui

    polyline = [(float(point['latitude']), float(point['longitude'])) for point in dados_locais['data']]
    folium.PolyLine(polyline, color="blue", weight=2.5, opacity=1).add_to(m)

    m.save('back/templates/mapa.html')

    return render_template('mapa.html', total_distance=total_distance)


if __name__ == "__main__":
    contador = 0
    while True:
        contador += 1
        sincronizar_dados_github()
        print(f'Atualização {contador} concluída.')
        time.sleep(60)
