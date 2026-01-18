# Solita Dev Academy Exercise 2026 - Electricity App

A full-stack application to visualize, analyze, and inspect hourly electricity data (Production, Consumption, and Prices) combined from Fingrid and porssisahko.net. Project instructions can be found [here.](./project/README.md)

## Features

### Dashboard (Daily List)

- Aggregated Statistics
- Server-Side Pagination & Sorting
- Data Quality Indicators: Automatically flags days with missing hours or null values.

### Detailed View (Single Day)

- Detailed key metrics about electricity data
- Graph Visualizations
- Hourly Breakdown

## Tech Stack

TypeScript for the whole stack, react with vite for frontend, node express for backend. Vanilla css for frontend styling. Backend unit tests with jest, frontend unit tests with vitest. Cypress for e2e tests.

## Setup & Installation

### Prerequisites

- **Docker**
- **Node.js** (Development only)
  - Node.js v20+ (this repository has been tested with Node 24).
  - If you use `nvm` (Node Version Manager), on project root run:
    ```bash
    nvm use
    ```
  - If the version is not installed, install it via:
    ```bash
    nvm install
    ```

### Run the Full stack application

1. On project root dir run:

```
$ docker compose up --build --renew-anon-volumes -d
```

2. Application is now accessible at http://localhost:8080/

### Development mode

1. Start the database by running on project root:

```bash
$ docker compose up --build --renew-anon-volumes -d
```

2. Start the backend (hot reload):

```bash
$ cd backend
$ npm install
$ npm run dev
```

3. Start the frontend by opening up new terminal and run (hot reload):

```bash
$ cd frontend
$ npm install
$ npm run dev
```

4. Frontend dev server is now accessible at http://localhost:5173/

## Linting

- **Backend:** from the `backend` folder run:

```bash
cd backend
npm install
npm run lint        # check
npm run lint:fix    # fix issues automatically
```

- **Frontend:** from the `frontend` folder run:

```bash
cd frontend
npm install
npm run lint        # check
npm run lint:fix    # fix issues automatically
```

## Testing

- **Backend unit tests:**

```bash
cd backend
npm install
npm run test
```

- **Frontend unit tests:**

```bash
cd frontend
npm install
npm run test
```

## End-to-End (E2E) tests

E2E tests use Cypress and are defined in the `cypress` folder at the project root. Run them against the running stack.

1. Start the full stack (services and apps):

```bash
docker compose up --build --renew-anon-volumes -d
```

2. From project root run Cypress (interactive):

```bash
npm install
npm run cy:open
```

Or run headless (CI / terminal):

```bash
npm install
npm run cy:run
```

## Continuous Integration (CI)

This repository includes a GitHub Actions workflow at `.github/workflows/ci.yaml` that runs checks on pushes and pull requests to `main` branch. The workflow:

- Runs unit tests and linter for both backend and frontend
- Runs e2e-tests

Main branch is protected and successful CI run is required to merge PR to main.

## Usage of AI tools

- **Code review / PR assistance:** Coderabbit AI was tested out for this project to catch bugs in PR reviews.
- **Design exploration & troubleshooting:** Gemini 3 Pro was used to brainstroming, exploring design ideas and debug strategies. However, the code was reviewed and refined manually.
