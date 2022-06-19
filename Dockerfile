FROM node:16.14-alpine3.14 as builder

EXPOSE 3000

RUN apk update && apk --no-cache --update add build-base
RUN apk add --no-cache tini curl

WORKDIR /sinai

COPY package*.json ./
COPY *.json ./
COPY src ./src

RUN mkdir sinai && chown -R node:node .
USER node

RUN npm install
RUN npm run build

ENTRYPOINT ["/sbin/tini", "--"]

# DEVELOPMENT STAGE
FROM builder as development
ENV NODE_ENV=development

CMD ["npm", "run", "start:dev"]

# PRODUCTION STAGE
FROM builder as production

ENV NODE_ENV=production

COPY --chown=node ./scripts/env.sh ./env.sh
RUN ["chmod", "+x", "/sanar/env.sh"]

RUN npm prune --production

CMD ["/bin/sh", "-c", "source /sanar/env.sh && npm run start:prod"]

