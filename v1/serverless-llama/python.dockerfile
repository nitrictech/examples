# The python version must match the version in .python-version
FROM ghcr.io/astral-sh/uv:python3.11-bookworm AS builder

ARG HANDLER
ENV HANDLER=${HANDLER}

ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy PYTHONPATH=.
WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/uv \
  --mount=type=bind,source=uv.lock,target=uv.lock \
  --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
  uv sync --frozen --no-install-project --no-dev --no-python-downloads
COPY . /app
RUN --mount=type=cache,target=/root/.cache/uv \
  uv sync --frozen --no-dev --no-python-downloads


# Then, use a final image without uv
FROM python:3.11-bookworm

ARG HANDLER
ENV HANDLER=${HANDLER} PYTHONPATH=.

# Copy the application from the builder
COPY --from=builder --chown=app:app /app /app
WORKDIR /app

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Run the service using the path to the handler
ENTRYPOINT python -u $HANDLER