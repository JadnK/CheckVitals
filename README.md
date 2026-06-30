# CheckVitals

CheckVitals is a full-stack uptime monitoring dashboard built with **Spring Boot**, **React**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL**.

It allows you to add websites or APIs and automatically checks their availability in regular intervals (currently not changeable). The dashboard shows whether each service is online or offline, including response times and the last check time.

## Features

* Add websites and APIs to monitor
* Automatically check all monitors every 5 minutes
* Display current status: `ONLINE`, `OFFLINE`, `LAGGING` or `UNKNOWN`
* Show latest response time
* Show last checked timestamp
* Delete monitors
* Store check history in the database
* Docker Compose setup for backend, frontend, and database

## Tech Stack

### Backend

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* PostgreSQL
* H2 Database for local development

### Frontend

* React
* TypeScript
* Tailwind CSS
* Vite

### DevOps

* Docker
* Docker Compose
* Nginx

## Project Structure

```text
CheckVitals/
├─ backend/
│  ├─ src/
│  ├─ Dockerfile
│  └─ pom.xml
│
├─ frontend/
│  ├─ src/
│  ├─ Dockerfile
│  ├─ nginx.conf
│  └─ package.json
│
├─ docker-compose.yml
└─ README.md
```

## Getting Started

### Requirements

Make sure you have installed:

* Java 21 or newer
* Node.js 22 or newer
* Docker
* Docker Compose

## Run with Docker Compose

The easiest way to start the full project is with Docker Compose.

From the root directory, run:

```bash
docker compose up --build
```

This starts:

* PostgreSQL database
* Spring Boot backend
* React frontend served through Nginx

After startup, open:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8080
```

To stop the containers:

```bash
docker compose down
```

To stop everything and delete the database volume:

```bash
docker compose down -v
```

## Run Backend Locally

Go into the backend folder:

```bash
cd backend
```

Start the backend:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

## Run Frontend Locally

Go into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## API Endpoints

### Health Check

```http
GET /api/health
```

### Monitors

```http
GET /api/monitors
POST /api/monitors
GET /api/monitors/{id}
DELETE /api/monitors/{id}
```

### Check Results

```http
GET /api/monitors/{id}/checks
```

## Example Monitor

```json
{
  "name": "Portfolio",
  "url": "https://example.com"
}
```

## Status Values

```text
UNKNOWN
LAGGING
ONLINE
OFFLINE
```

## Roadmap

Planned improvements:

* Monitor detail page
* Check history view
* Response time charts
* Uptime percentage calculation
* Better error messages
* Authentication
* Email or Discord notifications
* Public status page

## Screenshots

Screenshots will be added soon.

## Author

Built by [Jaden K.](https://jadenk.de/)
