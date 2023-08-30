FROM node:16

WORKDIR /usr/src/backend

COPY --chown=node:node . .
RUN npm install

USER node
CMD npm run dev