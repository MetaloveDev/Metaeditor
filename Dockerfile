FROM node:21-alpine

WORKDIR /app

RUN apk update && apk add bash

COPY ./package.json .

RUN npm install

COPY . .

ENTRYPOINT ["npm", "start"]