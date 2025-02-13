FROM node:20
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm ci --include-dev
RUN npm run tsc
USER node
CMD ["npm", "run", "start"]


