# Use an official Node.js runtime as the base image
FROM node

ENV DB_URL=""
ENV NITRIC_DB_NAME=""

# Copy package.json and package-lock.json into the Docker image
COPY package*.json ./

# Install the application's dependencies inside the Docker image
RUN npm ci

# Copy the rest of the application into the Docker image
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Run the migrations and start the application when the Docker container starts
ENTRYPOINT ["sh", "-c", "npx prisma migrate deploy"]