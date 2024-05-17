### Como usar este projeto

### Iniciar o Backend e o Banco de dados

1. No terminal digite no diretório principal:

```sh
docker-compose up
```

### Iniciar o Front:
1. No terminal entre no diretório ./frontend
2. No terminal  digite: yarn dev
3. Caso o yarn dev não funcione inicie o projeto com ''ng serve''

### O Projeto iniciará

- Container MySQL
- Container Backend
- Server Front ( sem container )

OBS: 

Existe um diretório no backend chamado 'Test' para utilizar os arquivos de teste instale
no vscode a extensão 'REST Cliente'

### A rota para inclusão de pontos atualiza os dados de positions.json

#### Se você já tiver o MYSQL instalado em seu computador, aconselho pausa-lo para não dar conflitos de porta com o container

```sh
sudo systemctl stop mysql
```

### Por fim, faça o cadastro do seu usário para poder se logar no sistema