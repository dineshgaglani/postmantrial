FROM postman/newman:alpine

RUN npm install -g newman
RUN npm install -g newman-reporter-html

ENV NODE_PATH=/usr/local/lib/node_modules

COPY ./executor.js .

ENTRYPOINT ["node", "./executor.js"]
