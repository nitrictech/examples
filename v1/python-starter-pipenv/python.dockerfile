FROM python:3.11-slim

# Setup the var pointing to the current nitric service being built
ARG HANDLER
ENV HANDLER=${HANDLER}

ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONPATH="."

RUN apt-get update -y && \
  apt-get install -y ca-certificates git && \
  update-ca-certificates

RUN pip install --no-cache-dir --upgrade pip pipenv

COPY . .

# Guarantee lock file if we have a Pipfile and no Pipfile.lock
RUN (stat Pipfile && pipenv lock) || echo "No Pipfile found"

# Output a requirements.txt file for final module install if there is a Pipfile.lock found
RUN (stat Pipfile.lock && pipenv requirements > requirements.txt) || echo "No Pipfile.lock found"

RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT python -u $HANDLER
