FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install ALL dependencies (including dev dependencies)
RUN yarn install

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production

# Copy built application from development stage
COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules

# Expose the port
EXPOSE 8080

# Start the application in production mode
CMD ["node", "dist/main"]
