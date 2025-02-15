FROM node:20
WORKDIR /urs/src/app
COPY --chown=node:node . .
RUN npm ci
RUN npm run tsc
USER node
CMD ["npm", "run", "start"]
