FROM node:14
LABEL seongwon="seongwon@edu.hanbat.ac.kr"

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install
RUN npm install -g serve

COPY . .

RUN npm run build

EXPOSE 5000

ENTRYPOINT [ "serve", "-s", "build" ]