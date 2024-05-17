FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm install @angular/cli -g
RUN yarn run rota
CMD ["npm", "start"]

