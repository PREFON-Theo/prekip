FROM node:18-alpine

WORKDIR /front

COPY package.json ./
COPY package-lock.json ./

COPY . ./

RUN npm install

CMD ["npm", "start"]