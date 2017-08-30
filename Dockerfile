FROM node:8.4.0

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000 56745

WORKDIR /app

CMD yarn run $NODE_CMD

COPY package.json yarn.lock /app/
RUN yarn

COPY . /app

RUN npm rebuild erlpack > /dev/null
