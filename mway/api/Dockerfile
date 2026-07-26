FROM node:18.12-alpine

WORKDIR /usr/src/app

ADD src /usr/src/app/src
ADD resources /usr/src/app/resources
ADD package.json package.json
ADD yarn.lock yarn.lock
ADD tsconfig.json tsconfig.json
ADD codegen.yml codegen.yml

RUN yarn
RUN yarn types
RUN yarn build

EXPOSE 8080
ENTRYPOINT ["yarn", "start"]