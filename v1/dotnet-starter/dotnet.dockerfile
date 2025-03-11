ARG HANDLER

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set working directory
WORKDIR /app

# Copy the entire project directory
COPY . ./

# Restore dependencies
RUN dotnet restore

# Publish as a single file executable
RUN dotnet publish -c Release --self-contained -p:PublishSingleFile=true -p:EnableCompressionInSingleFile=true

# Use a runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

ARG HANDLER

# Extract project name from Handler in the form "./services/Hello/Hello.csproj"
ENV PROJECT_NAME=${HANDLER%/*}
ENV PROJECT_NAME=${PROJECT_NAME##*/}

# Set working directory
WORKDIR /app

# Copy the built executable from the builder stage
COPY --from=build /app/out/linux-x64/publish/ ./

RUN ls

# Set entrypoint
ENTRYPOINT "./${PROJECT_NAME}"