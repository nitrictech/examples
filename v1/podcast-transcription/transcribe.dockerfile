# The python version must match the version in .python-version
FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim AS builder

ARG HANDLER
ENV HANDLER=${HANDLER}

ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy PYTHONPATH=.
WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/uv \
  --mount=type=bind,source=uv.lock,target=uv.lock \
  --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
  uv sync --frozen -v --no-install-project --extra ml --no-dev --no-python-downloads
COPY . /app
RUN --mount=type=cache,target=/root/.cache/uv \
  uv sync --frozen -v --no-dev --extra ml --no-python-downloads

FROM nvcr.io/nvidia/driver:550-5.15.0-1065-nvidia-ubuntu22.04

ARG HANDLER

ENV HANDLER=${HANDLER}
ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONPATH="."
ENV NVIDIA_DRIVER_CAPABILITIES=all
ENV NVIDIA_REQUIRE_CUDA="cuda>=8.0"

RUN apt-get update -y && \
  apt-get install -y software-properties-common ffmpeg && \
  add-apt-repository ppa:deadsnakes/ppa && \
  apt-get update -y && \
  apt-get install -y python3.11 && \
  ln -sf /usr/bin/python3.11 /usr/local/bin/python3.11

# Copy the application from the builder
COPY --from=builder --chown=app:app /app /app
WORKDIR /app

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Run the service using the path to the handler
ENTRYPOINT python -u $HANDLER