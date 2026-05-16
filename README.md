# 22MIA1024

## Project Structure

Contains the full stack notification system task.

- `logging_middleware/` 
- `notification_app_be/` 
- `notification_app_fe/` 
- `notification_system_design.md` 
- `screenshots/`

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
