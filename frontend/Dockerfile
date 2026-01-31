# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built app from build stage
COPY --from=build /app/build ./build

# Copy necessary files for serving
COPY public ./public
COPY src/setupProxy.js ./src/setupProxy.js

# Install serve for production
RUN npm install -g serve

# Expose port
EXPOSE 3000

# For development, use npm start
# For production, use serve
CMD ["npm", "start"]
