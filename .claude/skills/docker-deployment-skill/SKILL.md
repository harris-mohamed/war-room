---
name: local-docker-deploy
description: Rebuild Docker containers after code changes. Use when modifying application code, dependencies, Dockerfile, or docker-compose.yml.
---

# Docker Rebuild Workflow

## When to rebuild
After changes to:
- Application source code
- Dependencies (requirements.txt, package.json, etc.)
- Dockerfile or docker-compose.yml
- Environment configuration

## Standard rebuild command
```bash
docker-compose down
docker-compose up --build -d
```

## Quick rebuild (if containers are already down)
```bash
docker-compose up --build -d
```

## Verify rebuild success
```bash
docker-compose ps
docker-compose logs --tail=50
```