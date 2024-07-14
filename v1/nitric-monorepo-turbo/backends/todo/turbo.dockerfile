FROM node:alpine AS builder
ARG TURBO_SCOPE

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo

# copy from root of the mono-repo
COPY . .
RUN turbo prune --scope=${TURBO_SCOPE} --docker

# # Add lockfile and package.json's of isolated subworkspace
FROM node:alpine AS installer
ARG TURBO_SCOPE
ARG HANDLER
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN yarn global add typescript @vercel/ncc turbo

# # First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install --frozen-lockfile --production

# # Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN turbo run build --filter=${TURBO_SCOPE} -- ./${HANDLER}  -m --v8-cache -o lib/

FROM node:alpine AS runner
ARG TURBO_SCOPE
LABEL io.nitric.name=turbo-example
WORKDIR /app

COPY --from=installer /app/backends/${TURBO_SCOPE}/lib .

ENTRYPOINT ["node", "index.js"]