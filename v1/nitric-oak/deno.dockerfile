FROM denoland/deno:2.0.2 AS build

ARG HANDLER

WORKDIR /app

# Set Deno install location to a directory we can cache
ENV DENO_INSTALL_ROOT="/app/.deno"
ENV PATH="$DENO_INSTALL_ROOT/bin:$PATH"

RUN --mount=type=cache,target=/app/.deno \
  --mount=type=bind,source=deno.lock,target=deno.lock \
  --mount=type=bind,source=deno.json,target=deno.json \
  deno install --allow-scripts

COPY . .

# Consider reducing permissions
RUN deno compile -o /bin/main --allow-all ${HANDLER}

FROM debian:bookworm-slim

COPY --from=build /bin/main /bin/main

RUN chmod +xr-w /bin/main

RUN apt update && \
  apt install -y tzdata ca-certificates && \
  rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/bin/main"]