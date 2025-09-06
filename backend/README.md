# Invyfy Backend

A simple Node.js + TypeScript + PostgreSQL backend API for the Invyfy application.

## Features

- **TypeScript**: Full TypeScript support
- **Express.js**: Fast, unopinionated web framework
- **PostgreSQL**: Database connection
- **CORS**: Cross-origin resource sharing support

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=invyfy
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   ```

3. **Set up PostgreSQL database:**
   ```bash
   # Run the setup script
   ./setup-db.sh
   ```

## Development

**Start development server:**
```bash
npm run dev
```

The server will start on `http://localhost:5000` with hot reload enabled.

## Production

**Build the project:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Server health status
- `GET /api/test` - Test endpoint

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts      # Database configuration
│   └── server.ts            # Main server file
├── database/
│   └── init.sql             # Database initialization script
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## Database Schema

Simple users table:
- **id**: Primary key
- **username**: Unique username
- **email**: Unique email
- **created_at**: Timestamp

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `invyfy` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
