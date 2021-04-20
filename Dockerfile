FROM node:14.16.0@sha256:f6b9ff4caca9d4f0a331a882e560df242eb332b7bbbed2f426784de208fcd7bd AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY src ./src
COPY tsconfig.json tsconfig.build.json ./
RUN yarn build

FROM node:14.16.0-slim@sha256:e8a3dbe7f6d334acfe0365260626d3953073334de4c0fde00f93e8e9e19ed5d5

ENV PORT 4000

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY --from=build /app/dist ./dist

EXPOSE $PORT

CMD ["node", "dist/main.js"]
