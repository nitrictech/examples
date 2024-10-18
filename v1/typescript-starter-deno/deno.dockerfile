FROM denoland/deno:2.0.1

ARG HANDLER
ENV HANDLER=${HANDLER}

WORKDIR /app

COPY . .

RUN deno install --entrypoint ${HANDLER} --allow-all

RUN deno cache ${HANDLER}

ENTRYPOINT deno run --allow-all ${HANDLER}
