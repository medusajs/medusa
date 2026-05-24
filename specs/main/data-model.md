# Data Model: undrlla v2 — Medusa Migration

**Spec**: `specs/001-init/spec.md` | **Date**: 2026-05-24 | **Status**: Phase 1 design

---

## Table of Contents

1. [Overview](#overview)
2. [Schema Conventions](#schema-conventions)
3. [Prisma Tenant Enforcement Pattern](#prisma-tenant-enforcement-pattern)
4. [Module: TenantModule](#module-tenantmodule)
5. [Module: VPNModule](#module-vpnmodule)
6. [Module: AIMeteringModule](#module-aimeteringmodule)
7. [Module: FederationModule](#module-federationmodule)
8. [Module: MigrationModule](#module-migrationmodule)
9. [Medusa Entity Extensions](#medusa-entity-extensions)
10. [Cross-Entity Relationship Map](#cross-entity-entity-relationship-map)
11. [Migration Strategy Notes](#migration-strategy-notes)
12. [Index Strategy Summary](#index-strategy-summary)
13. [RLS Policy Templates](#rls-policy-templates)

---

## Overview

undrlla v2 extends Medusa v2's `public` schema with a custom `undrlla` schema containing all domain-specific entities. Medusa provides catalog, cart, order, inventory, fulfillment, returns, and payment primitives out of the box. This document defines everything **beyond** Medusa's built-in models.

### Custom modules

| Module | Custom Entities | Medusa Extension Points |
|--------|----------------|------------------------|
| **TenantModule** | `Tenant`, `Workspace`, `BrandConfig` | Sales Channel binding, Region |
| **VPNModule** | `VPNServer`, `VPNPeer`, `VPNIPPool` | Fulfillment workflow hook |
| **AIMeteringModule** | `AIUsageEvent`, `AIKeyVault`, `AITierConfig` | — (sidecar integration) |
| **FederationModule** | `FederationInstance`, `FederationCatalogEntry` | — (future) |
| **MigrationModule** | `MigrationJournal`, `MigrationCheckpoint` | — (tooling only) |

### Entity classification

| Type | Count | Examples |
|------|-------|---------|
| **Pure custom** (no Medusa base) | 12 | Tenant, VPNServer, AIUsageEvent, AIKeyVault, MigrationJournal |
| **Medusa-extended** (link table + custom fields) | 3 | Product ↔ Tenant, Order ↔ Tenant, Customer ↔ Tenant |
| **Config/enumeration** | 2 | BrandConfig, AITierConfig |

---

## Schema Conventions

### Naming

| Convention | Example |
|------------|---------|
| Schema: `undrlla` | `undrlla.tenant`, `undrlla.vpn_server` |
| Table names: `snake_case` | `ai_usage_event`, `vpn_ip_pool` |
| Column names: `snake_case` | `tenant_id`, `allocated_at` |
| Primary key: `id` (UUID v4) | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Foreign keys: `<entity>_id` | `tenant_id`, `vpn_server_id`, `customer_id` |
| Timestamps: `created_at`, `updated_at`, `deleted_at` | `TIMESTAMPTZ NOT NULL DEFAULT now()` |
| Boolean flags: `is_<adjective>` or `<verb>_ed` | `is_active`, `allocated` |

### Shared columns (every customer-scoped table)

```sql
tenant_id   UUID NOT NULL REFERENCES undrlla.tenant(id),
created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
deleted_at  TIMESTAMPTZ          -- soft delete
```

### Data types

| Domain | Postgres Type | Rationale |
|--------|--------------|-----------|
| UUID | `UUID` | Native indexing, no collision |
| Money | `BIGINT` (cents) + `currency_code TEXT` | Avoids floating-point; Medusa convention |
| JSON blobs | `JSONB` | Indexable, schema-flexible |
| Encrypted secrets | `BYTEA` | AES-256-GCM ciphertext + nonce + tag |
| Timestamps | `TIMESTAMPTZ` | All UTC; timezone-aware |
| IP addresses | `INET` | Native network operations, range queries |
| Enum-like | `TEXT` + `CHECK` constraint | Prisma compatibility; Medusa uses TEXT enums |

### Encryption (AES-256-GCM)

Applied to: `AIKeyVault.encrypted_key`, `VPNServer.wg_private_key_enc`, secrets in `BrandConfig.payment_config`.

Storage format per column:

```
[32-byte nonce] [16-byte auth tag] [N-byte ciphertext]
```

All stored as a single `BYTEA`. Decryption key is sourced from `ENCRYPTION_MASTER_KEY` env var (split via Shamir secret sharing in production). Never logged, never serialized in API responses, never cached in plaintext.

---

## Prisma Tenant Enforcement Pattern

Every custom module uses a Prisma Client extension that injects `tenant_id` into every query automatically. This prevents accidental cross-tenant data access at the ORM layer.

```prisma
// prisma/schema.prisma — datasource block
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["public", "undrlla"]
}
```

```prisma
// prisma/schema.prisma — model example (Tenant table)
model Tenant {
  id          String   @id @default(uuid()) @db.Uuid
  slug        String   @unique @db.VarChar(64)
  name        String   @db.VarChar(255)
  sales_channel_id String? @db.Uuid
  default_currency String @default("USD") @db.Char(3)
  region      String   @default("GLOBAL") @db.VarChar(16)
  ai_tier     String   @default("dev") @db.VarChar(16)
  is_active   Boolean  @default(true)
  metadata    Json?
  created_at  DateTime @default(now()) @db.Timestamptz
  updated_at  DateTime @updatedAt @db.Timestamptz
  deleted_at  DateTime? @db.Timestamptz

  workspaces      Workspace[]
  brand_config    BrandConfig?
  vpn_peers       VPNPeer[]
  ai_usage_events AIUsageEvent[]
  ai_key_vault    AIKeyVault?
  ai_tier_config  AITierConfig?
  customers       CustomerTenantLink[]
  orders          OrderTenantLink[]

  @@map("tenant")
  @@schema("undrlla")
}
```

```typescript
// src/lib/prisma-tenant.ts — Client extension for automatic tenant scoping
import { Prisma, PrismaClient } from "@prisma/client"

const tenantContext = new AsyncLocalStorage<string>()

export function setTenantId(id: string) {
  tenantContext.enterWith(id)
}

export function getTenantId(): string {
  const id = tenantContext.getStore()
  if (!id) throw new Error("tenant_id not set in current context")
  return id
}

export const prisma = new PrismaClient().$extends({
  name: "tenantScope",
  query: {
    $allModels: {
      async $allOperations({ args, model, operation, query }) {
        const modelDef = Prisma.dmmf.datamodel.models.find(m => m.name === model)
        const hasTenantId = modelDef?.fields.some(f => f.name === "tenant_id")
        if (!hasTenantId) return query(args)

        const tenantId = getTenantId()

        if (["findMany", "findFirst", "count", "aggregate"].includes(operation)) {
          args.where = { ...args.where, tenant_id: tenantId }
        } else if (operation === "create") {
          args.data = { ...args.data, tenant_id: tenantId }
        } else if (operation === "update") {
          args.where = { ...args.where, tenant_id: tenantId }
        } else if (operation === "delete") {
          args.where = { ...args.where, tenant_id: tenantId }
        }

        return query(args)
      },
    },
  },
})
```

This ensures that **no route handler can bypass tenant scoping** — it is enforced at the ORM layer (FR-009).

---

## Module: TenantModule

### Entity: `Tenant`

Workspace boundary. Represents a region (GLOBAL / EU) or B2B reseller / white-label operator. Owns branding, payment config, AI tier, and Sales Channel binding.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | Internal identifier |
| `slug` | `VARCHAR(64)` | `UNIQUE NOT NULL` | URL-safe identifier (e.g., `global`, `eu`, `reseller-acme`) |
| `name` | `VARCHAR(255)` | `NOT NULL` | Display name |
| `sales_channel_id` | `UUID` | `REFERENCES public.sales_channel(id)` | Medusa Sales Channel — 1:1 mapping |
| `default_currency` | `CHAR(3)` | `NOT NULL DEFAULT 'USD'` | ISO 4217 |
| `region` | `VARCHAR(16)` | `NOT NULL DEFAULT 'GLOBAL' CHECK (region IN ('GLOBAL','EU'))` | Geographic compliance region |
| `ai_tier` | `VARCHAR(16)` | `NOT NULL DEFAULT 'dev' CHECK (ai_tier IN ('dev','paid','byok'))` | Active AI deployment tier |
| `is_active` | `BOOLEAN` | `NOT NULL DEFAULT true` | Soft enable/disable |
| `metadata` | `JSONB` | | Extensible key-value (jurisdiction, tax ID, etc.) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `deleted_at` | `TIMESTAMPTZ` | | Soft delete |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `tenant_pkey` | `id` | UNIQUE (PK) | Primary key |
| `tenant_slug_key` | `slug` | UNIQUE | Lookup by slug |
| `tenant_sales_channel_idx` | `sales_channel_id` | btree | Sales Channel → Tenant reverse lookup |
| `tenant_region_idx` | `region` | btree | Region-scoped queries |

**RLS Policy**:

```sql
CREATE POLICY tenant_isolation ON undrlla.tenant
  FOR ALL USING (
    id = current_setting('app.tenant_id')::UUID
  );
```

**Migration notes**: Legacy `undrlla` was mono-tenant (GLOBAL). Create one `Tenant` row (`slug='global'`) for legacy data. Add a second (`slug='eu'`) for the EU region. Legacy customers map to `tenant_id` of the GLOBAL tenant.

---

### Entity: `Workspace`

Storefront-level grouping. Maps 1:1 to Tenant initially; 1:N possible when multi-tenant activates.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `tenant_id` | `UUID` | `NOT NULL REFERENCES undrlla.tenant(id)` | Owning tenant |
| `slug` | `VARCHAR(64)` | `UNIQUE NOT NULL` | Subdomain or path prefix |
| `name` | `VARCHAR(255)` | `NOT NULL` | Display name |
| `domain` | `VARCHAR(255)` | `UNIQUE` | Custom domain (e.g., `store.reseller.com`) |
| `subdomain` | `VARCHAR(64)` | `UNIQUE` | `<subdomain>.undrlla.com` |
| `is_active` | `BOOLEAN` | `NOT NULL DEFAULT true` | |
| `metadata` | `JSONB` | | Theme settings, feature flags |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `deleted_at` | `TIMESTAMPTZ` | | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `workspace_pkey` | `id` | UNIQUE (PK) | |
| `workspace_slug_key` | `slug` | UNIQUE | |
| `workspace_domain_key` | `domain` | UNIQUE (partial, WHERE domain IS NOT NULL) | Custom domain routing |
| `workspace_subdomain_key` | `subdomain` | UNIQUE (partial, WHERE subdomain IS NOT NULL) | Subdomain routing |
| `workspace_tenant_idx` | `tenant_id` | btree | Tenant → Workspaces |

**RLS Policy**:

```sql
CREATE POLICY workspace_tenant_isolation ON undrlla.workspace
  FOR ALL USING (
    tenant_id = current_setting('app.tenant_id')::UUID
  );
```

**Migration notes**: Create one Workspace per Tenant during migration. `slug` matches Tenant slug. No legacy mapping needed — this entity is new in v2.

---

### Entity: `BrandConfig`

Branding and payment configuration for a Tenant. One-to-one with Tenant.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `tenant_id` | `UUID` | `NOT NULL UNIQUE REFERENCES undrlla.tenant(id)` | Owning tenant |
| `logo_url` | `TEXT` | | CDN URL for logo |
| `primary_color` | `CHAR(7)` | | Hex color (e.g., `#1a1a2e`) |
| `secondary_color` | `CHAR(7)` | | |
| `font_family` | `VARCHAR(255)` | | CSS font stack |
| `favicon_url` | `TEXT` | | |
| `payment_config` | `JSONB` | `NOT NULL DEFAULT '{}'` | Encrypted provider credentials (Stripe key, BTCPay URL, etc.). Values encrypted with AES-256-GCM before storage. |
| `social_links` | `JSONB` | `DEFAULT '{}'` | `{ telegram, whatsapp, discord, matrix }` |
| `legal_links` | `JSONB` | `DEFAULT '{}'` | `{ privacy_policy_url, terms_url, refund_policy_url }` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `brand_config_pkey` | `id` | UNIQUE (PK) | |
| `brand_config_tenant_key` | `tenant_id` | UNIQUE | 1:1 with Tenant |

**Migration notes**: Extract branding from legacy `undrlla` Next.js `site.config.ts`. Payment credentials from legacy `.env` — re-encrypt with AES-256-GCM before inserting.

---

## Module: VPNModule

### Entity: `VPNServer`

Physical/virtual server running WireGuard / AmneziaWG / Xray. Hosted exclusively on centralized hardened infrastructure (FR-019). Never on Akash.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `name` | `VARCHAR(255)` | `NOT NULL` | Human-readable label |
| `hostname` | `VARCHAR(255)` | `NOT NULL` | SSH/API endpoint |
| `ssh_port` | `INTEGER` | `NOT NULL DEFAULT 22` | |
| `public_ip` | `INET` | `NOT NULL` | WireGuard endpoint IP |
| `wg_port` | `INTEGER` | `NOT NULL DEFAULT 51820` | WireGuard/AmneziaWG listen port |
| `xray_port` | `INTEGER` | | Xray listen port (nullable if not running Xray) |
| `protocol` | `VARCHAR(16)` | `NOT NULL CHECK (protocol IN ('wireguard','amneziawg','xray','multi'))` | Active protocol(s) |
| `wg_public_key` | `TEXT` | `NOT NULL` | Server's WireGuard public key |
| `wg_private_key_enc` | `BYTEA` | `NOT NULL` | AES-256-GCM encrypted private key |
| `location_city` | `VARCHAR(255)` | | City (e.g., "Frankfurt") |
| `location_country` | `CHAR(2)` | | ISO 3166-1 alpha-2 |
| `location_lat` | `DECIMAL(9,6)` | | Latitude |
| `location_lon` | `DECIMAL(9,6)` | | Longitude |
| `max_peers` | `INTEGER` | `NOT NULL DEFAULT 100` | Hard capacity limit |
| `active_peers` | `INTEGER` | `NOT NULL DEFAULT 0` | Current allocated count (denormalized for fast capacity checks) |
| `is_active` | `BOOLEAN` | `NOT NULL DEFAULT true` | Accepts new peers |
| `health_status` | `VARCHAR(16)` | `NOT NULL DEFAULT 'unknown' CHECK (health_status IN ('healthy','degraded','down','unknown'))` | Last known health |
| `health_checked_at` | `TIMESTAMPTZ` | | Timestamp of last health check |
| `metadata` | `JSONB` | | Provider, instance type, provider_id |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `deleted_at` | `TIMESTAMPTZ` | | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `vpn_server_pkey` | `id` | UNIQUE (PK) | |
| `vpn_server_hostname_key` | `hostname` | UNIQUE | |
| `vpn_server_public_ip_idx` | `public_ip` | btree | |
| `vpn_server_location_idx` | `location_country, location_city` | btree | Geo-filtered listing |
| `vpn_server_capacity_idx` | `is_active, active_peers, max_peers` | btree | Capacity-aware peer allocation |
| `vpn_server_health_idx` | `health_status, health_checked_at` | btree | Monitoring queries |

**RLS Policy**: VPNServer is **operator-scoped, not tenant-scoped**. VPN servers are shared infrastructure. No `tenant_id` column. RLS restricted to `app.is_operator = true`.

```sql
CREATE POLICY vpn_server_operator_only ON undrlla.vpn_server
  FOR ALL USING (
    current_setting('app.is_operator', true)::BOOLEAN = true
  );
```

**Migration notes**: Import from legacy `vpn_servers` table. Re-encrypt `wg_private_key` with AES-256-GCM using new master key. Compute `active_peers` from legacy peer assignments.

---

### Entity: `VPNPeer`

Allocated peer slot on a VPNServer. Linked to Customer, Order, and IP allocation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `tenant_id` | `UUID` | `NOT NULL REFERENCES undrlla.tenant(id)` | Tenant that owns this peer |
| `vpn_server_id` | `UUID` | `NOT NULL REFERENCES undrlla.vpn_server(id)` | Hosting server |
| `customer_id` | `UUID` | `REFERENCES public.customer(id)` | Medusa customer |
| `order_id` | `UUID` | `REFERENCES public.order(id)` | Medusa order that created this peer |
| `allocated_ip` | `INET` | `NOT NULL` | Peer IP within server's subnet |
| `public_key` | `TEXT` | `NOT NULL` | Client public key |
| `preshared_key_enc` | `BYTEA` | | AES-256-GCM encrypted preshared key (optional) |
| `protocol` | `VARCHAR(16)` | `NOT NULL CHECK (protocol IN ('wireguard','amneziawg','xray'))` | |
| `config_ref` | `TEXT` | | Reference to stored config archive (S3 key / local path) |
| `status` | `VARCHAR(16)` | `NOT NULL DEFAULT 'active' CHECK (status IN ('provisioning','active','suspended','revoked','expired'))` | |
| `expires_at` | `TIMESTAMPTZ` | | Subscription end date |
| `last_connected_at` | `TIMESTAMPTZ` | | Last handshake timestamp |
| `data_usage_bytes` | `BIGINT` | `NOT NULL DEFAULT 0` | Cumulative bytes transferred |
| `metadata` | `JSONB` | | Protocol-specific config (AmneziaWG junk packets, Xray UUID, etc.) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `deleted_at` | `TIMESTAMPTZ` | | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `vpn_peer_pkey` | `id` | UNIQUE (PK) | |
| `vpn_peer_tenant_server_idx` | `tenant_id, vpn_server_id` | btree | Tenant's peers on a server |
| `vpn_peer_customer_idx` | `customer_id` | btree | Customer's peers |
| `vpn_peer_order_idx` | `order_id` | btree | Order → peers |
| `vpn_peer_public_key_idx` | `public_key` | UNIQUE | Prevent duplicate key assignment |
| `vpn_peer_allocated_ip_idx` | `vpn_server_id, allocated_ip` | UNIQUE | Prevent duplicate IP assignment |
| `vpn_peer_status_idx` | `status, expires_at` | btree | Active/expiring peer queries |
| `vpn_peer_expires_idx` | `expires_at` WHERE `status = 'active'` | btree (partial) | Expiration sweep job |

**RLS Policy**:

```sql
CREATE POLICY vpn_peer_tenant_isolation ON undrlla.vpn_peer
  FOR ALL USING (
    tenant_id = current_setting('app.tenant_id')::UUID
  );
```

**Migration notes**: Import from legacy `vpn_peers`. Map `customer_id` via MigrationJournal. Recompute `expires_at` from legacy subscription end dates. Verify `public_key` uniqueness against target server.

---

### Entity: `VPNIPPool`

IP address pool for a VPN server. Atomic allocation via `UPDATE ... WHERE allocated = false LIMIT 1 RETURNING *` (FR-020).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `vpn_server_id` | `UUID` | `NOT NULL REFERENCES undrlla.vpn_server(id)` | Owning server |
| `ip_address` | `INET` | `NOT NULL` | Individual IP in pool |
| `allocated` | `BOOLEAN` | `NOT NULL DEFAULT false` | Allocation flag |
| `allocated_to_peer_id` | `UUID` | `REFERENCES undrlla.vpn_peer(id)` | Peer that holds this IP |
| `allocated_at` | `TIMESTAMPTZ` | | When allocated |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `vpn_ip_pool_pkey` | `id` | UNIQUE (PK) | |
| `vpn_ip_pool_server_ip_key` | `vpn_server_id, ip_address` | UNIQUE | One IP per server |
| `vpn_ip_pool_free_idx` | `vpn_server_id, allocated` WHERE `allocated = false` | btree (partial) | **Atomic allocation target** |
| `vpn_ip_pool_peer_idx` | `allocated_to_peer_id` WHERE `allocated = true` | btree (partial) | Reverse lookup |

**Atomic allocation query**:

```sql
UPDATE undrlla.vpn_ip_pool
SET allocated = true,
    allocated_to_peer_id = $peer_id,
    allocated_at = now()
WHERE id = (
    SELECT id FROM undrlla.vpn_ip_pool
    WHERE vpn_server_id = $server_id
      AND allocated = false
    ORDER BY ip_address
    LIMIT 1
    FOR UPDATE SKIP LOCKED
)
RETURNING ip_address;
```

`FOR UPDATE SKIP LOCKED` prevents race conditions when two concurrent orders request from the same pool (Edge Case: VPN peer creation race condition).

**RLS Policy**: Operator-only, same as VPNServer.

**Migration notes**: Generate from legacy server subnet definitions. One row per IP in each server's CIDR range. Mark currently-allocated IPs from legacy peer data.

---

## Module: AIMeteringModule

### Entity: `AIUsageEvent`

Metered event from OmniRoute. Every AI request produces one row (FR-012).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `tenant_id` | `UUID` | `NOT NULL REFERENCES undrlla.tenant(id)` | Tenant |
| `customer_id` | `UUID` | `REFERENCES public.customer(id)` | Medusa customer (null for system/internal) |
| `session_id` | `VARCHAR(255)` | | Conversation session identifier |
| `request_id` | `VARCHAR(255)` | `NOT NULL` | Unique request ID from OmniRoute |
| `use_case` | `VARCHAR(64)` | `NOT NULL` | Tag: `pc_builder`, `support_agent`, `seo_gen`, `ops_automation`, `generic` |
| `ai_tier` | `VARCHAR(16)` | `NOT NULL CHECK (ai_tier IN ('dev','paid','byok'))` | Tier used for this request |
| `provider` | `VARCHAR(64)` | `NOT NULL` | Upstream provider: `openai`, `anthropic`, `openrouter`, `ollama`, etc. |
| `model` | `VARCHAR(128)` | `NOT NULL` | Model identifier: `gpt-4o`, `claude-sonnet-4-20250514`, etc. |
| `prompt_tokens` | `INTEGER` | `NOT NULL DEFAULT 0` | |
| `completion_tokens` | `INTEGER` | `NOT NULL DEFAULT 0` | |
| `total_tokens` | `INTEGER` | `NOT NULL DEFAULT 0` | Computed: prompt + completion |
| `cost_usd` | `BIGINT` | `NOT NULL DEFAULT 0` | Cost in microdollars (1/1,000,000 USD) |
| `latency_ms` | `INTEGER` | | Round-trip latency |
| `is_success` | `BOOLEAN` | `NOT NULL DEFAULT true` | false on error / fallback |
| `error_code` | `VARCHAR(64)` | | Provider error code if failed |
| `langfuse_trace_id` | `VARCHAR(255)` | | Langfuse trace correlation (FR-030) |
| `metadata` | `JSONB` | | Extra context (user agent, channel, etc.) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `ai_usage_event_pkey` | `id` | UNIQUE (PK) | |
| `ai_usage_event_tenant_time_idx` | `tenant_id, created_at DESC` | btree | Per-tenant usage timeline |
| `ai_usage_event_customer_idx` | `customer_id, created_at DESC` | btree | Per-customer usage |
| `ai_usage_event_request_key` | `request_id` | UNIQUE | Deduplication |
| `ai_usage_event_use_case_idx` | `tenant_id, use_case, created_at DESC` | btree | Use-case analytics |
| `ai_usage_event_billing_idx` | `tenant_id, ai_tier, created_at` WHERE `ai_tier = 'paid'` | btree (partial) | Billing aggregation |
| `ai_usage_event_model_idx` | `provider, model, created_at DESC` | btree | Model usage analytics |
| `ai_usage_event_langfuse_idx` | `langfuse_trace_id` | btree | Trace correlation |

**RLS Policy**:

```sql
CREATE POLICY ai_usage_tenant_isolation ON undrlla.ai_usage_event
  FOR ALL USING (
    tenant_id = current_setting('app.tenant_id')::UUID
  );
```

**Migration notes**: New entity — no legacy data. Backfill starts at cutover. Verify token counts match OmniRoute logs for the first 7 days.

---

### Entity: `AIKeyVault`

Encrypted BYOK customer keys. **Never logged, never serialized in API responses, never cached in plaintext** (FR-033, SC-010).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `tenant_id` | `UUID` | `NOT NULL UNIQUE REFERENCES undrlla.tenant(id)` | Owning tenant (1 BYOK vault per tenant) |
| `encrypted_key` | `BYTEA` | `NOT NULL` | AES-256-GCM encrypted API key |
| `key_nonce` | `BYTEA` | `NOT NULL` | 32-byte nonce (stored separately for audit) |
| `provider` | `VARCHAR(64)` | `NOT NULL` | `openai`, `anthropic`, `openrouter`, `ollama` |
| `key_alias` | `VARCHAR(255)` | | User-friendly label ("My OpenAI Key") |
| `key_prefix` | `VARCHAR(16)` | `NOT NULL` | First 4 chars of decrypted key for display (e.g., `sk-o...`) |
| `is_valid` | `BOOLEAN` | `NOT NULL DEFAULT true` | Set false on auth failure; prompt re-entry |
| `last_validated_at` | `TIMESTAMPTZ` | | Last successful validation |
| `routing_rules` | `JSONB` | `DEFAULT '{}'` | Per-use-case provider routing overrides |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `ai_key_vault_pkey` | `id` | UNIQUE (PK) | |
| `ai_key_vault_tenant_key` | `tenant_id` | UNIQUE | 1 vault per tenant |

**RLS Policy**: Strict — only accessible from OmniRoute request path middleware, not from general tenant context.

```sql
CREATE POLICY ai_key_vault_restricted ON undrlla.ai_key_vault
  FOR ALL USING (
    current_setting('app.is_ai_service', true)::BOOLEAN = true
    AND tenant_id = current_setting('app.tenant_id')::UUID
  );
```

**Migration notes**: New entity. BYOK keys are customer-supplied post-launch. No legacy migration needed.

---

### Entity: `AITierConfig`

Per-tenant AI tier configuration. Defines limits, fallback rules, and billing parameters.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `tenant_id` | `UUID` | `NOT NULL UNIQUE REFERENCES undrlla.tenant(id)` | |
| `tier` | `VARCHAR(16)` | `NOT NULL CHECK (tier IN ('dev','paid','byok'))` | Active tier |
| `monthly_token_limit` | `BIGINT` | `NOT NULL DEFAULT 1000000` | Hard limit per month (0 = unlimited) |
| `monthly_cost_limit_usd` | `BIGINT` | `NOT NULL DEFAULT 100000000` | Hard limit in microdollars (0 = unlimited) |
| `cost_alert_threshold_pct` | `INTEGER` | `NOT NULL DEFAULT 80` | Alert at N% of cost limit |
| `default_provider` | `VARCHAR(64)` | `NOT NULL DEFAULT 'openai'` | Primary provider |
| `default_model` | `VARCHAR(128)` | `NOT NULL DEFAULT 'gpt-4o-mini'` | Primary model |
| `fallback_provider` | `VARCHAR(64)` | | Fallback on primary failure |
| `fallback_model` | `VARCHAR(128)` | | |
| `allowed_models` | `JSONB` | `NOT NULL DEFAULT '[]'` | Array of `{ provider, model }` allowed for this tier |
| `billing_provider` | `VARCHAR(32)` | `CHECK (billing_provider IN ('openmeter','killbill','stripe_metered'))` | Usage billing backend |
| `billing_config` | `JSONB` | | Provider-specific config (API key ref, plan ID, etc.) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `ai_tier_config_pkey` | `id` | UNIQUE (PK) | |
| `ai_tier_config_tenant_key` | `tenant_id` | UNIQUE | 1 config per tenant |

**Migration notes**: New entity. Seed defaults for GLOBAL and EU tenants during install.

---

## Module: FederationModule

### Entity: `FederationInstance`

Registered third-party-operated undrlla instance. Metadata only — no shared state (FR-034, future).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `domain` | `VARCHAR(255)` | `UNIQUE NOT NULL` | Instance URL |
| `name` | `VARCHAR(255)` | `NOT NULL` | Operator-chosen display name |
| `operator_email` | `VARCHAR(255)` | `NOT NULL` | Contact |
| `operator_pubkey` | `TEXT` | | PGP/age public key for verified communication |
| `version` | `VARCHAR(32)` | | Reported undrlla version |
| `region` | `VARCHAR(16)` | | Operator's primary region |
| `jurisdiction` | `VARCHAR(64)` | | Legal jurisdiction |
| `is_listed` | `BOOLEAN` | `NOT NULL DEFAULT false` | Opt-in to public catalog |
| `is_verified` | `BOOLEAN` | `NOT NULL DEFAULT false` | Maintainer has verified operator identity |
| `health_url` | `TEXT` | | Health check endpoint |
| `health_status` | `VARCHAR(16)` | `DEFAULT 'unknown' CHECK (health_status IN ('healthy','degraded','down','unknown'))` | |
| `last_seen_at` | `TIMESTAMPTZ` | | Last heartbeat |
| `metadata` | `JSONB` | | Custom operator metadata |
| `registered_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `deleted_at` | `TIMESTAMPTZ` | | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `federation_instance_pkey` | `id` | UNIQUE (PK) | |
| `federation_instance_domain_key` | `domain` | UNIQUE | |
| `federation_instance_listed_idx` | `is_listed, is_verified, region` | btree | Public catalog query |
| `federation_instance_health_idx` | `health_status, last_seen_at` | btree | Staleness detection |

**RLS Policy**: FederationInstance is **public-reading, operator-writing**.

```sql
CREATE POLICY federation_instance_read ON undrlla.federation_instance
  FOR SELECT USING (true);

CREATE POLICY federation_instance_write ON undrlla.federation_instance
  FOR ALL USING (
    current_setting('app.is_operator', true)::BOOLEAN = true
  );
```

**Migration notes**: New entity. Seeded empty. Instances register themselves post-install.

---

### Entity: `FederationCatalogEntry`

Products shared across federation instances (future feature).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `instance_id` | `UUID` | `NOT NULL REFERENCES undrlla.federation_instance(id)` | Source instance |
| `product_id` | `UUID` | `NOT NULL` | Product ID on source instance |
| `product_title` | `VARCHAR(255)` | `NOT NULL` | Denormalized title |
| `product_handle` | `VARCHAR(255)` | `NOT NULL` | |
| `category` | `VARCHAR(128)` | | |
| `price_usd` | `BIGINT` | | Price in cents (USD equivalent) |
| `currency_code` | `CHAR(3)` | `DEFAULT 'USD'` | Source currency |
| `thumbnail_url` | `TEXT` | | |
| `is_available` | `BOOLEAN` | `NOT NULL DEFAULT true` | |
| `indexed_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `federation_catalog_pkey` | `id` | UNIQUE (PK) | |
| `federation_catalog_instance_product_key` | `instance_id, product_id` | UNIQUE | |
| `federation_catalog_search_idx` | `product_title, category` | GIN (gin_trgm_ops) | Full-text search |
| `federation_catalog_price_idx` | `price_usd, currency_code` | btree | Price sorting |

**RLS Policy**: Public read, operator write (same as FederationInstance).

**Migration notes**: New entity. Deferred to Phase 5+.

---

## Module: MigrationModule

### Entity: `MigrationJournal`

Every migrated entity: source ID, target ID, content hash, status (FR-004, FR-037).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `entity_type` | `VARCHAR(64)` | `NOT NULL` | Legacy entity: `customer`, `product`, `order`, `order_item`, `address`, `vpn_server`, `vpn_peer`, `payment` |
| `source_id` | `VARCHAR(255)` | `NOT NULL` | Legacy primary key |
| `target_id` | `UUID` | | Medusa v2 UUID |
| `content_hash` | `CHAR(64)` | `NOT NULL` | SHA-256 of canonicalized source row JSON |
| `status` | `VARCHAR(16)` | `NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','migrating','migrated','verified','failed','skipped'))` | |
| `error_message` | `TEXT` | | Failure reason |
| `source_data` | `JSONB` | | Snapshot of source row (for verification / rollback) |
| `dry_run_result` | `JSONB` | | Output from dry-run mode (no actual write) |
| `migrated_at` | `TIMESTAMPTZ` | | |
| `verified_at` | `TIMESTAMPTZ` | | |
| `verification_diff` | `JSONB` | | Diff between source snapshot and target readback |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `migration_journal_pkey` | `id` | UNIQUE (PK) | |
| `migration_journal_source_key` | `entity_type, source_id` | UNIQUE | Deduplication |
| `migration_journal_target_idx` | `entity_type, target_id` WHERE `target_id IS NOT NULL` | btree (partial) | Target lookup |
| `migration_journal_status_idx` | `status, entity_type` | btree | Progress tracking |
| `migration_journal_content_hash_idx` | `content_hash` | btree | Integrity verification |

**RLS Policy**: Operator-only.

```sql
CREATE POLICY migration_journal_operator_only ON undrlla.migration_journal
  FOR ALL USING (
    current_setting('app.is_operator', true)::BOOLEAN = true
  );
```

**Migration notes**: This IS the migration tool's state. Populated during Phase 4 cutover. Supports three modes:
- **dry-run**: writes to `dry_run_result`, does not create target entities
- **migrate**: writes target entities, records `target_id`
- **verify**: reads back target, compares to `source_data`, records `verification_diff`

Resumable: re-running picks up where `status = 'pending'` left off.

---

### Entity: `MigrationCheckpoint`

Snapshot of migration progress for resumability across runs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `run_id` | `VARCHAR(64)` | `NOT NULL` | Unique migration run identifier |
| `phase` | `VARCHAR(32)` | `NOT NULL` | `schema_export`, `customers`, `products`, `orders`, `payments`, `vpn`, `verification`, `complete` |
| `entity_type` | `VARCHAR(64)` | `NOT NULL` | |
| `last_source_id` | `VARCHAR(255)` | `NOT NULL` | Last successfully processed source ID |
| `total_count` | `INTEGER` | `NOT NULL DEFAULT 0` | Total entities in this phase |
| `processed_count` | `INTEGER` | `NOT NULL DEFAULT 0` | Entities processed so far |
| `failed_count` | `INTEGER` | `NOT NULL DEFAULT 0` | |
| `started_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `completed_at` | `TIMESTAMPTZ` | | |
| `metadata` | `JSONB` | | Run config, flags, etc. |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `migration_checkpoint_pkey` | `id` | UNIQUE (PK) | |
| `migration_checkpoint_run_phase_key` | `run_id, phase, entity_type` | UNIQUE | One checkpoint per phase per run |
| `migration_checkpoint_active_idx` | `run_id` WHERE `completed_at IS NULL` | btree (partial) | Find active runs |

**RLS Policy**: Operator-only.

**Migration notes**: Tooling-only table. Created at first migration run. Updated atomically per entity batch.

---

## Medusa Entity Extensions

These are **link tables** connecting Medusa's built-in entities to undrlla's custom tenant scope. Medusa v2's Module Link framework is used (not schema modification of Medusa's own tables).

### Entity: `CustomerTenantLink`

Links Medusa `customer` to undrlla `tenant`. Many-to-one (customer belongs to one tenant).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `tenant_id` | `UUID` | `NOT NULL REFERENCES undrlla.tenant(id)` | |
| `customer_id` | `UUID` | `NOT NULL REFERENCES public.customer(id)` | Medusa customer |
| `legacy_id` | `VARCHAR(255)` | | Legacy undrlla customer ID for migration tracing |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `customer_tenant_link_pkey` | `id` | UNIQUE (PK) | |
| `customer_tenant_link_customer_key` | `customer_id` | UNIQUE | 1 customer → 1 tenant |
| `customer_tenant_link_tenant_idx` | `tenant_id` | btree | Tenant's customers |
| `customer_tenant_link_legacy_idx` | `legacy_id` WHERE `legacy_id IS NOT NULL` | btree (partial) | Migration lookup |

**Migration notes**: Created during customer migration. `legacy_id` enables traceability back to the original `undrlla` customer table.

---

### Entity: `OrderTenantLink`

Links Medusa `order` to undrlla `tenant`.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `tenant_id` | `UUID` | `NOT NULL REFERENCES undrlla.tenant(id)` | |
| `order_id` | `UUID` | `NOT NULL REFERENCES public.order(id)` | Medusa order |
| `legacy_id` | `VARCHAR(255)` | | Legacy order ID |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `order_tenant_link_pkey` | `id` | UNIQUE (PK) | |
| `order_tenant_link_order_key` | `order_id` | UNIQUE | |
| `order_tenant_link_tenant_idx` | `tenant_id` | btree | |
| `order_tenant_link_legacy_idx` | `legacy_id` WHERE `legacy_id IS NOT NULL` | btree (partial) | Migration lookup |

---

### Entity: `PaymentTransaction`

Provider-agnostic payment record. Extends Medusa's `payment` with additional fields for crypto and manual payment reconciliation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `tenant_id` | `UUID` | `NOT NULL REFERENCES undrlla.tenant(id)` | |
| `medusa_payment_id` | `UUID` | `UNIQUE REFERENCES public.payment(id)` | Medusa payment |
| `order_id` | `UUID` | `NOT NULL REFERENCES public.order(id)` | |
| `provider` | `VARCHAR(32)` | `NOT NULL CHECK (provider IN ('stripe','paypal','btcpay','shkeeper','manual_bank'))` | |
| `provider_tx_id` | `VARCHAR(255)` | | Provider's transaction ID |
| `provider_session_id` | `VARCHAR(255)` | | Checkout / charge session ID |
| `amount` | `BIGINT` | `NOT NULL` | Amount in smallest currency unit (cents) |
| `currency_code` | `CHAR(3)` | `NOT NULL` | |
| `status` | `VARCHAR(32)` | `NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','captured','failed','refunded','partially_refunded','disputed','expired'))` | |
| `settlement_amount` | `BIGINT` | | Actual settled amount (may differ for crypto) |
| `settlement_currency` | `CHAR(3)` | | |
| `settlement_at` | `TIMESTAMPTZ` | | |
| `confirmation_code` | `VARCHAR(255)` | | Crypto tx hash, bank ref, etc. |
| `metadata` | `JSONB` | | Provider-specific data |
| `legacy_id` | `VARCHAR(255)` | | Legacy payment ID |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `payment_transaction_pkey` | `id` | UNIQUE (PK) | |
| `payment_transaction_medusa_key` | `medusa_payment_id` | UNIQUE | |
| `payment_transaction_order_idx` | `order_id, provider` | btree | Order payments |
| `payment_transaction_tenant_idx` | `tenant_id, created_at DESC` | btree | Tenant payment timeline |
| `payment_transaction_provider_tx_idx` | `provider, provider_tx_id` | btree | Provider reconciliation |
| `payment_transaction_status_idx` | `status, provider` | btree | Pending/failed payment sweep |
| `payment_transaction_legacy_idx` | `legacy_id` WHERE `legacy_id IS NOT NULL` | btree (partial) | Migration lookup |

**RLS Policy**:

```sql
CREATE POLICY payment_transaction_tenant_isolation ON undrlla.payment_transaction
  FOR ALL USING (
    tenant_id = current_setting('app.tenant_id')::UUID
  );
```

**Migration notes**: Import from legacy `payments` table. Map provider-specific statuses to unified enum. For crypto payments, populate `confirmation_code` with on-chain tx hash.

---

## Cross-Entity Relationship Map

```
┌─────────────────────────────────────────────────────────────────────┐
│  Medusa public schema                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐       │
│  │ customer │  │  order   │  │ product  │  │ sales_channel│       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘       │
│       │              │             │                │               │
└───────┼──────────────┼─────────────┼────────────────┼───────────────┘
        │              │             │                │
   ┌────┴────┐    ┌────┴────┐   ┌───┴───┐     ┌──────┴──────┐
   │ CustLink│    │ OrdLink │   │(via   │     │ tenant.     │
   └────┬────┘    └────┬────┘   │ SC)   │     │ sales_chan. │
        │              │        └───────┘     └──────┬──────┘
        │              │                              │
┌───────┼──────────────┼──────────────────────────────┼───────────────┐
│       │    undrlla schema                           │               │
│  ┌────▼──────────────────────┐              ┌───────▼───────┐       │
│  │        Tenant ◄───────────┼──────────────┤  BrandConfig  │       │
│  │  ┌─────────┐              │              └───────────────┘       │
│  │  │Workspace│              │                                      │
│  │  └─────────┘              │                                      │
│  └───┬───────┬──────┬────────┼──────┬───────────────┐              │
│      │       │      │        │      │               │              │
│  ┌───▼───┐┌──▼───┐┌─▼─────┐┌▼────┐┌▼────────────┐┌▼────────────┐  │
│  │CustLink││OrdLink││PayTxn ││AIEvt││AIKeyVault   ││AITierConfig │  │
│  └───┬───┘└──┬───┘└──┬────┘└─────┘└─────────────┘└─────────────┘  │
│      │       │       │                                              │
│      │       │  ┌────▼────────────────────────────────────┐         │
│      │       │  │           VPNPeer                        │         │
│      │       │  │  tenant_id, customer_id, order_id,       │         │
│      │       │  │  vpn_server_id, allocated_ip             │         │
│      │       │  └────┬─────────────────────────────┬──────┘         │
│      │       │       │                              │                │
│      │       │  ┌────▼─────────┐  ┌────────────────▼──────┐        │
│      │       │  │  VPNServer   │  │    VPNIPPool           │        │
│      │       │  │  (operator)  │  │  (atomic alloc)        │        │
│      │       │  └──────────────┘  └───────────────────────┘        │
│      │       │                                                      │
│  ┌───▼───────▼──────────────────────────────────────────────┐       │
│  │                  MigrationJournal                         │       │
│  │  entity_type, source_id → target_id, content_hash        │       │
│  └───────────────────────────────────────────────────────────┘       │
│  ┌───────────────────────────────────────────────────────────┐       │
│  │                  MigrationCheckpoint                       │       │
│  │  run_id, phase, last_source_id                            │       │
│  └───────────────────────────────────────────────────────────┘       │
│  ┌───────────────────────────────────────────────────────────┐       │
│  │  FederationInstance ──► FederationCatalogEntry             │       │
│  │  (public read, operator write)                             │       │
│  └───────────────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────────┘
```

### Foreign key summary

| Source Entity | FK Column | Target Entity | Target Column | Cardinality |
|---------------|-----------|---------------|---------------|-------------|
| Workspace | `tenant_id` | Tenant | `id` | N:1 |
| BrandConfig | `tenant_id` | Tenant | `id` | 1:1 |
| CustomerTenantLink | `tenant_id` | Tenant | `id` | N:1 |
| CustomerTenantLink | `customer_id` | Medusa customer | `id` | N:1 |
| OrderTenantLink | `tenant_id` | Tenant | `id` | N:1 |
| OrderTenantLink | `order_id` | Medusa order | `id` | N:1 |
| PaymentTransaction | `tenant_id` | Tenant | `id` | N:1 |
| PaymentTransaction | `order_id` | Medusa order | `id` | N:1 |
| VPNPeer | `tenant_id` | Tenant | `id` | N:1 |
| VPNPeer | `vpn_server_id` | VPNServer | `id` | N:1 |
| VPNPeer | `customer_id` | Medusa customer | `id` | N:1 |
| VPNPeer | `order_id` | Medusa order | `id` | N:1 |
| VPNIPPool | `vpn_server_id` | VPNServer | `id` | N:1 |
| VPNIPPool | `allocated_to_peer_id` | VPNPeer | `id` | 1:1 |
| AIUsageEvent | `tenant_id` | Tenant | `id` | N:1 |
| AIUsageEvent | `customer_id` | Medusa customer | `id` | N:1 |
| AIKeyVault | `tenant_id` | Tenant | `id` | 1:1 |
| AITierConfig | `tenant_id` | Tenant | `id` | 1:1 |
| FederationCatalogEntry | `instance_id` | FederationInstance | `id` | N:1 |

---

## Migration Strategy Notes

### Phase approach

| Phase | Entities | Direction | Notes |
|-------|----------|-----------|-------|
| 1 | Tenant, Workspace, BrandConfig | Manual seed | Create GLOBAL + EU tenants before any data migration |
| 2 | VPNServer, VPNIPPool | Legacy → v2 | Re-encrypt keys with new master; generate IP pools from CIDR |
| 3 | Customer → CustomerTenantLink | Legacy → v2 | Map legacy customer IDs; create Medusa customer + link row atomically |
| 4 | Product | Legacy → v2 | Map to Medusa Product + Variant; assign to tenant's Sales Channel |
| 5 | Order → OrderTenantLink | Legacy → v2 | Map to Medusa Order + Line Items; link to tenant + customer |
| 6 | PaymentTransaction | Legacy → v2 | Map per-provider; crypto tx hashes in `confirmation_code` |
| 7 | VPNPeer | Legacy → v2 | Re-link to new customer_id + order_id via MigrationJournal; verify IP uniqueness |
| 8 | Verification | Read-back | SHA-256 compare source_data vs target readback; log diffs |

### Dual-write window (FR-038)

During cutover, both legacy and v2 receive writes:

1. **Order placement**: Legacy creates order → migration tool mirrors to v2 → v2 also accepts direct orders
2. **VPN provisioning**: Legacy provisions → v2 VPNPeer row created from legacy event → v2 also provisions directly
3. **Reconciliation**: Scheduled job compares MigrationJournal `content_hash` vs live v2 data every 15 min

### Integrity verification (FR-004)

```
For each MigrationJournal row WHERE status = 'migrated':
  1. Read source_data from MigrationJournal
  2. Read target entity from v2 by target_id
  3. Canonicalize both to sorted JSON
  4. SHA-256 compare
  5. If mismatch: status = 'failed', verification_diff = json_diff
  6. If match: status = 'verified', verified_at = now()
```

### Rollback strategy

- MigrationJournal tracks every write with `source_data` snapshot
- Rollback = delete target entities in reverse order (VPNPeer → PaymentTransaction → Order → Customer → VPNServer)
- Legacy data is never modified — only read
- Post-rollback: legacy is still the source of truth

---

## Index Strategy Summary

### Total indexes by module

| Module | Tables | Indexes | Notes |
|--------|--------|---------|-------|
| TenantModule | 3 | 9 | BrandConfig is lightweight (1:1) |
| VPNModule | 3 | 15 | VPNIPPool has critical partial index for atomic allocation |
| AIMeteringModule | 3 | 12 | Heavy time-series indexing on AIUsageEvent |
| FederationModule | 2 | 7 | Catalog search uses GIN trigram |
| MigrationModule | 2 | 7 | Content hash index for integrity checks |
| Medusa Extensions | 3 | 13 | Legacy ID partial indexes for migration |
| **Total** | **16** | **63** | |

### Partial indexes (performance-critical)

| Table | Index | Purpose |
|-------|-------|---------|
| `vpn_ip_pool` | `WHERE allocated = false` | Atomic allocation — only scans free IPs |
| `vpn_peer` | `WHERE status = 'active'` | Expiration sweep skips revoked/expired |
| `ai_usage_event` | `WHERE ai_tier = 'paid'` | Billing aggregation skips dev/BYOK |
| `customer_tenant_link` | `WHERE legacy_id IS NOT NULL` | Migration lookup skips post-launch customers |
| `order_tenant_link` | `WHERE legacy_id IS NOT NULL` | Same |
| `payment_transaction` | `WHERE legacy_id IS NOT NULL` | Same |
| `migration_journal` | `WHERE target_id IS NOT NULL` | Target lookup skips pending rows |
| `migration_checkpoint` | `WHERE completed_at IS NULL` | Active run detection |

---

## RLS Policy Templates

All RLS policies use `current_setting('app.*')` set per-request by the application middleware.

### Session variables

| Variable | Type | Set by | Purpose |
|----------|------|--------|---------|
| `app.tenant_id` | `UUID` | Tenant resolution middleware | Tenant isolation |
| `app.is_operator` | `BOOLEAN` | Auth middleware (admin JWT) | Operator-only tables |
| `app.is_ai_service` | `BOOLEAN` | OmniRoute sidecar auth | Key vault access |

### Policy categories

| Category | Tables | Policy |
|----------|--------|--------|
| **Tenant-scoped** | Workspace, VPNPeer, AIUsageEvent, PaymentTransaction, CustomerTenantLink, OrderTenantLink | `tenant_id = current_setting('app.tenant_id')::UUID` |
| **Tenant-unique** | BrandConfig, AIKeyVault, AITierConfig | Same as tenant-scoped (1:1 with tenant) |
| **Operator-only** | VPNServer, VPNIPPool, MigrationJournal, MigrationCheckpoint | `current_setting('app.is_operator')::BOOLEAN = true` |
| **Restricted** | AIKeyVault | `is_ai_service = true AND tenant_id matches` |
| **Public read** | FederationInstance (selected cols), FederationCatalogEntry | `SELECT USING (true)` for listed entries |
| **Operator write** | FederationInstance, FederationCatalogEntry | `is_operator = true` |

### Enable RLS on all tables

```sql
-- Run once per table in undrlla schema
ALTER TABLE undrlla.tenant ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.workspace ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.brand_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.vpn_server ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.vpn_peer ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.vpn_ip_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.ai_usage_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.ai_key_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.ai_tier_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.federation_instance ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.federation_catalog_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.migration_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.migration_checkpoint ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.customer_tenant_link ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.order_tenant_link ENABLE ROW LEVEL SECURITY;
ALTER TABLE undrlla.payment_transaction ENABLE ROW LEVEL SECURITY;
```

### Defense-in-depth

RLS is the **second** line of defense. The **first** is the Prisma Client extension that injects `tenant_id` into every query (see [Prisma Tenant Enforcement Pattern](#prisma-tenant-enforcement-pattern)). If either layer fails, the other still protects. A malicious authenticated request from tenant A attempting tenant B's data fails with **404** (not 403) so entity existence is not leaked (Edge Case: Tenant-scope leak attempt).

---

*Document generated: 2026-05-24 | Spec ref: `specs/001-init/spec.md` | Decisions: `specs/001-init/decisions/`*
