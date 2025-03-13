# Doctor Booking System API

A RESTful API for a doctor appointment booking system built with NestJS, TypeORM, and PostgreSQL.

## Features

- Doctor management
- Appointment slot creation and management
- Booking system
- Pagination support for all list endpoints
- Swagger API documentation
- Health check endpoint

## Prerequisites

- Docker and Docker Compose (for containerized deployment)
- Node.js 20+ and yarn (for local development)
- Make (optional, for using Makefile commands)

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd doctor-booking-system-api
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

### Using Make (Recommended)

The project includes a Makefile for common operations:

```bash
# Show available commands
make help

# Docker-based commands
make dev         # Start in development mode with Docker
make prod        # Start in production mode with Docker
make rebuild     # Rebuild Docker containers

# yarn-based commands (for local development)
make setup       # Set up local development environment
make yarn-dev    # Start in development mode with yarn
make yarn-prod   # Start in production mode with yarn
make yarn-rebuild # Rebuild the application with yarn
```

### Using `yarn` Scripts

The project includes yarn scripts for both Docker and local development:

```bash
# Docker-based commands
yarn docker:dev     # Start in development mode with Docker
yarn docker:prod    # Start in production mode with Docker
yarn docker:rebuild # Rebuild Docker containers

# Local development commands
yarn setup          # Set up local development environment
yarn start:dev      # Start in development mode
yarn start:prod     # Start in production mode
yarn build          # Build the application
```

### Development Environment

To start the application in development mode:

```bash
# Using docker-compose directly
docker-compose up app-dev

# Or using the provided script
./scripts/start-development.sh

# Or using Make
make dev

# Or using yarn
yarn docker:dev
```

This will:

- Start a PostgreSQL database
- Start the NestJS application in development mode with hot-reloading
- Mount your local codebase into the container

### Production Environment

To start the application in production mode:

```bash
# Using docker-compose directly
docker-compose up app

# Or using the provided script
./scripts/start-production.sh

# Or using Make
make prod

# Or using yarn
yarn docker:prod
```

This will:

- Start a PostgreSQL database
- Start the NestJS application in production mode
- Use the optimized Docker multi-stage build

### Rebuilding the Application

If you need to rebuild the Docker images:

```bash
# Using the provided script
./scripts/rebuild.sh

# Or using Make
make rebuild

# Or using yarn
yarn docker:rebuild
```

### Local Development (Without Docker)

For local development without Docker, you'll need to:

1. Set up the local development environment:

   ```bash
   # Using the setup script
   yarn setup
   # or
   make setup
   ```

   This will:

   - Create a `.env` file from `.env.example` if it doesn't exist
   - Configure the `.env` file for local development
   - Install dependencies

2. Make sure you have a PostgreSQL database running locally with the credentials specified in your `.env` file.

3. Start the application:

   ```bash
   # Development mode
   yarn start:dev
   # or
   make yarn-dev

   # Production mode
   yarn start:prod
   # or
   make yarn-prod
   ```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```txt
http://localhost:3000/api
```

### Response Format

All API responses follow a standardized format:

#### Successful Responses

```json
{
  "success": true,
  "code": 200,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

#### Paginated Responses

```json
{
  "success": true,
  "code": 200,
  "message": "Success message",
  "data": {
    "items": [
      // Array of items
    ],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

#### Error Responses

```json
{
  "success": false,
  "code": 400,
  "message": "Error message",
  "error": {
    "details": "Detailed error information"
  }
}
```

For more detailed information about the API responses, please refer to the Swagger documentation.

### Key Endpoints

#### Doctors

- `GET /doctors` - Get all doctors (paginated)
- `GET /doctors/:id` - Get a specific doctor by ID
- `POST /doctors` - Create a new doctor
- `GET /doctors/:doctorId/slots` - Get all slots for a doctor (paginated)
- `POST /doctors/:doctorId/slots` - Create slots for a doctor
- `GET /doctors/:doctorId/available_slots` - Get available slots for a doctor (paginated)
- `GET /doctors/:doctorId/bookings` - Get all bookings for a doctor (paginated)

#### Slots

- `GET /slots` - Get all slots (paginated)
- `POST /slots/:slotId/book` - Book a slot

#### Bookings

- `GET /bookings` - Get all bookings (paginated)
- `GET /bookings/:id` - Get a specific booking by ID

#### Health Check

- `GET /health` - Check the health of the API

### Health Check

The API includes a health check endpoint that can be used to verify the application is running:

```txt
GET http://localhost:3000/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2023-03-13T12:34:56.789Z"
}
```

## Environment Variables

The following environment variables can be configured:

- `DATABASE_HOST`: PostgreSQL host (default: `db`)
- `DATABASE_PORT`: PostgreSQL port (default: `5432`)
- `DATABASE_USER`: PostgreSQL username (default: `postgres`)
- `DATABASE_PASSWORD`: PostgreSQL password (default: `postgres`)
- `DATABASE_NAME`: PostgreSQL database name (default: `doctor_booking`)
- `PORT`: Application port (default: `3000`)

## Project Structure

```txt
src/
├── common/            # Shared code (DTOs, entities, utilities)
├── modules/           # Feature modules
│   ├── doctors/       # Doctor management
│   ├── slots/         # Slot management
│   └── bookings/      # Booking management
└── main.ts            # Application entry point

scripts/               # Helper scripts
├── rebuild.sh         # Script to rebuild Docker containers
├── setup-local-dev.sh # Script to set up local development
├── start-development.sh # Script to start in development mode
└── start-production.sh # Script to start in production mode
```

## Troubleshooting

### Crypto Module Issues

If you encounter errors related to the `crypto` module, such as:

```txt
ReferenceError: crypto is not defined
```

This is addressed in the codebase by:

1. Using Node.js 20+ in the Docker containers
2. Adding a polyfill for the crypto module
3. Using the uuid package for generating UUIDs

## License

This project is licensed under the MIT License.
