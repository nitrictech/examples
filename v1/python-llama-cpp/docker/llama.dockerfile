FROM python:3.11

ARG HANDLER

# Disable AVX512 for compatibility with older CPUs (e.g. Serverless environments)
# ENV CMAKE_ARGS="-DLLAMA_CUBLAS=1 -DLLAMA_AVX=OFF -DLLAMA_AVX2=OFF -DLLAMA_F16C=OFF -DLLAMA_FMA=OFF -DLLAMA_BUILD_SERVER=ON" 
# ENV CMAKE_ARGS="-DLLAMA_NATIVE=OFF -DLLAMA_AVX=ON -DLLAMA_AVX2=ON -DLLAMA_AVX512=OFF -DLLAMA_BUILD_SERVER=ON" 
# ENV CMAKE_ARGS="-DGGML_NATIVE=OFF -DLLAMA_BUILD_SERVER=ON -DBUILD_SHARED_LIBS=ON" 
# ENV FORCE_CMAKE=1
ENV HANDLER=${HANDLER}
ENV PYTHONUNBUFFERED=TRUE

RUN apt-get update -y && \
    apt-get install -y ca-certificates git && \
    update-ca-certificates

RUN pip install --upgrade pip pipenv

COPY . .

# Guarantee lock file if we have a Pipfile and no Pipfile.lock
RUN (stat Pipfile && pipenv lock) || echo "No Pipfile found"

# Output a requirements.txt file for final module install if there is a Pipfile.lock found
RUN (stat Pipfile.lock && pipenv requirements > requirements.txt) || echo "No Pipfile.lock found"

# RUN FORCE_CMAKE=1 CMAKE_ARGS="-DLLAMA_NATIVE=OFF -DLLAMA_AVX=OFF -DLLAMA_AVX2=OFF" pip install --no-cache-dir -r requirements.txt
RUN FORCE_CMAKE=1 CMAKE_ARGS="-DGGML_BLAS=ON -DGGML_BLAS_VENDOR=OpenBLAS" pip install --no-cache-dir -r requirements.txt

ENTRYPOINT python -u $HANDLER