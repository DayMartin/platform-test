FROM python:3.10-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential

COPY . .

RUN pip install -r back/requirements.txt

ENTRYPOINT [ "python", "back/main.py" ]