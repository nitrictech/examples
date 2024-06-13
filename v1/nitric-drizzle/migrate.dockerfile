# Use an official Node.js runtime as the base image
FROM node

ENV DB_URL=""
ENV NITRIC_DB_NAME=""

# Copy package.json and package-lock.json into the Docker image
COPY package*.json ./

# Install the application's dependencies inside the Docker image
RUN npm install

# Copy the rest of the application into the Docker image
COPY . .

# Build the Prisma client
RUN npx drizzle-kit generate

# Run the migrations and start the application when the Docker container starts
# We define the entrypoint like this so we can correctly copy it out when running it
# in the various clouds (e.g. AWS Codebuild does not respect ENTRYPOINT and CMD)
ENTRYPOINT ["sh", "-c", "npx drizzle-kit migrate"]