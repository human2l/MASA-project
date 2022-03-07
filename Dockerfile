FROM node:lts-alpine

WORKDIR /app
# use ./ to prevent docker treat /app as a file(if we use . only)
COPY package*.json ./

COPY client/package*.json client/
# Below will only run when package.json or client/package.json changed
RUN npm run install-client --only=production

COPY server/package*.json server/
RUN npm run install-server --only=production

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 8000