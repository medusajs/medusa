# undrlla v2 — Developer Quickstart

Medusa v2 + Next.js 16 App Router e-commerce platform with VPN provisioning, AI surface, and decentralized hosting.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 22 LTS+ |
| pnpm | 10+ |
| Docker + Docker Compose | v2+ |
| Git | 2.40+ |

```bash
node -v   # v22.x
pnpm -v   # 10.x
docker compose version
```

## 1. Clone & Install

```bash
git clone https://github.com/UnderUndre/undrlla.git
cd undrlla

pnpm install

cp .env.example .env
```

Edit `.env` — fill in required values (database URLs, auth secrets, API keys). Every variable without a default must be set before stack startup.

## 2. Docker Services

```bash
docker compose -f infra/docker-compose/docker-compose.yml up -d
```

This starts:

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL 16 | `:5432` | Primary database |
| Redis 7 | `:6379` | Cache, sessions, job queues |
| MinIO | `:9000` / `:9001` | S3-compatible object storage |
| BTCPay (testnet) | `:23000` | Bitcoin payment processing |
| Langfuse | `:3001` | LLM observability / tracing |
| OmniRoute sidecar | `:4000` | AI gateway routing |

Verify all containers are healthy:

```bash
docker compose -f infra/docker-compose/docker-compose.yml ps
```

Every service should show `healthy` or `running`.

## 3. Database Setup

```bash
# Run Medusa migrations
pnpm --filter apps/medusa medusa db:migrate

# Seed with dev data (admin user, sample products, test VPN peers)
pnpm --filter apps/medusa medusa db:seed
```

Default admin credentials from seed:

```
Email:    admin@undrlla.medusa.local
Password: supersecret
```

## 4. Start Backend

```bash
pnpm --filter apps/medusa dev
```

Medusa dev server starts on `http://localhost:9000`.

Verify:

```bash
curl http://localhost:9000/health
# Expected: {"status": "ok"}
```

Admin dashboard: `http://localhost:9000/app`.

## 5. Start Storefront

```bash
pnpm --filter apps/storefront dev
```

Next.js dev server starts on `http://localhost:3000`.

The storefront proxies API calls to the Medusa backend at `:9000` via the `MEDUSA_URL` env var (pre-configured in `.env.example`).

## 6. Verify Stack

Run all smoke checks in order:

```bash
# Backend health
curl -s http://localhost:9000/health | jq .

# Storefront renders
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Expected: 200

# Postgres connectivity
docker compose -f infra/docker-compose/docker-compose.yml exec postgres pg_isready -U undrlla

# Redis connectivity
docker compose -f infra/docker-compose/docker-compose.yml exec redis redis-cli ping
# Expected: PONG

# OmniRoute health
curl -s http://localhost:4000/health | jq .

# MinIO buckets
curl -s http://localhost:9000/minio/health/live
```

## 7. Common Tasks

### Create a Test Product

```bash
curl -X POST http://localhost:9000/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "title": "Test VPN Plan — 12 Months",
    "handle": "test-vpn-12m",
    "status": "published",
    "variants": [{
      "title": "Default",
      "prices": [{ "currency_code": "usd", "amount": 4999 }]
    }]
  }'
```

Or use the admin dashboard at `http://localhost:9000/app`.

### Place a Test Order

```bash
# Create cart → add item → complete checkout
curl -X POST http://localhost:9000/store/carts \
  -H "Content-Type: application/json" \
  -d '{"region_id": "<region_id>", "currency_code": "usd"}'

# Copy cart.id from response, then:
curl -X POST http://localhost:9000/store/carts/<cart_id>/line-items \
  -H "Content-Type: application/json" \
  -d '{"variant_id": "<variant_id>", "quantity": 1}'

curl -X POST http://localhost:9000/store/carts/<cart_id>/complete \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Provision a VPN Peer

```bash
curl -X POST http://localhost:9000/admin/vpn/peers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "customer_id": "<customer_id>",
    "region": "eu-west",
    "plan": "12m"
  }'
```

Returns WireGuard peer config (`.conf` file content).

### Trigger AI Conversation

```bash
curl -X POST http://localhost:4000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <omniroute_key>" \
  -d '{
    "model": "pc-builder-advisor",
    "messages": [
      {"role": "user", "content": "I need a quiet build for music production under $2000"}
    ]
  }'
```

## 8. Testing

### Unit Tests (vitest)

```bash
# All packages
pnpm test

# Single package
pnpm --filter packages/vpn-provisioner test

# Watch mode
pnpm --filter apps/medusa test:watch
```

### Integration Tests (docker-compose stack)

```bash
# Full integration suite
docker compose -f infra/docker-compose/docker-compose.yml up -d
pnpm test:integration

# Specific module
pnpm --filter packages/tenant-middleware test:integration
```

### E2E Tests (Playwright)

```bash
pnpm --filter apps/storefront exec npx playwright install
pnpm --filter apps/storefront exec npx playwright test
```

E2E tests expect the full stack running (backend + storefront + docker services).

## 9. Troubleshooting

### `ECONNREFUSED :9000`

Backend not running or migration pending. Check:

```bash
pnpm --filter apps/medusa medusa db:migrate
pnpm --filter apps/medusa dev
```

### `ECONNREFUSED :5432` or `:6379`

Docker services not up:

```bash
docker compose -f infra/docker-compose/docker-compose.yml up -d
docker compose -f infra/docker-compose/docker-compose.yml ps
docker compose -f infra/docker-compose/docker-compose.yml logs postgres redis
```

### Migration fails with "relation already exists"

Database has stale state. Drop and recreate:

```bash
docker compose -f infra/docker-compose/docker-compose.yml exec postgres psql -U undrlla -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
pnpm --filter apps/medusa medusa db:migrate
pnpm --filter apps/medusa medusa db:seed
```

### `MODULE_NOT_FOUND` after pulling new commits

Workspace dependencies changed:

```bash
pnpm install
```

### Port conflicts

Default ports can be overridden in `.env`:

```
MEDUSA_PORT=9000
STOREFRONT_PORT=3000
POSTGRES_PORT=5432
REDIS_PORT=6379
```

Restart affected services after changing.

### OmniRoute returns 502

Check that `OMNIROUTE_API_KEY` and `OPENAI_API_KEY` (or equivalent) are set in `.env`. OmniRoute needs at least one upstream LLM provider configured.

```bash
curl -s http://localhost:4000/health
# Check "providers" field for connected backends
```

## Project Structure Reference

```
apps/
  medusa/             # Medusa v2 backend (commerce engine)
  storefront/         # Next.js 16 App Router storefront
packages/
  shared-types/       # Shared TypeScript types across monorepo
  omniroute-client/   # AI SDK client for OmniRoute gateway
  vpn-provisioner/    # WireGuard VPN peer provisioning
  tenant-middleware/  # Tenant isolation middleware
  migration-tool/     # Legacy undrlla → v2 data migration
  federation-protocol/ # Decentralized federation protocol
  install-cli/        # One-click installer for self-hosted instances
infra/
  docker-compose/     # Local development services
  akash/              # Akash Network deployment manifests (SDL)
  hot-core/           # Hardened centralized infra (secrets, payments)
  ci/                 # CI/CD pipelines
```
