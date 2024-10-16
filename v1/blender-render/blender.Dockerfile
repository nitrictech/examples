FROM python:3.11

RUN \
    apt-get update \
    && apt-get install -y --no-install-recommends \
    # Blender dependencies
    libxi6 \
    libxrender1 \
    libglu1-mesa \
    libgl1-mesa-glx \
    libxxf86vm1 \
    libxkbcommon0 \
    libsm6 \
    libxext6 \
    ffmpeg \
    # other dependencies
    ca-certificates \
    git \
    gnupg2 \
    # some useful utils
    xz-utils \
    screen \
    unzip \
    7zip \
    curl \
    vim \
    jq && \
    update-ca-certificates

# cleanup
RUN \
    apt-get autoremove -y && \
    apt-get autoclean -y && \
    apt-get clean -y && \
    apt-get purge -y && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Blender variables used for specifying the blender version

ARG BLENDER_OS="linux-x64"
ARG BL_VERSION_SHORT="4.2"
ARG BL_VERSION_FULL="4.2.2"
ARG BL_DL_ROOT_URL="https://mirrors.ocf.berkeley.edu/blender/release"
ARG BLENDER_DL_URL=${BL_DL_ROOT_URL}/Blender${BL_VERSION_SHORT}/blender-${BL_VERSION_FULL}-${BLENDER_OS}.tar.xz

RUN echo "Blender Download URL is $BLENDER_DL_URL"
RUN echo ${BLENDER_DL_URL}

# Set the working directory where we'll unpack blender
WORKDIR /usr/local/blender

# Download and unpack Blender
RUN curl -SL $BLENDER_DL_URL -o blender.tar.xz \
        && tar -xf blender.tar.xz --strip-components=1 && rm blender.tar.xz;

ARG HANDLER

ENV HANDLER=${HANDLER}
ENV PYTHONUNBUFFERED=TRUE

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