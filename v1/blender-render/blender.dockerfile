FROM ghcr.io/astral-sh/uv:python3.11-bookworm AS builder

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

FROM nvidia/cuda:12.6.2-cudnn-runtime-ubuntu24.04

ARG HANDLER

ENV HANDLER=${HANDLER}
ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONPATH="."
ENV NVIDIA_DRIVER_CAPABILITIES=all
ENV NVIDIA_REQUIRE_CUDA="cuda>=8.0"

RUN --mount=type=cache,target=/var/cache/apt/archives \
  apt-get update && apt-get install -y \
  software-properties-common \
  build-essential \
  libxi6 \
  libglu1-mesa \
  libgl1 \
  libglx-mesa0  \
  libxxf86vm1 \
  libxkbcommon0 \
  libsm6 \
  libxext6 \
  libxrender1 \
  libxrandr2 \
  libx11-6 \
  xorg \
  libxkbcommon0 \
  ffmpeg \
  wget \
  curl \
  ca-certificates && \
  add-apt-repository ppa:deadsnakes/ppa && \
  apt-get install -y python3.11 && \
  ln -sf /usr/bin/python3.11 /usr/local/bin/python3.11 && \
  rm -rf /var/lib/apt/lists/*

# Blender variables used for specifying the blender version
ARG BLENDER_OS="linux-x64"
ARG BL_VERSION_SHORT="4.2"
ARG BL_VERSION_FULL="4.2.2"
ARG BL_DL_ROOT_URL="https://mirrors.ocf.berkeley.edu/blender/release"
ARG BLENDER_DL_URL=${BL_DL_ROOT_URL}/Blender${BL_VERSION_SHORT}/blender-${BL_VERSION_FULL}-${BLENDER_OS}.tar.xz

# Download and unpack Blender
ADD $BLENDER_DL_URL blender

# Copy the application from the builder
COPY --from=builder /app /app
WORKDIR /app

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Run the service using the path to the handler
ENTRYPOINT python -u $HANDLER