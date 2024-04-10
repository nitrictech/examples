FROM node:alpine as build

ARG HANDLER

# Python and make are required by certain native package build processes in NPM packages.
RUN apk add g++ make py3-pip
RUN yarn global add typescript @vercel/ncc

WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile --cache-folder /tmp/.cache && \
    rm -rf /tmp/.cache

COPY . .

RUN \
  --mount=type=cache,target=/tmp/ncc-cache \
  ncc build ${HANDLER} -o lib/ -t

FROM node:alpine as final

WORKDIR /usr/app

RUN apk update && \
    apk add --no-cache ca-certificates && \
    update-ca-certificates

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile --cache-folder /tmp/.cache && \
    rm -rf /tmp/.cache

COPY . .

COPY --from=build /usr/app/lib/ ./lib/

ENTRYPOINT ["node", "lib/index.js"]