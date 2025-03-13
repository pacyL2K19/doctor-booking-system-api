.PHONY: dev prod rebuild help yarn-dev yarn-prod yarn-rebuild setup http-tests

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev         - Start the application in development mode with Docker"
	@echo "  make prod        - Start the application in production mode with Docker"
	@echo "  make rebuild     - Rebuild the Docker containers"
	@echo "  make yarn-dev    - Start the application in development mode with yarn"
	@echo "  make yarn-prod   - Start the application in production mode with yarn"
	@echo "  make yarn-rebuild - Rebuild the application with yarn"
	@echo "  make setup       - Set up local development environment"
	@echo "  make http-tests  - List available HTTP tests"
	@echo "  make help        - Show this help message"

# Start in development mode with Docker
dev:
	@echo "Starting in development mode with Docker..."
	@docker-compose up app-dev

# Start in production mode with Docker
prod:
	@echo "Starting in production mode with Docker..."
	@docker-compose up app

# Rebuild the Docker containers
rebuild:
	@echo "Rebuilding Docker containers..."
	@bash scripts/rebuild.sh

# Start in development mode with yarn
yarn-dev:
	@echo "Starting in development mode with yarn..."
	@yarn start:dev

# Start in production mode with yarn
yarn-prod:
	@echo "Starting in production mode with yarn..."
	@yarn start:prod

# Rebuild the application with yarn
yarn-rebuild:
	@echo "Rebuilding the application with yarn..."
	@yarn build

# Set up local development environment
setup:
	@echo "Setting up local development environment..."
	@bash scripts/setup-local-dev.sh

# List available HTTP tests
http-tests:
	@echo "Available HTTP tests:"
	@echo "  - http-tests/test-health.http"
	@echo "  - http-tests/test-bookings-pagination.http"
	@echo "  - http-tests/test-available-slots-pagination.http"
	@echo ""
	@echo "To run these tests, use a REST client extension in your IDE." 