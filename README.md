# Dream In Actions

This repository contains the Express.js backend for the Dream In Actions project.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed
- Docker and Docker Compose installed

## Getting Started

Follow these instructions to set up and run the project locally.

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yaroslavnosenko/dreaminaction-map-api.git
   cd dreaminaction-map-api
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Project

#### Database

To run the database in a containerized environment, use Docker Compose:

1. Start the containers in detached mode:
   ```sh
   docker compose up -d
   ```

2. To start the project, use the following scripts:


- **Development**: Starts the development server with hot-reloading using Nodemon.

  ```sh
  npm run dev
  ```

- **Test**: Runs tests with Jest and generates a coverage report.
  ```sh
  npm test
  ```



## Scripts

- `build`: Compiles the TypeScript code to JavaScript.
- `start`: Runs the compiled JavaScript code using Node.js.
- `dev`: Starts the development server with Nodemon for hot-reloading.
- `test`: Runs tests with Jest and generates a coverage report.
