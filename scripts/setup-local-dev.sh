#!/bin/bash

# Setup script for local development

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Creating .env file from .env.example..."
  cp .env.example .env
  # Update DATABASE_HOST for local development
  sed -i '' 's/DATABASE_HOST=db/DATABASE_HOST=localhost/g' .env
  echo ".env file created and configured for local development."
else
  echo ".env file already exists. Skipping creation."
fi

# Install dependencies
echo "Installing dependencies..."
yarn install

echo "Setup complete! You can now start the application with:"
echo "  yarn start:dev    # Development mode"
echo "  yarn start:prod   # Production mode"
echo ""
echo "Make sure you have a PostgreSQL database running locally with the credentials specified in your .env file." 