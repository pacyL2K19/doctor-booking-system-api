#!/bin/bash

# Stop and remove existing containers
echo "Stopping and removing existing containers..."
docker-compose down

# Remove existing images
echo "Removing existing images..."
docker-compose rm -f

# Rebuild the images
echo "Rebuilding the images..."
docker-compose build --no-cache

echo "Rebuild complete. You can now start the application with:"
echo "  - Development mode: make dev or yarn docker:dev"
echo "  - Production mode: make prod or yarn docker:prod" 