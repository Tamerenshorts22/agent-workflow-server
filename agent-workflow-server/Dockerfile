# Use official Node.js image
FROM node:22-slim

# Create working directory inside the container
WORKDIR /app

# Copy dependency definitions
COPY package.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy TypeScript source
COPY src ./src

# Build TypeScript -> JavaScript
RUN npm run build

# Expose port 3000 (for documentation; Docker still needs -p)
EXPOSE 3000

# Run the compiled server
CMD ["npm", "start"]
