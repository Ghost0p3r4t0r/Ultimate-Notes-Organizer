# Deployment Guide

## Prerequisites

- Docker & Docker Compose (recommended for production)
- A PostgreSQL 16 database (Railway, Render, AWS RDS, or self-hosted)
- Node.js 20+ (if deploying without Docker)

---

## Option 1: Docker Compose (Recommended)

The project includes a production-ready `docker-compose.yml` with three services: **PostgreSQL**, **Server**, and **Client** (served via Nginx).

### 1. Clone and configure

```bash
git clone https://github.com/Ghost0p3r4t0r/Ultimate-Notes-Organizer.git
cd Ultimate-Notes-Organizer

# Set secrets (or export as env vars)
export JWT_SECRET="your-strong-secret-here"
export JWT_REFRESH_SECRET="your-strong-refresh-secret-here"
```

### 2. Deploy

```bash
docker compose up --build -d
```

- **Client:** http://your-host:80
- **Server API:** http://your-host:4000
- **Swagger Docs:** http://your-host:4000/api-docs

### 3. Run database migrations

```bash
docker compose exec server npx prisma db push
# Or for production migrations:
docker compose exec server npx prisma migrate deploy
```

---

## Option 2: Railway

1. Push the repository to GitHub
2. Create a new Railway project from the repo
3. Add a PostgreSQL plugin (Railway provides the connection string)
4. Set the following environment variables in Railway:
   - `DATABASE_URL` — auto-populated by Railway PostgreSQL
   - `JWT_SECRET` — generate a random string
   - `JWT_REFRESH_SECRET` — generate a random string
   - `CORS_ORIGIN` — your Railway client URL
   - `NODE_ENV` — `production`
5. Deploy with the following commands:
   - **Build:** `npm install && npm run build -w @vault/shared && npm run build -w @vault/server`
   - **Start:** `npx prisma generate && npx prisma migrate deploy && node dist/index.js`
6. Add a separate service for the client with static files:
   - **Root directory:** `client`
   - **Build:** `npm install && npm run build`
   - **Output directory:** `client/dist`
   - **Start command:** `npx serve -s -l 3000`

---

## Option 3: Render

### Web Service (Server)

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Fill in:
   - **Name:** `vault-server`
   - **Build Command:** `npm install && npm run build -w @vault/shared && npm run build -w @vault/server`
   - **Start Command:** `npx prisma generate && npx prisma migrate deploy && node dist/index.js`
4. Add environment variables (same as Railway above)
5. Add a **PostgreSQL** database from Render's dashboard

### Static Site (Client)

1. Create a new **Static Site** on Render
2. Connect the same repository
3. Fill in:
   - **Name:** `vault-client`
   - **Build Command:** `cd client && npm install && npm run build`
   - **Publish Directory:** `client/dist`
4. Add env variable: `VITE_API_URL` — set to your Render server URL

---

## Option 4: DigitalOcean App Platform

1. Create a new **App** in DigitalOcean
2. Select GitHub as the source
3. Add a static site component for the client:
   - **Build Command:** `cd client && npm install && npm run build`
   - **Output Directory:** `client/dist`
4. Add a web service component for the server:
   - **Build Command:** `npm install && npm run build -w @vault/shared && npm run build -w @vault/server`
   - **Run Command:** `npx prisma generate && npx prisma migrate deploy && node dist/index.js`
   - **HTTP Port:** `4000`
5. Add a **Dev Database** (PostgreSQL) from the DigitalOcean marketplace
6. Set environment variables on the server component

---

## Option 5: VPS (Manual)

```bash
# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql nginx

# Clone and build
git clone https://github.com/Ghost0p3r4t0r/Ultimate-Notes-Organizer.git
cd Ultimate-Notes-Organizer
npm install
npm run build

# Set up PostgreSQL
sudo -u postgres createdb vault
sudo -u postgres psql -c "CREATE USER vault_user WITH PASSWORD 'your-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vault TO vault_user;"

# Run migrations
cd server
npx prisma generate
npx prisma migrate deploy

# Set up environment
cp .env.example .env
# Edit .env with your database credentials and secrets

# Start server (using PM2)
npm install -g pm2
pm2 start dist/index.js --name vault-server

# Configure Nginx for client
sudo cp ../client/nginx.conf /etc/nginx/sites-available/vault
sudo ln -s /etc/nginx/sites-available/vault /etc/nginx/sites-enabled/
sudo nginx -s reload
```

---

## Option 6: AWS (ECS / EC2)

### ECS with Fargate

1. Build and push Docker images to Amazon ECR:
   ```bash
   aws ecr create-repository --repository-name vault-server
   aws ecr create-repository --repository-name vault-client
   docker tag vault-server:latest <account>.dkr.ecr.<region>.amazonaws.com/vault-server:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/vault-server:latest
   ```
2. Create an RDS PostgreSQL instance
3. Create ECS task definitions for server and client
4. Set environment variables in the server task definition
5. Deploy with Fargate behind an Application Load Balancer

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_SECRET` | Yes | fallback* | JWT signing secret |
| `JWT_REFRESH_SECRET` | Yes | fallback* | Refresh token signing secret |
| `JWT_EXPIRES_IN` | No | `7d` | Access token expiry |
| `JWT_REFRESH_EXPIRES_IN` | No | `30d` | Refresh token expiry |
| `PORT` | No | `4000` | Server port |
| `CORS_ORIGIN` | Yes | `http://localhost:5173` | Allowed CORS origin |
| `NODE_ENV` | No | `development` | Environment (`production`, `development`, `test`) |
| `UPLOAD_DIR` | No | `./uploads` | File upload directory |
| `MAX_FILE_SIZE` | No | `10485760` | Max file size in bytes (10 MB) |

> \* Using fallback secrets in production is insecure. Always set strong random values.

---

## Post-Deployment Steps

1. **Verify health:** `curl http://your-server/health`
2. **Check Swagger docs:** `http://your-server/api-docs`
3. **Create a test account** via POST `/api/auth/register`
4. **Set up backups** for the PostgreSQL database
5. **Configure a custom domain** and SSL (via Nginx/Caddy/Cloudflare)

---

## Updating

```bash
# With Docker
git pull
docker compose up --build -d

# Without Docker
git pull
npm install
npm run build
npx prisma generate
npx prisma migrate deploy
pm2 restart vault-server
```
