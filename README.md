# 22MIA1024

## Project Structure

Contains the full stack notification system task.

- `logging_middleware/` - the intial logging function
- `notification_app_be/` - backend priority notification
- `notification_app_fe/` - React TypeScript frontend
- `notification_system_design.md` - system design stages
- `screenshots/` - output screenshots

## Requirements

- Node.js
- npm
- Git
- Postman or Insomnia

## Environment Setup
Create `.env` inside `logging_middleware/`:

```env
EVALUATION_ACCESS_TOKEN=your_access_token_here
```
Create `.env` inside `notification_app_be/`:
```env
EVALUATION_ACCESS_TOKEN=your_access_token_here
```
Create `.env` inside `notification_app_fe/`:
```env
VITE_EVALUATION_ACCESS_TOKEN=your_access_token_here
```

The frontend `.env.example` file contains:

```env
VITE_EVALUATION_ACCESS_TOKEN=
```

## Run Logging Middleware Test

```bash
cd logging_middleware
npm install
npx ts-node-dev --transpile-only src/testLogger.ts
```


## Run Backend

```bash
cd notification_app_be
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Backend APIs

Health check:

```text
GET http://localhost:5000/health
```

Priority notifications:

```text
GET http://localhost:5000/priority-notifications?limit=10
```

Priority order:

```text
Placement > Result > Event
```

## Run Frontend

```bash
cd notification_app_fe
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```
