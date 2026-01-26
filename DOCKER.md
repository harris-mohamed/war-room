# War Room - Docker Deployment Guide

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- OpenRouter API key

### Local Development

1. **Clone and setup:**
   ```bash
   git clone <repo-url>
   cd war-room
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENROUTER_API_KEY
   ```

3. **Start the dev server:**
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

   Visit http://localhost:3000

### Docker Production Deployment

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop the container:**
   ```bash
   docker-compose down
   ```

4. **Rebuild after code changes:**
   ```bash
   docker-compose up --build -d
   ```

## Data Persistence

### SQLite Database
- **Location:** Stored in Docker volume `warroom-data`
- **File:** `/app/data/warroom.db` inside the container
- **Persistence:** Data survives container restarts and rebuilds

### Backup Database

```bash
# Backup
docker-compose exec warroom cat /app/data/warroom.db > backup.db

# Restore
docker cp backup.db $(docker-compose ps -q warroom):/app/data/warroom.db
docker-compose restart
```

### View Database

```bash
# Shell into container
docker-compose exec warroom sh

# Inside container
cd /app/data
ls -lah
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | - | Yes |
| `DATABASE_URL` | SQLite database path | `file:/app/data/warroom.db` | Auto-set |
| `NODE_ENV` | Environment mode | `production` | Auto-set |

## Architecture

```
┌─────────────────┐
│   Browser       │ ← localStorage removed, uses API
└────────┬────────┘
         ↓ HTTP
┌─────────────────┐
│  Next.js App    │ ← Runs in Docker container
│  (Port 3000)    │
└────────┬────────┘
         ↓
┌─────────────────┐
│  SQLite DB      │ ← Persisted in Docker volume
│  (warroom.db)   │
└────────┬────────┘
         │
┌────────┴────────┐
│  OpenRouter API │
└─────────────────┘
```

## Database Schema

### ChatSession
- `id`: Unique identifier (CUID)
- `title`: Chat session title
- `capabilityClass`: Officer capability tier (Strategic/Operational/Tactical/Support/All)
- `createdAt`: Creation timestamp
- `lastMessageAt`: Last message timestamp
- `messages`: Related messages

### Message
- `id`: Unique identifier (CUID)
- `chatId`: Reference to ChatSession
- `type`: "user" or "officer"
- `content`: Message text
- `officerId`: Officer designation (e.g., "O1")
- `officerTitle`: Officer title
- `officerModel`: Model slug (e.g., "anthropic/claude-opus-4.5")
- `timestamp`: Message timestamp

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs warroom

# Rebuild completely
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Database issues
```bash
# Reset database (WARNING: Deletes all data!)
docker-compose down -v
docker-compose up
```

### Prisma issues
```bash
# Regenerate Prisma client
docker-compose exec warroom npx prisma generate

# Run migrations manually
docker-compose exec warroom npx prisma migrate deploy
```

## API Endpoints

### Session Management
- `GET /api/sessions` - List all sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/[id]` - Get session with messages
- `PUT /api/sessions/[id]` - Update session
- `DELETE /api/sessions/[id]` - Delete session
- `POST /api/sessions/[id]/messages` - Add messages to session

### Officer Communication
- `POST /api/chat` - Send message to officers (parallel fan-out)
- `GET /api/chat` - Health check

## Production Deployment

### Vercel (Recommended)
1. Add environment variables in Vercel dashboard
2. Deploy automatically from Git
3. Database will use volume mount in Docker or Vercel Postgres

### Self-Hosted
1. Use provided `docker-compose.yml`
2. Set up reverse proxy (nginx/Traefik) for HTTPS
3. Configure firewall rules
4. Set up backup automation for SQLite database

## Security Notes

- Database file permissions are handled by Docker volumes
- Add authentication (Clerk/Auth.js) before exposing to internet
- Use HTTPS in production (reverse proxy)
- Regularly backup the SQLite database
- Consider migrating to PostgreSQL for multi-user deployments
