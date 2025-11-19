FROM node:16.3.0-alpine AS development

WORKDIR /usr/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:16.3.0-alpine as production

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/app/dist ./dist

CMD ["node", "dist/main"]