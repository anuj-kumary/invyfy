# Invyfy - Full-Stack Application

A modern full-stack web application built with Next.js frontend and Node.js backend, featuring TypeScript and PostgreSQL.

## 🏗️ Project Structure

```
invyfy/
├── frontend/                 # Next.js + TypeScript + Tailwind CSS
│   ├── src/app/             # Next.js 13+ app directory
│   ├── package.json         # Frontend dependencies
│   └── tsconfig.json        # TypeScript config
├── backend/                  # Node.js + TypeScript + Express
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   └── server.ts        # Main server file
│   ├── database/            # Database scripts
│   ├── package.json         # Backend dependencies
│   └── tsconfig.json        # TypeScript config
├── package.json             # Root package.json with scripts
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### 1. Install All Dependencies

```bash
npm run install:all
```

### 2. Set Up Database

1. **Start PostgreSQL service**
2. **Run the setup script:**
   ```bash
   cd backend
   ./setup-db.sh
   ```

### 3. Configure Environment Variables

**Backend (.env):**
```bash
cd backend
cp env.example .env
# Edit .env with your database credentials
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:frontend    # Frontend on http://localhost:3000
npm run dev:backend     # Backend on http://localhost:5000
```

## 🛠️ Development

### Frontend (Next.js)

- **Port:** 3000
- **Framework:** Next.js 13+ with App Router
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript

**Available Scripts:**
```bash
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
```

### Backend (Node.js + Express)

- **Port:** 5000
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Language:** TypeScript
- **Features:** Simple API with database connection

**Available Scripts:**
```bash
cd backend
npm run dev          # Development with hot reload
npm run build        # TypeScript compilation
npm run start        # Production server
```

## 🌐 API Endpoints

- `GET /` - Welcome message
- `GET /health` - Server health status
- `GET /api/test` - Test endpoint

## 🗄️ Database

**PostgreSQL Schema:**
- Simple **users** table with basic fields
- Automatic timestamps

**Connection Details:**
- Host: `localhost`
- Port: `5432`
- Database: `invyfy`
- User: `postgres` (configurable)

## 🔧 Configuration

### Environment Variables

| Variable | Frontend | Backend | Description |
|----------|----------|---------|-------------|
| `PORT` | - | ✅ | Backend server port |
| `DB_*` | - | ✅ | Database configuration |
| `CORS_ORIGIN` | - | ✅ | Allowed origins |

## 📦 Production Build

```bash
# Build both applications
npm run build

# Start production servers
npm start
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both dev servers |
| `npm run build` | Build both applications |
| `npm run start` | Start both production servers |
| `npm run install:all` | Install all dependencies |

## 🚀 Deployment

### Frontend
- Build with `npm run build:frontend`
- Deploy to Vercel, Netlify, or any static hosting

### Backend
- Build with `npm run build:backend`
- Deploy to Heroku, DigitalOcean, AWS, or any Node.js hosting
- Set environment variables for production

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL service is running
   - Verify database credentials in `.env`
   - Ensure database `invyfy` exists

2. **Port Already in Use**
   - Change ports in environment variables
   - Kill processes using ports 3000/5000

### Getting Help

- Check the individual README files in `frontend/` and `backend/`
- Review environment variable configuration
- Ensure all prerequisites are installed
