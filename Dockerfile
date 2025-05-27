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

# Create proper directory structure for production
RUN mkdir -p dist/public && \
    find dist -maxdepth 1 -type f \( -name "*.html" -o -name "*.css" -o -name "*.ico" -o -name "*.png" -o -name "*.svg" \) -exec mv {} dist/public/ \; && \
    find dist -maxdepth 1 -name "*.js" ! -name "index.js" -exec mv {} dist/public/ \; && \
    find dist -maxdepth 1 -type d -name "assets" -exec mv {} dist/public/ \;

# Keep all dependencies since server needs vite in production

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]