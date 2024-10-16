FROM python:3.11-slim

ARG HANDLER

ENV HANDLER=${HANDLER}
ENV PYTHONUNBUFFERED=TRUE

RUN apt-get update -y && \
    apt-get install -y \
      python3 \
      ca-certificates \
      wget \
      xz-utils \
      sudo \
      build-essential \ 
      git \
      git-lfs \
      subversion \
      ninja-build \
      cmake \
      cmake-gui \
      cmake-curses-gui \
      libx11-dev \
      libxxf86vm-dev \
      libxcursor-dev \
      libxi-dev \
      libxrandr-dev \
      libxinerama-dev \
      libegl-dev \
      libgl-dev \
      libwayland-dev \
      wayland-protocols \
      libxkbcommon-dev \
      libdbus-1-dev \
      linux-libc-dev \
      libdecor-0-dev \
      libjpeg-dev \
      libpng-dev \
      zlib1g-dev \
      libzstd-dev \
      libepoxy-dev \
      libtiff-dev \
      libfreetype-dev \
      libopenimageio-dev \
      libpugixml-dev \
      libboost-all-dev \
      libopencolorio-dev \
      libembree-dev && \
      update-ca-certificates


RUN which cmake 

RUN wget https://download.blender.org/source/blender-4.2.2.tar.xz

RUN tar -xvf blender-4.2.2.tar.xz && rm blender-4.2.2.tar.xz

RUN cd ./blender-4.2.2 && make 

RUN pip install --upgrade pip pipenv

# Copy either requirements.txt or Pipfile
COPY requirements.tx[t] Pipfil[e] Pipfile.loc[k] ./

# Guarantee lock file if we have a Pipfile and no Pipfile.lock
RUN (stat Pipfile && pipenv lock) || echo "No Pipfile found"

# Output a requirements.txt file for final module install if there is a Pipfile.lock found
RUN (stat Pipfile.lock && pipenv requirements > requirements.txt) || echo "No Pipfile.lock found"

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENTRYPOINT python $HANDLER