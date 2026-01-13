# ⚡️ Solita Dev Academy Exercise 2026 - Electricity App

A full-stack application to visualize, analyze, and inspect hourly electricity data (Production, Consumption, and Prices) combined from Fingrid and porssisahko.net. Project instructions can be found [here.](./project/README.md)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v20%2B-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🚀 Features

### Dashboard (Daily List)

- **Server-Side Pagination & Sorting:** Efficiently handles large datasets.
- **Aggregated Statistics:** Daily sums for consumption/production and average prices.
- **Data Quality Indicators:** Automatically flags days with missing hours or null values.

### Detailed View (Single Day)

- **Key Insights:**
  - Hourly Breakdown.
  - Hour with the biggest gap between Consumption and Production.
  - Top 3 cheapest hours of the day.
- **Graph Visualizations:** Visualize the 24-hour cycle of energy usage (WIP).

## 🛠 Tech Stack

### Backend

- **Runtime:** Node.js (Express)
- **Language:** TypeScript
- **Database:** PostgreSQL (with `pg` driver)
- **Testing:** Jest (Unit & Integration tests)
- **Architecture:** Controller-Service-Repository pattern.

### Frontend

- **Language** TypeScript
- **Framework:** React (Vite)
- **Styling:** CSS Modules / Vanilla CSS

## ⚙️ Setup & Installation

### Prerequisites

- **Docker**
- **Node.js** (Development only)
  - This project uses a version 24 of Node.js.
    - If you use `nvm` (Node Version Manager), run:
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

3. Application is now accessible at http://localhost:8080/

## Development mode

1. Start the database by running on root dir:

```
$ docker compose up --build --renew-anon-volumes -d
```

2. Start the backend (hot reload):

```
$ cd backend
$ npm install
$ npm run dev
```

3. Start the frontend by opening up new terminal and run (hot reload):

```
$ cd frontend
$ npm install
$ npm run dev
```

4. Application is now accessible at http://localhost:5173/

### Linting

TBD

### Testing

TBD
