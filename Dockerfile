# Use a base image
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json .  # Correct COPY command

# Install dependencies
RUN npm install --production --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the application (if needed)
RUN npm run build

# Use a smaller final image
FROM node:18 AS runtime

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app .

# Expose the port
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]
