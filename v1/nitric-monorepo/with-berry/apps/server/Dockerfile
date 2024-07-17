FROM node:alpine AS builder
ARG PACKAGE_SCOPE
ARG HANDLER

# Python and make are required by certain native package build processes in NPM packages.
RUN --mount=type=cache,sharing=locked,target=/etc/apk/cache \
    apk --update-cache add git g++ make py3-pip

# # Set working directory
WORKDIR /app

# node_modules is ignored in .dockerignore
COPY . .

RUN yarn workspaces focus ${PACKAGE_SCOPE} --production

# Create a variable for the app path
ARG APP_PATH=/app/apps/${PACKAGE_SCOPE}

# Build the app using ncc, and exclude the prisma client for prisma support https://github.com/prisma/prisma/issues/16901#issuecomment-1362940774
RUN yarn dlx -p @vercel/ncc -p typescript ncc build ${APP_PATH}/${HANDLER} -m --v8-cache -o ${APP_PATH}/lib/ -e .prisma/client -e @prisma/client -t

FROM node:alpine AS runner
ARG PACKAGE_SCOPE
WORKDIR /app

RUN apk update && \
    apk add --no-cache ca-certificates && \
    update-ca-certificates

COPY --from=builder /app/apps/${PACKAGE_SCOPE}/lib .

# prisma fix for docker installs: https://github.com/prisma/docs/issues/4365
RUN test -d ./prisma && yarn dlx -p prisma prisma generate || echo "";

ENTRYPOINT ["node", "index.js"]