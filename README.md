# Vehicle Tracking System – Backend

## Overview

This project is the backend service for a **Vehicle Tracking System** that processes GPS trip data uploaded as CSV files and generates trip analytics.

The system calculates important trip metrics such as:

* Total distance travelled
* Trip duration
* Vehicle speed
* Idling time
* Stoppage time
* Overspeed events

The processed data is stored in MongoDB and exposed through REST APIs which can be visualized on a map in the frontend.

---

# Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* InversifyJS (Dependency Injection)
* Repository Pattern Architecture

---

# Architecture

The backend follows a **clean architecture structure**.

```
src
│
├ base
│   ├ BaseRepository.ts
│   └ BaseController.ts
│
├ constants
│   ├ status-codes.ts
│   ├ success-messages.ts
│   ├ error-messages.ts
│   └ route-paths.ts
│
├ controllers
├ services
├ repositories
├ models
├ interfaces
├ dtos
├ middleware
├ routes
├ utils
└ config
```

### Key Architectural Patterns

* Repository Pattern
* DTO Layer
* Dependency Injection using Inversify
* Centralized Error Handling
* Strict TypeScript Typing

---

# Features

### Authentication

* User registration
* User login using JWT authentication

### Trip Upload

Users can upload CSV files containing GPS trip data.

CSV format includes:

```
latitude
longitude
timestamp
ignition
```

---

### Trip Processing

The system processes GPS points to calculate:

* Distance travelled
* Speed between points
* Idling duration
* Stoppage duration
* Overspeed detection (> 60 km/h)

---

### Trip Analytics API

The backend provides APIs for:

* Uploading trips
* Listing user trips
* Fetching trip details
* Returning map-ready trip data

---

# Installation

Clone the repository:

```
git clone <repository-url>
cd vehicle-tracking-system/backend
```

Install dependencies:

```
npm install
```

---

# Environment Variables

Create a `.env` file in the backend root.

Example:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/vehicle_tracking
JWT_SECRET=your_secret_key
```

---

# Running the Application

Run the development server:

```
npm run dev
```

The server will start with **nodemon** and automatically restart on file changes.

---

# Build Project

To compile TypeScript to JavaScript:

```
npm run build
```

Compiled files will be generated inside the `dist` folder.

---

# Start Production Server

```
npm start
```

---

# API Overview

## Auth APIs

```
POST /api/auth/register
POST /api/auth/login
```

## Trip APIs

```
POST /api/trips/upload
GET /api/trips
GET /api/trips/:tripId
```

---

# GPS Trip Calculation Logic

Distance between two GPS points is calculated using the **geolib** library.

Trip metrics calculated:

* Total Distance
* Total Idling Time
* Total Stoppage Time
* Maximum Speed
* Overspeed Detection

---

# Project Status

Backend architecture and core services are implemented with a focus on scalability and maintainability.

---

# Author

Nisha Mashhood
