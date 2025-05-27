# Use Node.js 20 alpine for smaller image size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Move frontend build to correct location for production server
RUN mkdir -p dist/public && cp -r dist/* dist/public/ 2>/dev/null || true

# Keep all dependencies since server needs vite in production

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]