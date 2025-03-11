# Doctor Booking System API

A NestJS-based API for managing doctor appointment slots and bookings.

## Description

This API allows doctors to create appointment slots with various recurrence options, and patients to book available slots.

## Features

- Doctor management
- Slot creation with recurrence options
- Appointment booking
- Viewing available slots and booked appointments

## Technologies Used

- NestJS
- TypeORM
- PostgreSQL
- Docker

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Yarn or npm (for local development)

### Running with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd doctor-booking-system-api
   ```

2. Start the application with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. The API will be available at http://localhost:3000

### Running Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd doctor-booking-system-api
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file with the following content:
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=doctor_booking
   PORT=3000
   ```

4. Start the application:
   ```bash
   yarn start:dev
   ```

5. The API will be available at http://localhost:3000

## API Documentation

### Health Check

- **GET /health**
  - Returns the health status of the API

### Doctor Endpoints

- **POST /doctors**
  - Create a new doctor
- **GET /doctors/{doctorId}/slots**
  - Get all slots for a doctor
- **POST /doctors/{doctorId}/slots**
  - Create slots for a doctor
- **GET /doctors/{doctorId}/bookings**
  - Get all bookings for a doctor
- **GET /doctors/{doctorId}/available_slots**
  - Get all available slots for a doctor

### Slot Endpoints

- **POST /slots/{slotId}/book**
  - Book a slot

## License

This project is licensed under the MIT License.
