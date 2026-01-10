# STAGE 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions first (for better caching)
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# STAGE 2: Production Run
FROM node:20-alpine

WORKDIR /app

# Copy only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3000

# Start the server (Using the path from your ESM build)
CMD ["node", "dist/src/server.js"]