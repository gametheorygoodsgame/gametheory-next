FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./

ARG GITHUB_TOKEN
RUN echo "registry=https://registry.npmjs.org\n\
@gametheorygoodsgame:registry=https://npm.pkg.github.com\n\
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc

RUN npm install

RUN npm list next

COPY . .

RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app ./

RUN npm prune --production

EXPOSE 3000

CMD ["npm", "run", "start"]
