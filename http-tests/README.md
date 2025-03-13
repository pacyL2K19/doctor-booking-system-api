# HTTP Test Files

This directory contains HTTP test files that can be used to test the API endpoints. These files are designed to be used with REST client extensions in IDEs like VS Code or JetBrains IDEs.

## Available Tests

- `test-health.http`: Tests the health check endpoint
- `test-bookings-pagination.http`: Tests the bookings pagination endpoints
- `test-available-slots-pagination.http`: Tests the available slots pagination endpoints

## How to Use

1. Install a REST client extension for your IDE (e.g., REST Client for VS Code)
2. Open one of the HTTP files
3. Click on the "Send Request" button above each request

## Variables

Some of the test files use variables (e.g., `{{doctorId}}`). You'll need to replace these with actual values or set up an environment file for your REST client extension.
