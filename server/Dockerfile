FROM node:18-alpine

WORKDIR /api

COPY package.json ./
COPY package-lock.json ./

COPY . ./

RUN npm install

EXPOSE 4000

CMD ["npm", "start"]