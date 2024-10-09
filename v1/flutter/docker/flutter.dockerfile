FROM dart:stable AS build

# The Nitric CLI will provide the HANDLER arg with the location of our service
ARG HANDLER
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

# download Flutter SDK from Flutter Github repo
RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter

ENV DEBIAN_FRONTEND=dialog

# Set flutter environment path
ENV PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Run flutter doctor
RUN flutter doctor

# Resolve app dependencies.
COPY pubspec.* ./
RUN flutter pub get

# Ensure the ./bin folder exists
RUN mkdir -p ./bin

# Copy app source code and AOT compile it.
COPY . .
# Ensure packages are still up-to-date if anything has changed
RUN flutter pub get --offline
# Compile the dart service into an exe
RUN dart compile exe ./${HANDLER} -o bin/main

# Start from scratch and copy in the necessary runtime files
FROM alpine

COPY --from=build /runtime/ /
COPY --from=build /app/bin/main /app/bin/

ENTRYPOINT ["/app/bin/main"]