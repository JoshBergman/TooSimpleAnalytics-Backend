FROM node:alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install

RUN npm run compile

EXPOSE 3000

CMD ["node", "dist/index.js"]