# SmartFood Rescue AI — Backend Services & Routes Integration

This directory is prepared for future backend services (such as FastAPI or Node.js/Express) to handle server-side operations, route optimization, and secure third-party API communications.

## Google Maps Routes Integration Architecture

### Security Principles
- The **Google Maps Server Routes Key** (`GOOGLE_MAPS_SERVER_ROUTES_KEY`) is a high-privilege, secret credential.
- **Never expose this key to the browser, React application, Vite build artifacts, or client bundles.**
- The frontend must never call the Google Routes API directly. All route matrix and directional computations must be mediated by the backend.

### Environment Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Populate `GOOGLE_MAPS_SERVER_ROUTES_KEY` with your server-side API key.
3. Verify that `.env` is ignored by Git (`backend/.env` is listed in `.gitignore`).

### Future Endpoint: `POST /api/routes/estimate`

When the backend service is deployed, route calculations will transition from the client-side fallback/simulation to the production backend route endpoint:

- **Endpoint**: `POST /api/routes/estimate`
- **Request Payload**:
  ```json
  {
    "origin": {
      "address": "Smart College Canteen, Vijayawada",
      "latitude": 16.5142,
      "longitude": 80.6315
    },
    "destination": {
      "address": "Hope Food Bank, Benz Circle, Vijayawada",
      "latitude": 16.4996,
      "longitude": 80.6536
    },
    "vehicleType": "Auto",
    "departureTime": "2026-09-24T14:20:00Z"
  }
  ```
- **Backend Responsibility**:
  - Authenticate the client session.
  - Call the Google Routes API (`https://routes.googleapis.com/directions/v2:computeRoutes`) securely using `GOOGLE_MAPS_SERVER_ROUTES_KEY`.
  - Apply route optimization, traffic telemetry, and handling time buffers.
  - Return sanitized, lightweight metrics to the client.
- **Response Payload**:
  ```json
  {
    "distanceKm": 3.2,
    "durationMinutes": 10,
    "handlingBufferMinutes": 10,
    "totalEtaMinutes": 20,
    "estimatedArrival": "14:40",
    "routePolyline": "...",
    "corridorStatus": "Safe"
  }
  ```

> **Note**: The actual backend route integration should not be implemented now unless a real backend already exists. The frontend currently operates using the local time formula and fallback simulation alongside the optional client demo map.
