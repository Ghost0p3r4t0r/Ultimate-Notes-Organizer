# Vault — Ultimate Notes Organizer

A production-ready full-stack application for organizing, comparing, analyzing, and managing collections of anything using dynamic schemas.

## Features

- **Dynamic Collections** — Create collections with custom fields (text, number, currency, date, dropdown, tags, image, rating, URL, email, phone, color, checkbox, boolean, multiSelect, JSON, markdown)
- **Item Management** — Full CRUD with dynamically generated forms per schema
- **Multi-View System** — Table, Card (masonry), Gallery (photo-first), and List views with per-collection persistence
- **Search & Filtering** — Global Cmd+K command palette, advanced filter builder with AND/OR groups and 14 operators, multi-column sorting
- **Comparison Engine** — Side-by-side item comparison with best-value detection (numeric/currency/rating), diff highlighting
- **Image & File Uploads** — Drag-drop, paste support, automatic thumbnail generation via Sharp, gallery with lightbox preview
- **Import/Export** — CSV, Excel, and JSON import with column mapping wizard; export with format and field selection
- **Favorites & Activity** — Toggle favorites per item, activity timeline tracking all changes
- **Dashboard** — Stats overview, per-collection mini bar charts, recent items, activity feed
- **Dark/Light Mode** — Full theme support with TailwindCSS CSS variables

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite 5 + TailwindCSS 3
- shadcn/ui (Radix primitives)
- TanStack Query (React Query)
- React Router v6
- Zustand (state)
- React Hook Form + Zod
- Framer Motion
- Recharts

### Backend
- Node.js + Express + TypeScript
- Prisma ORM (PostgreSQL)
- JWT auth (access + refresh tokens)
- Multer + Sharp (file uploads)
- csv-parse / csv-stringify / xlsx (import/export)

### Infrastructure
- Docker + Docker Compose
- Nginx (production static serving)
- PostgreSQL 16

## Project Structure

```
├── shared/              # Shared TypeScript types
├── server/              # Express API server
│   ├── prisma/          # Prisma schema & migrations
│   ├── src/
│   │   ├── config/      # Environment config
│   │   ├── controllers/ # Route handlers
│   │   ├── middlewares/  # Auth, upload, error handling
│   │   ├── repositories/ # Data access layer
│   │   ├── routes/      # Express routes
│   │   ├── services/    # Business logic
│   │   ├── utils/       # JWT, storage, Prisma client
│   │   └── tests/       # Jest unit tests
│   └── uploads/         # Local file storage
├── client/              # React SPA
│   ├── src/
│   │   ├── components/  # Shared UI components
│   │   ├── features/    # Feature modules
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities
│   │   ├── pages/       # Route pages
│   │   └── tests/       # Vitest component tests
│   └── dist/            # Production build output
├── docs/                # Documentation
├── docker-compose.yml   # Production Docker setup
└── docker-compose.dev.yml # Development Docker (Postgres only)
```

## Quick Start (Development)

**Prerequisites:** Node.js 20+, PostgreSQL 16, npm

```bash
# 1. Clone and install
git clone https://github.com/Ghost0p3r4t0r/Ultimate-Notes-Organizer.git
cd Ultimate-Notes-Organizer
npm install

# 2. Set up environment
cp server/.env.example server/.env
# Edit server/.env with your database credentials

# 3. Set up database
npm run db:push -w @vault/server
npm run db:seed -w @vault/server   # optional: seed test data

# 4. Start development servers
npm run dev
# Server: http://localhost:4000
# Client: http://localhost:5173
```

## Docker (Production)

```bash
# Build and start all services
docker compose up --build -d

# Or with custom secrets
JWT_SECRET=your-secret JWT_REFRESH_SECRET=your-refresh-secret docker compose up --build -d
```

## Running Tests

```bash
# All tests (server + client)
npm test

# Server tests only
npm test -w @vault/server

# Client tests only
npm test -w @vault/client

# Client tests in watch mode
npm run test:watch -w @vault/client
```

## API Documentation

When the server is running, Swagger UI is available at:
- `http://localhost:4000/api-docs`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh tokens |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/profile` | Get user profile |
| GET | `/api/collections` | List collections |
| POST | `/api/collections` | Create collection |
| GET | `/api/collections/:id` | Get collection with fields |
| PUT | `/api/collections/:id` | Update collection |
| DELETE | `/api/collections/:id` | Delete collection |
| GET | `/api/collections/:id/items` | List items (paginated) |
| POST | `/api/items` | Create item |
| GET | `/api/items/:id` | Get item detail |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |
| GET | `/api/search` | Global search |
| POST | `/api/search/filter` | Advanced filtered search |
| POST | `/api/compare` | Compare items |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/favorites` | List favorites |
| POST | `/api/favorites/:itemId/toggle` | Toggle favorite |
| POST | `/api/import-export/import` | Import data (CSV/Excel/JSON) |
| POST | `/api/import-export/export` | Export data (CSV/Excel/JSON) |
| POST | `/api/upload` | Upload file |
| GET | `/api/upload/:id` | Get file metadata |
| DELETE | `/api/upload/:id` | Delete file |

## Deployment

See [docs/deployment.md](docs/deployment.md) for detailed deployment instructions for Railway, Render, DigitalOcean, VPS, and AWS.

## License

MIT
