FROM node:14.16.1@sha256:e77e35d3b873500c10ce8969fe2ce5e0901516f77c8365d029c4b42b22ee4bac AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY src ./src
COPY tsconfig.json tsconfig.build.json ./
RUN yarn build

FROM node:14.16.1-slim@sha256:027ca5b035e85229e96ebd4e60c26386126e6a208f238561759b3d68ac50cae9

ENV PORT 4000

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY --from=build /app/dist ./dist

EXPOSE $PORT

CMD ["node", "dist/main.js"]
