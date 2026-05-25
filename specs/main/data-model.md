# Data Model: undrlla v2 — Medusa Migration (DML)

**Spec**: `specs/001-init/spec.md` | **Date**: 2026-05-25 | **Status**: Phase 1 design — Dual-ORM

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture: Dual-ORM](#architecture-dual-orm)
3. [Schema Conventions](#schema-conventions)
4. [Tenant Enforcement Pattern](#tenant-enforcement-pattern)
5. [Module: TenantModule (DML)](#module-tenantmodule-dml)
6. [Module: VPNModule (DML)](#module-vpnmodule-dml)
7. [Module: AIMeteringModule (DML)](#module-aimeteringmodule-dml)
8. [Module: FederationModule (DML)](#module-federationmodule-dml)
9. [Module: PaymentBTCPayModule (DML)](#module-paymentbtcpaymodule-dml)
10. [Standalone: MigrationTool (Prisma)](#standalone-migrationtool-prisma)
11. [Medusa Entity Extensions (Links)](#medusa-entity-extensions-links)
12. [Cross-Entity Relationship Map](#cross-entity-relationship-map)
13. [Migration Strategy Notes](#migration-strategy-notes)
14. [Index Strategy Summary](#index-strategy-summary)
15. [RLS Policy Templates](#rls-policy-templates)

---

## Overview

undrlla v2 extends Medusa v2's `public` schema with a custom `undrlla` schema containing all domain-specific entities. Medusa provides catalog, cart, order, inventory, fulfillment, returns, and payment primitives out of the box. This document defines everything **beyond** Medusa's built-in models.

### Custom modules (Medusa DML — MikroORM)

| Module | Custom Entities | Location | Medusa Extension Points |
|--------|----------------|----------|------------------------|
| **TenantModule** | `Tenant`, `Workspace`, `BrandConfig` | `apps/medusa/src/modules/tenant/` | Sales Channel binding, Region |
| **VPNModule** | `VPNServer`, `VPNPeer`, `VPNIPPool` | `apps/medusa/src/modules/vpn/` | Fulfillment workflow hook |
| **AIMeteringModule** | `AIUsageEvent`, `AIKeyVault`, `AITierConfig` | `apps/medusa/src/modules/ai-metering/` | — (sidecar integration) |
| **FederationModule** | `FederationInstance`, `FederationCatalogEntry` | `apps/medusa/src/modules/federation/` | — (future) |
| **PaymentBTCPayModule** | `PaymentTransaction` | `apps/medusa/src/modules/payment-btcpay/` | Extends Medusa Payment module |

### Standalone packages (Prisma)

| Package | Entities | Location |
|---------|----------|----------|
| **migration-tool** | `MigrationJournal`, `MigrationCheckpoint` | `packages/migration-tool/prisma/schema.prisma` |

### Entity classification

| Type | Count | Examples |
|------|-------|---------|
| **Pure custom** (DML, no Medusa base) | 12 | Tenant, VPNServer, AIUsageEvent, AIKeyVault, FederationInstance |
| **Medusa-extended** (link table + custom fields) | 3 | Product ↔ Tenant, Order ↔ Tenant, Customer ↔ Tenant |
| **Config/enumeration** | 2 | BrandConfig, AITierConfig |

---

## Architecture: Dual-ORM

```
┌─────────────────────────────────────────────────────────────────┐
│                    Medusa v2 Application                        │
│                                                                 │
│  Custom Modules (DML → MikroORM)          Medusa Core           │
│  ┌─────────────────────────┐             ┌──────────┐          │
│  │ TenantModule            │             │ Customer │          │
│  │ VPNModule               │             │ Order    │          │
│  │ AIMeteringModule        │             │ Product  │          │
│  │ FederationModule        │             │ Payment  │          │
│  │ PaymentBTCPayModule     │             └──────────┘          │
│  └───────────┬─────────────┘                                   │
│              │ medusa db:migrate                                │
│              ▼                                                  │
│         PostgreSQL (undrlla schema)                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               Standalone Packages                               │
│                                                                 │
│  migration-tool (Prisma)                                        │
│  ┌─────────────────────────┐                                    │
│  │ schema.prisma            │                                    │
│  │ → prisma migrate deploy │                                    │
│  └───────────┬─────────────┘                                    │
│              ▼                                                  │
│         PostgreSQL (public / undrlla schema)                    │
└─────────────────────────────────────────────────────────────────┘
```

### Key rule

- **Inside `apps/medusa/src/modules/`**: DML only. No Prisma. No raw SQL schema definitions. Migrations managed by `medusa db:migrate`.
- **Inside `packages/migration-tool/`**: Prisma. Independent schema, independent migration lifecycle.
- **Tenant middleware**: MikroORM subscriber for modules, Prisma extension for standalone packages. Both backed by Postgres RLS.

---

## Schema Conventions

### Naming

| Convention | Example |
|------------|---------|
| Schema: `undrlla` | `undrlla.tenant`, `undrlla.vpn_server` |
| Table names: `snake_case` | `ai_usage_event`, `vpn_ip_pool` |
| DML model names: `snake_case` (first arg to `model.define`) | `model.define("tenant", {...})` |
| Column names: `snake_case` | `tenant_id`, `allocated_at` |
| Primary key: `id` (UUID v4) | `model.id().primaryKey()` |
| Foreign keys: `<entity>_id` | `tenant_id`, `vpn_server_id`, `customer_id` |
| Timestamps: `created_at`, `updated_at`, `deleted_at` | Auto-managed by Medusa DML |
| Boolean flags: `is_<adjective>` or `<verb>_ed` | `is_active`, `allocated` |

### Shared columns (every customer-scoped table)

```typescript
tenant_id: model.text().index("IDX_<TABLE>_TENANT"),
```

Medusa DML auto-manages `id`, `created_at`, `updated_at`, `deleted_at`. These do NOT need explicit definition.

### Data types

| Domain | DML Type | Postgres Type | Rationale |
|--------|----------|--------------|-----------|
| UUID PK | `model.id().primaryKey()` | `UUID` | Native indexing, no collision |
| Text | `model.text()` | `TEXT` / `VARCHAR` | DML maps to TEXT by default |
| Number | `model.number()` | `INTEGER` / `BIGINT` | Use `.nullable()` where needed |
| Boolean | `model.boolean()` | `BOOLEAN` | |
| Enum | `model.enum([...])` | `TEXT` + CHECK | Medusa convention |
| JSON | `model.json()` | `JSONB` | Indexable, schema-flexible |
| Encrypted | `model.text()` (store base64) | `TEXT` | AES-256-GCM ciphertext encoded |
| Timestamp | `model.date()` | `TIMESTAMPTZ` | |

### DML relationship types

| Relationship | DML | Example |
|-------------|-----|---------|
| BelongsTo | `model.belongsTo(() => Entity, { mappedBy: "field" })` | Workspace → Tenant |
| HasMany | `model.hasMany(() => Entity, { mappedBy: "field" })` | Tenant → Workspaces |
| HasOne | `model.hasOne(() => Entity, { mappedBy: "field" })` | Tenant → BrandConfig |
| ManyToMany | `model.manyToMany(() => Entity, { mappedBy: "field" })` | Not used in v1 |

### Encryption (AES-256-GCM)

Applied to: `AIKeyVault.encrypted_key`, `VPNServer.wg_private_key_enc`, secrets in `BrandConfig.payment_config`.

Storage format per column:

```
[32-byte nonce] [16-byte auth tag] [N-byte ciphertext]
```

All stored as base64-encoded TEXT (DML `model.text()`). Decryption key is sourced from `ENCRYPTION_MASTER_KEY` env var (split via Shamir secret sharing in production). Never logged, never serialized in API responses, never cached in plaintext.

### File structure per module

```
apps/medusa/src/modules/<module-name>/
├── models/
│   ├── tenant.ts              # DML entity
│   ├── workspace.ts           # DML entity
│   ├── brand-config.ts        # DML entity
│   └── index.ts               # re-exports
├── services/
│   └── tenant-service.ts      # extends MedusaService
├── index.ts                   # ModuleDefinition
└── __tests__/
```

---

## Tenant Enforcement Pattern

Three layers of defense — ORM subscriber, Prisma extension, and Postgres RLS.

### Layer 1: MikroORM Subscriber (Medusa Modules)

For all DML-based modules inside Medusa. Hooks into MikroORM lifecycle events to inject and protect `tenant_id`.

```typescript
// packages/tenant-middleware/src/mikro-orm-tenant-subscriber.ts
import { EventSubscriber, EntityName } from "@medusajs/framework/mikro-orm/knex"

@EventSubscriber()
export class TenantSubscriber {
  getSubscribedEntities(): EntityName<any>[] {
    return [] // auto-detects tenant-scoped entities via metadata
  }

  beforeInsert(args: any): void {
    if (args.entity.tenant_id === undefined) {
      const tenantId = getCurrentTenantId()
      if (tenantId) args.entity.tenant_id = tenantId
    }
  }

  beforeUpdate(args: any): void {
    if (args.entity.tenant_id !== undefined) {
      const original = args.changeSet?.originalEntity?.tenant_id
      if (original && args.entity.tenant_id !== original) {
        throw new Error("tenant_id mutation is not allowed")
      }
    }
  }

  beforeFind(args: any): void {
    const tenantId = getCurrentTenantId()
    if (tenantId && hasTenantColumn(args.metadata)) {
      args.filters ??= {}
      args.filters.tenant_id = tenantId
    }
  }

  beforeDelete(args: any): void {
    const tenantId = getCurrentTenantId()
    if (tenantId && hasTenantColumn(args.metadata)) {
      args.filters ??= {}
      args.filters.tenant_id = tenantId
    }
  }
}

const tenantContext = new AsyncLocalStorage<string>()

export function setTenantId(id: string): void {
  tenantContext.enterWith(id)
}

export function getCurrentTenantId(): string | undefined {
  return tenantContext.getStore()
}

function hasTenantColumn(metadata: any): boolean {
  return metadata?.properties?.tenant_id !== undefined
}
```

### Layer 2: Prisma Client Extension (Standalone Packages)

For packages that run outside Medusa and use Prisma directly (migration-tool, etc.).

```typescript
// packages/tenant-middleware/src/prisma-tenant-extension.ts
import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient().$extends({
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

### Layer 3: Postgres RLS

Defense-in-depth regardless of ORM. See [RLS Policy Templates](#rls-policy-templates).

---

## Module: TenantModule (DML)

**Location**: `apps/medusa/src/modules/tenant/`

### Entity: `Tenant`

Workspace boundary. Represents a region (GLOBAL / EU) or B2B reseller / white-label operator. Owns branding, payment config, AI tier, and Sales Channel binding.

```typescript
// apps/medusa/src/modules/tenant/models/tenant.ts
import { model } from "@medusajs/framework/utils"
import Workspace from "./workspace"
import BrandConfig from "./brand-config"

const Tenant = model.define("tenant", {
  slug: model.text().unique("IDX_TENANT_SLUG"),
  name: model.text(),
  sales_channel_id: model.text().nullable(),
  default_currency: model.text().default("USD"),
  region: model.enum(["GLOBAL", "EU"]).default("GLOBAL"),
  ai_tier: model.enum(["dev", "paid", "byok"]).default("dev"),
  status: model.enum(["active", "suspended", "migrated"]).default("active"),
  settings: model.json().default({}),
  workspaces: model.hasMany(() => Workspace, { mappedBy: "tenant" }),
  brand_config: model.hasOne(() => BrandConfig, { mappedBy: "tenant" }),
}).indexes([
  { on: ["slug"], unique: true },
  { on: ["region", "status"] },
])

export default Tenant
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_TENANT_SLUG` | `slug` | UNIQUE | Lookup by slug |
| `IDX_TENANT_REGION_STATUS` | `region, status` | btree | Region-scoped queries |

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

```typescript
// apps/medusa/src/modules/tenant/models/workspace.ts
import { model } from "@medusajs/framework/utils"
import Tenant from "./tenant"

const Workspace = model.define("workspace", {
  tenant_id: model.text().index("IDX_WORKSPACE_TENANT"),
  tenant: model.belongsTo(() => Tenant, { mappedBy: "workspaces" }),
  name: model.text(),
  slug: model.text().unique("IDX_WORKSPACE_SLUG"),
  domain: model.text().nullable().unique("IDX_WORKSPACE_DOMAIN"),
  subdomain: model.text().nullable().unique("IDX_WORKSPACE_SUBDOMAIN"),
  path_prefix: model.text().nullable(),
  branding_id: model.text().nullable(),
  is_default: model.boolean().default(false),
  settings: model.json().default({}),
}).indexes([
  { on: ["slug"], unique: true },
  { on: ["domain"] },
  { on: ["subdomain"] },
  { on: ["tenant_id"] },
])

export default Workspace
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_WORKSPACE_SLUG` | `slug` | UNIQUE | |
| `IDX_WORKSPACE_DOMAIN` | `domain` | UNIQUE (partial, WHERE domain IS NOT NULL) | Custom domain routing |
| `IDX_WORKSPACE_SUBDOMAIN` | `subdomain` | UNIQUE (partial, WHERE subdomain IS NOT NULL) | Subdomain routing |
| `IDX_WORKSPACE_TENANT` | `tenant_id` | btree | Tenant → Workspaces |

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

```typescript
// apps/medusa/src/modules/tenant/models/brand-config.ts
import { model } from "@medusajs/framework/utils"
import Tenant from "./tenant"

const BrandConfig = model.define("brand_config", {
  tenant_id: model.text().unique("IDX_BRAND_CONFIG_TENANT"),
  tenant: model.belongsTo(() => Tenant, { mappedBy: "brand_config" }),
  logo_url: model.text().nullable(),
  primary_color: model.text().nullable(),
  secondary_color: model.text().nullable(),
  font_family: model.text().nullable(),
  custom_css: model.text().nullable(),
  favicon_url: model.text().nullable(),
  payment_config: model.json().default({}),
  social_links: model.json().default({}),
  legal_links: model.json().default({}),
}).indexes([
  { on: ["tenant_id"], unique: true },
])

export default BrandConfig
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_BRAND_CONFIG_TENANT` | `tenant_id` | UNIQUE | 1:1 with Tenant |

**Migration notes**: Extract branding from legacy `undrlla` Next.js `site.config.ts`. Payment credentials from legacy `.env` — re-encrypt with AES-256-GCM before inserting.

---

### Module definition

```typescript
// apps/medusa/src/modules/tenant/index.ts
import TenantModule from "./models"
import TenantService from "./services/tenant-service"
import { ModuleDefinition } from "@medusajs/framework/types"

const TenantModuleDef: ModuleDefinition = {
  key: "tenant",
  label: "Tenant",
  defaultService: TenantService,
  models: TenantModule,
}

export default TenantModuleDef
```

---

## Module: VPNModule (DML)

**Location**: `apps/medusa/src/modules/vpn/`

### Entity: `VPNServer`

Physical/virtual server running WireGuard / AmneziaWG / Xray. Hosted exclusively on centralized hardened infrastructure (FR-019). Never on Akash. **No tenant_id — operator-scoped.**

```typescript
// apps/medusa/src/modules/vpn/models/vpn-server.ts
import { model } from "@medusajs/framework/utils"
import VPNPeer from "./vpn-peer"
import VPNIPPool from "./vpn-ip-pool"

const VPNServer = model.define("vpn_server", {
  name: model.text(),
  hostname: model.text().unique("IDX_VPN_SERVER_HOSTNAME"),
  ssh_port: model.number().default(22),
  public_ip: model.text(),
  wg_port: model.number().default(51820),
  xray_port: model.number().nullable(),
  protocol: model.enum(["wireguard", "amneziawg", "xray", "multi"]).default("wireguard"),
  wg_public_key: model.text(),
  wg_private_key_enc: model.text(),
  location_city: model.text().nullable(),
  location_country: model.text().nullable(),
  location_lat: model.number().nullable(),
  location_lon: model.number().nullable(),
  max_peers: model.number().default(100),
  active_peers: model.number().default(0),
  is_active: model.boolean().default(true),
  health_status: model.enum(["healthy", "degraded", "down", "unknown"]).default("unknown"),
  health_checked_at: model.date().nullable(),
  metadata: model.json().default({}),
  peers: model.hasMany(() => VPNPeer, { mappedBy: "server" }),
  ip_pool: model.hasMany(() => VPNIPPool, { mappedBy: "server" }),
}).indexes([
  { on: ["hostname"], unique: true },
  { on: ["public_ip"] },
  { on: ["location_country", "location_city"] },
  { on: ["is_active", "active_peers", "max_peers"] },
  { on: ["health_status", "health_checked_at"] },
])

export default VPNServer
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_VPN_SERVER_HOSTNAME` | `hostname` | UNIQUE | |
| `IDX_VPN_SERVER_PUBLIC_IP` | `public_ip` | btree | |
| `IDX_VPN_SERVER_LOCATION` | `location_country, location_city` | btree | Geo-filtered listing |
| `IDX_VPN_SERVER_CAPACITY` | `is_active, active_peers, max_peers` | btree | Capacity-aware peer allocation |
| `IDX_VPN_SERVER_HEALTH` | `health_status, health_checked_at` | btree | Monitoring queries |

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

```typescript
// apps/medusa/src/modules/vpn/models/vpn-peer.ts
import { model } from "@medusajs/framework/utils"
import VPNServer from "./vpn-server"

const VPNPeer = model.define("vpn_peer", {
  tenant_id: model.text().index("IDX_VPN_PEER_TENANT"),
  server_id: model.text().index("IDX_VPN_PEER_SERVER"),
  server: model.belongsTo(() => VPNServer, { mappedBy: "peers" }),
  customer_id: model.text().nullable(),
  order_id: model.text().nullable(),
  allocated_ip: model.text(),
  public_key: model.text().unique("IDX_VPN_PEER_PUBKEY"),
  preshared_key_enc: model.text().nullable(),
  protocol: model.enum(["wireguard", "amneziawg", "xray"]).default("wireguard"),
  config_ref: model.text().nullable(),
  status: model.enum(["provisioning", "active", "suspended", "revoked", "expired"]).default("active"),
  expires_at: model.date().nullable(),
  last_connected_at: model.date().nullable(),
  data_usage_bytes: model.number().default(0),
  metadata: model.json().default({}),
}).indexes([
  { on: ["tenant_id", "server_id"] },
  { on: ["customer_id"] },
  { on: ["order_id"] },
  { on: ["public_key"], unique: true },
  { on: ["server_id", "allocated_ip"], unique: true },
  { on: ["status", "expires_at"] },
])

export default VPNPeer
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_VPN_PEER_TENANT` | `tenant_id` | btree | Tenant scoping |
| `IDX_VPN_PEER_SERVER` | `server_id` | btree | Server's peers |
| `IDX_VPN_PEER_TENANT_SERVER` | `tenant_id, server_id` | btree | Tenant's peers on a server |
| `IDX_VPN_PEER_CUSTOMER` | `customer_id` | btree | Customer's peers |
| `IDX_VPN_PEER_ORDER` | `order_id` | btree | Order → peers |
| `IDX_VPN_PEER_PUBKEY` | `public_key` | UNIQUE | Prevent duplicate key assignment |
| `IDX_VPN_PEER_ALLOCATED_IP` | `server_id, allocated_ip` | UNIQUE | Prevent duplicate IP assignment |
| `IDX_VPN_PEER_STATUS_EXPIRES` | `status, expires_at` | btree | Active/expiring peer queries |

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

```typescript
// apps/medusa/src/modules/vpn/models/vpn-ip-pool.ts
import { model } from "@medusajs/framework/utils"
import VPNServer from "./vpn-server"

const VPNIPPool = model.define("vpn_ip_pool", {
  server_id: model.text().index("IDX_VPN_IP_POOL_SERVER"),
  server: model.belongsTo(() => VPNServer, { mappedBy: "ip_pool" }),
  ip_address: model.text(),
  subnet_mask: model.text().nullable(),
  gateway_ip: model.text().nullable(),
  allocated: model.boolean().default(false),
  allocated_to_peer_id: model.text().nullable(),
  allocated_at: model.date().nullable(),
}).indexes([
  { on: ["server_id", "ip_address"], unique: true },
  { on: ["allocated_to_peer_id"] },
])

export default VPNIPPool
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_VPN_IP_POOL_SERVER` | `server_id` | btree | |
| `IDX_VPN_IP_POOL_SERVER_IP` | `server_id, ip_address` | UNIQUE | One IP per server |
| `IDX_VPN_IP_POOL_PEER` | `allocated_to_peer_id` | btree | Reverse lookup |

**Atomic allocation query** (raw SQL — not expressible in DML):

```sql
UPDATE undrlla.vpn_ip_pool
SET allocated = true,
    allocated_to_peer_id = $peer_id,
    allocated_at = now()
WHERE id = (
    SELECT id FROM undrlla.vpn_ip_pool
    WHERE server_id = $server_id
      AND allocated = false
    ORDER BY ip_address
    LIMIT 1
    FOR UPDATE SKIP LOCKED
)
RETURNING ip_address;
```

`FOR UPDATE SKIP LOCKED` prevents race conditions when two concurrent orders request from the same pool (Edge Case: VPN peer creation race condition).

> **Note**: This raw SQL query runs via MikroORM's `em.execute()` or Medusa's `Query` tool — DML does not cover atomic `UPDATE ... RETURNING` patterns.

**RLS Policy**: Operator-only, same as VPNServer.

**Migration notes**: Generate from legacy server subnet definitions. One row per IP in each server's CIDR range. Mark currently-allocated IPs from legacy peer data.

---

## Module: AIMeteringModule (DML)

**Location**: `apps/medusa/src/modules/ai-metering/`

### Entity: `AIUsageEvent`

Metered event from OmniRoute. Every AI request produces one row (FR-012).

```typescript
// apps/medusa/src/modules/ai-metering/models/ai-usage-event.ts
import { model } from "@medusajs/framework/utils"

const AIUsageEvent = model.define("ai_usage_event", {
  tenant_id: model.text().index("IDX_AI_USAGE_TENANT"),
  customer_id: model.text().nullable(),
  session_id: model.text().nullable(),
  request_id: model.text().unique("IDX_AI_USAGE_REQUEST"),
  use_case: model.text(),
  ai_tier: model.enum(["dev", "paid", "byok"]),
  provider: model.text(),
  model: model.text(),
  prompt_tokens: model.number().default(0),
  completion_tokens: model.number().default(0),
  total_tokens: model.number().default(0),
  cost_usd: model.number().default(0),
  latency_ms: model.number().nullable(),
  is_success: model.boolean().default(true),
  error_code: model.text().nullable(),
  langfuse_trace_id: model.text().nullable(),
  metadata: model.json().default({}),
}).indexes([
  { on: ["tenant_id", "created_at"] },
  { on: ["customer_id", "created_at"] },
  { on: ["request_id"], unique: true },
  { on: ["tenant_id", "use_case", "created_at"] },
  { on: ["tenant_id", "ai_tier", "created_at"] },
  { on: ["provider", "model", "created_at"] },
  { on: ["langfuse_trace_id"] },
])

export default AIUsageEvent
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_AI_USAGE_TENANT` | `tenant_id` | btree | Tenant scoping |
| `IDX_AI_USAGE_TENANT_TIME` | `tenant_id, created_at DESC` | btree | Per-tenant usage timeline |
| `IDX_AI_USAGE_CUSTOMER` | `customer_id, created_at DESC` | btree | Per-customer usage |
| `IDX_AI_USAGE_REQUEST` | `request_id` | UNIQUE | Deduplication |
| `IDX_AI_USAGE_USE_CASE` | `tenant_id, use_case, created_at DESC` | btree | Use-case analytics |
| `IDX_AI_USAGE_BILLING` | `tenant_id, ai_tier, created_at` | btree | Billing aggregation |
| `IDX_AI_USAGE_MODEL` | `provider, model, created_at DESC` | btree | Model usage analytics |
| `IDX_AI_USAGE_LANGFUSE` | `langfuse_trace_id` | btree | Trace correlation |

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

```typescript
// apps/medusa/src/modules/ai-metering/models/ai-key-vault.ts
import { model } from "@medusajs/framework/utils"

const AIKeyVault = model.define("ai_key_vault", {
  tenant_id: model.text().unique("IDX_AI_KEY_VAULT_TENANT"),
  encrypted_key: model.text(),
  key_nonce: model.text(),
  provider: model.enum(["openai", "anthropic", "openrouter", "ollama"]),
  key_alias: model.text().nullable(),
  key_prefix: model.text(),
  validation_status: model.enum(["valid", "invalid", "unverified"]).default("unverified"),
  last_validated_at: model.date().nullable(),
  routing_rules: model.json().default({}),
}).indexes([
  { on: ["tenant_id"], unique: true },
])

export default AIKeyVault
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_AI_KEY_VAULT_TENANT` | `tenant_id` | UNIQUE | 1 vault per tenant |

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

```typescript
// apps/medusa/src/modules/ai-metering/models/ai-tier-config.ts
import { model } from "@medusajs/framework/utils"

const AITierConfig = model.define("ai_tier_config", {
  tenant_id: model.text().unique("IDX_AI_TIER_CONFIG_TENANT"),
  tier: model.enum(["dev", "paid", "byok"]),
  monthly_token_limit: model.number().default(1000000),
  monthly_cost_limit_usd: model.number().default(100000000),
  cost_alert_threshold_pct: model.number().default(80),
  default_provider: model.text().default("openai"),
  default_model: model.text().default("gpt-4o-mini"),
  fallback_provider: model.text().nullable(),
  fallback_model: model.text().nullable(),
  allowed_models: model.json().default([]),
  routing_rules: model.json().default({}),
}).indexes([
  { on: ["tenant_id"], unique: true },
])

export default AITierConfig
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_AI_TIER_CONFIG_TENANT` | `tenant_id` | UNIQUE | 1 config per tenant |

**Migration notes**: New entity. Seed defaults for GLOBAL and EU tenants during install.

### Entity: `metering_dead_letter`

Dead-letter storage for metering events that failed remote emission after retry exhaustion. RLS by `tenant_id`.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|----------|
| `event_id` | UUID | PK | Unique event identifier |
| `tenant_id` | UUID | FK → Tenant | Tenant isolation |
| `customer_id` | UUID | FK → Customer | Customer attribution |
| `event_payload` | JSONB | NOT NULL | Original metering event data |
| `original_emit_at` | TIMESTAMPTZ | NOT NULL | When emission was first attempted |
| `last_retry_at` | TIMESTAMPTZ | NOT NULL | Most recent retry timestamp |
| `retry_count` | INTEGER | NOT NULL DEFAULT 0 | Number of retry attempts |
| `failure_reason` | TEXT | NOT NULL | Error message from last failed attempt |
| `operator_resolved_at` | TIMESTAMPTZ | | When ops resolved this entry (nullable) |
| `operator_id` | UUID | FK → Operator (nullable) | Who resolved |

**Index**: `(operator_resolved_at IS NULL, original_emit_at)` for ops dashboard — partial index on unresolved events sorted by age.

**RLS Policy**: tenant-scoped read; operator-scoped write (resolve).

### Entity: `product_embeddings`

Product description embeddings for PC-builder RAG retrieval. pgvector extension required on hot-core Postgres.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|----------|
| `product_id` | UUID | PK, FK → Product | Embedded product |
| `embedding` | VECTOR(1536) | NOT NULL | text-embedding-3-small output |
| `model_version` | TEXT | NOT NULL | Embedding model identifier for re-embed detection |
| `embedded_at` | TIMESTAMPTZ | NOT NULL | Last embedding timestamp |

**Index**: IVFFlat index on `embedding` column with `lists = 100` (pgvector). Re-index when product count changes significantly.

---

## Module: FederationModule (DML)

**Location**: `apps/medusa/src/modules/federation/`

### Entity: `FederationInstance`

Registered third-party-operated undrlla instance. Metadata only — no shared state (FR-034, future). **No tenant_id — public-read.**

```typescript
// apps/medusa/src/modules/federation/models/federation-instance.ts
import { model } from "@medusajs/framework/utils"
import FederationCatalogEntry from "./federation-catalog-entry"

const FederationInstance = model.define("federation_instance", {
  instance_id: model.text().unique("IDX_FED_INSTANCE_ID"),
  name: model.text(),
  url: model.text().unique("IDX_FED_INSTANCE_URL"),
  pubkey: model.text().nullable(),
  operator_email: model.text(),
  version: model.text().nullable(),
  region: model.text().nullable(),
  jurisdiction: model.text().nullable(),
  is_listed: model.boolean().default(false),
  is_verified: model.boolean().default(false),
  health_url: model.text().nullable(),
  health_status: model.enum(["healthy", "degraded", "down", "unknown"]).default("unknown"),
  last_seen_at: model.date().nullable(),
  metadata: model.json().default({}),
  catalog_entries: model.hasMany(() => FederationCatalogEntry, { mappedBy: "instance" }),
}).indexes([
  { on: ["instance_id"], unique: true },
  { on: ["url"], unique: true },
  { on: ["is_listed", "is_verified", "region"] },
  { on: ["health_status", "last_seen_at"] },
])

export default FederationInstance
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_FED_INSTANCE_ID` | `instance_id` | UNIQUE | |
| `IDX_FED_INSTANCE_URL` | `url` | UNIQUE | |
| `IDX_FED_INSTANCE_LISTED` | `is_listed, is_verified, region` | btree | Public catalog query |
| `IDX_FED_INSTANCE_HEALTH` | `health_status, last_seen_at` | btree | Staleness detection |

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

```typescript
// apps/medusa/src/modules/federation/models/federation-catalog-entry.ts
import { model } from "@medusajs/framework/utils"
import FederationInstance from "./federation-instance"

const FederationCatalogEntry = model.define("federation_catalog_entry", {
  instance_id: model.text().index("IDX_FED_CATALOG_INSTANCE"),
  instance: model.belongsTo(() => FederationInstance, { mappedBy: "catalog_entries" }),
  vpn_type: model.text().nullable(),
  name: model.text(),
  description: model.text().nullable(),
  pricing: model.json().default({}),
  availability: model.json().default({}),
}).indexes([
  { on: ["instance_id", "name"] },
])

export default FederationCatalogEntry
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_FED_CATALOG_INSTANCE` | `instance_id` | btree | |
| `IDX_FED_CATALOG_INSTANCE_NAME` | `instance_id, name` | btree | |

**RLS Policy**: Public read, operator write (same as FederationInstance).

**Migration notes**: New entity. Deferred to Phase 5+.

---

## Module: PaymentBTCPayModule (DML)

**Location**: `apps/medusa/src/modules/payment-btcpay/`

Extends Medusa's Payment module with BTCPay Server integration and a provider-agnostic payment record for crypto and manual payment reconciliation.

### Entity: `PaymentTransaction`

```typescript
// apps/medusa/src/modules/payment-btcpay/models/payment-transaction.ts
import { model } from "@medusajs/framework/utils"

const PaymentTransaction = model.define("payment_transaction", {
  tenant_id: model.text().index("IDX_PAY_TX_TENANT"),
  medusa_payment_id: model.text().nullable().unique("IDX_PAY_TX_MEDUSA"),
  order_id: model.text(),
  provider: model.enum(["stripe", "paypal", "btcpay", "shkeeper", "manual_bank"]),
  provider_tx_id: model.text().nullable(),
  provider_session_id: model.text().nullable(),
  amount: model.number(),
  currency_code: model.text().default("USD"),
  status: model.enum([
    "pending", "processing", "captured", "failed",
    "refunded", "partially_refunded", "disputed", "expired",
  ]).default("pending"),
  settlement_amount: model.number().nullable(),
  settlement_currency: model.text().nullable(),
  settlement_at: model.date().nullable(),
  confirmation_code: model.text().nullable(),
  legacy_id: model.text().nullable(),
  metadata: model.json().default({}),
}).indexes([
  { on: ["medusa_payment_id"], unique: true },
  { on: ["order_id", "provider"] },
  { on: ["tenant_id", "created_at"] },
  { on: ["provider", "provider_tx_id"] },
  { on: ["status", "provider"] },
])

export default PaymentTransaction
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_PAY_TX_TENANT` | `tenant_id` | btree | Tenant scoping |
| `IDX_PAY_TX_MEDUSA` | `medusa_payment_id` | UNIQUE | Medusa payment link |
| `IDX_PAY_TX_ORDER` | `order_id, provider` | btree | Order payments |
| `IDX_PAY_TX_TENANT_TIME` | `tenant_id, created_at DESC` | btree | Tenant payment timeline |
| `IDX_PAY_TX_PROVIDER` | `provider, provider_tx_id` | btree | Provider reconciliation |
| `IDX_PAY_TX_STATUS` | `status, provider` | btree | Pending/failed payment sweep |

**RLS Policy**:

```sql
CREATE POLICY payment_transaction_tenant_isolation ON undrlla.payment_transaction
  FOR ALL USING (
    tenant_id = current_setting('app.tenant_id')::UUID
  );
```

**Migration notes**: Import from legacy `payments` table. Map provider-specific statuses to unified enum. For crypto payments, populate `confirmation_code` with on-chain tx hash. Legacy SHKeeper transactions use `provider = 'shkeeper'` (no new enum value) with `metadata.legacy = true` and `metadata.migration_source = 'v1-shkeeper-export'` marking them as read-only historical data.

---

## Standalone: MigrationTool (Prisma)

**Location**: `packages/migration-tool/prisma/schema.prisma`

These entities run outside Medusa and use their own Prisma schema. Migrations managed by `prisma migrate deploy`, not `medusa db:migrate`.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["public", "undrlla"]
}

generator client {
  provider = "prisma-client-js"
}

model MigrationJournal {
  id             String   @id @default(uuid()) @db.Uuid
  entity_type    String   @db.VarChar(64)
  source_id      String   @db.VarChar(255)
  target_id      String?  @db.Uuid
  content_hash   String   @db.Char(64)
  status         String   @default("pending") @db.VarChar(16)
  error_message  String?  @db.Text
  source_data    Json?
  dry_run_result Json?
  migrated_at    DateTime? @db.Timestamptz
  verified_at    DateTime? @db.Timestamptz
  verification_diff Json?
  created_at     DateTime @default(now()) @db.Timestamptz

  @@unique([entity_type, source_id])
  @@index([entity_type, target_id])
  @@index([status, entity_type])
  @@index([content_hash])
  @@map("migration_journal")
  @@schema("undrlla")
}

model MigrationCheckpoint {
  id               String   @id @default(uuid()) @db.Uuid
  run_id           String   @db.VarChar(64)
  phase            String   @db.VarChar(32)
  entity_type      String   @db.VarChar(64)
  last_source_id   String   @db.VarChar(255)
  total_count      Int      @default(0)
  processed_count  Int      @default(0)
  failed_count     Int      @default(0)
  started_at       DateTime @default(now()) @db.Timestamptz
  completed_at     DateTime? @db.Timestamptz
  metadata         Json?

  @@unique([run_id, phase, entity_type])
  @@index([run_id], map: "migration_checkpoint_active_idx")
  @@map("migration_checkpoint")
  @@schema("undrlla")
}
```

### MigrationJournal indexes

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `migration_journal_source_key` | `entity_type, source_id` | UNIQUE | Deduplication |
| `migration_journal_target_idx` | `entity_type, target_id` | btree (partial) | Target lookup |
| `migration_journal_status_idx` | `status, entity_type` | btree | Progress tracking |
| `migration_journal_content_hash_idx` | `content_hash` | btree | Integrity verification |

### MigrationCheckpoint indexes

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `migration_checkpoint_run_phase_key` | `run_id, phase, entity_type` | UNIQUE | One checkpoint per phase per run |
| `migration_checkpoint_active_idx` | `run_id` WHERE `completed_at IS NULL` | btree (partial) | Find active runs |

**RLS Policy**: Operator-only for both tables.

```sql
CREATE POLICY migration_journal_operator_only ON undrlla.migration_journal
  FOR ALL USING (
    current_setting('app.is_operator', true)::BOOLEAN = true
  );

CREATE POLICY migration_checkpoint_operator_only ON undrlla.migration_checkpoint
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

## Medusa Entity Extensions (Links)

These are **link tables** connecting Medusa's built-in entities to undrlla's custom tenant scope. Medusa v2's Module Link framework is used (not schema modification of Medusa's own tables).

### Entity: `CustomerTenantLink`

Links Medusa `customer` to undrlla `tenant`. Many-to-one (customer belongs to one tenant).

```typescript
// apps/medusa/src/modules/tenant/models/customer-tenant-link.ts
import { model } from "@medusajs/framework/utils"
import Tenant from "./tenant"

const CustomerTenantLink = model.define("customer_tenant_link", {
  tenant_id: model.text().index("IDX_CUST_LINK_TENANT"),
  tenant: model.belongsTo(() => Tenant, { mappedBy: "customer_links" }),
  customer_id: model.text().unique("IDX_CUST_LINK_CUSTOMER"),
  legacy_id: model.text().nullable(),
}).indexes([
  { on: ["customer_id"], unique: true },
  { on: ["tenant_id"] },
])

export default CustomerTenantLink
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_CUST_LINK_CUSTOMER` | `customer_id` | UNIQUE | 1 customer → 1 tenant |
| `IDX_CUST_LINK_TENANT` | `tenant_id` | btree | Tenant's customers |

**Migration notes**: Created during customer migration. `legacy_id` enables traceability back to the original `undrlla` customer table.

### Table: `auth_legacy_credentials`

> **Managed by Better-Auth's built-in migration pipeline** — NOT a Medusa DML entity. Created via Better-Auth SQL migrations, not `medusa db:migrate`. See T027, contract `auth-better-auth.md`.

Stores legacy bcrypt hashes for transparent password migration on first login. On successful migration, the hash is re-hashed with a modern cost factor (≥12) and the row is marked complete.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `legacy_customer_id` | UUID | NO | — | FK to `customer_tenant_link.legacy_id` (original legacy customer ID) |
| `legacy_bcrypt_hash` | TEXT | NO | — | Original bcrypt hash from V1 (encrypted at rest with AES-256-GCM envelope encryption). Accepts `$2a$`, `$2b$`, `$2y$` prefixes. |
| `migrated_at` | TIMESTAMPTZ | YES | `NULL` | Set when customer successfully logs in and hash is re-hashed. `NULL` = not yet migrated. |
| `migration_attempts` | INT | NO | `0` | Counter for failed migration attempts (wrong password). Incremented on each failed login against this hash. |

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_AUTH_LEGACY_CUSTOMER` | `legacy_customer_id` | UNIQUE | 1 legacy customer → 1 credential row |
| `IDX_AUTH_LEGACY_MIGRATED` | `migrated_at` | btree (partial: `WHERE migrated_at IS NULL`) | Fast lookup for unmigrated credentials |

---

### Entity: `OrderTenantLink`

Links Medusa `order` to undrlla `tenant`.

```typescript
// apps/medusa/src/modules/tenant/models/order-tenant-link.ts
import { model } from "@medusajs/framework/utils"
import Tenant from "./tenant"

const OrderTenantLink = model.define("order_tenant_link", {
  tenant_id: model.text().index("IDX_ORDER_LINK_TENANT"),
  tenant: model.belongsTo(() => Tenant, { mappedBy: "order_links" }),
  order_id: model.text().unique("IDX_ORDER_LINK_ORDER"),
  legacy_id: model.text().nullable(),
}).indexes([
  { on: ["order_id"], unique: true },
  { on: ["tenant_id"] },
])

export default OrderTenantLink
```

**Indexes**:

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `IDX_ORDER_LINK_ORDER` | `order_id` | UNIQUE | |
| `IDX_ORDER_LINK_TENANT` | `tenant_id` | btree | |

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
│       │    undrlla schema (DML → MikroORM)          │               │
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
│      │       │  │  server_id (→ VPNServer), allocated_ip   │         │
│      │       │  └────┬─────────────────────────────┬──────┘         │
│      │       │       │                              │                │
│      │       │  ┌────▼─────────┐  ┌────────────────▼──────┐        │
│      │       │  │  VPNServer   │  │    VPNIPPool           │        │
│      │       │  │  (operator)  │  │  (atomic alloc)        │        │
│      │       │  └──────────────┘  └───────────────────────┘        │
│      │       │                                                      │
│  ┌───▼───────▼──────────────────────────────────────────────┐       │
│  │     FederationInstance ──► FederationCatalogEntry         │       │
│  │     (public read, operator write)                         │       │
│  └───────────────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────────┐
  │  Standalone: Prisma (packages/migration-tool/)                   │
  │  ┌──────────────────────┐  ┌──────────────────────────────┐     │
  │  │  MigrationJournal    │  │  MigrationCheckpoint         │     │
  │  │  entity_type,        │  │  run_id, phase,              │     │
  │  │  source_id → target  │  │  last_source_id              │     │
  │  └──────────────────────┘  └──────────────────────────────┘     │
  └──────────────────────────────────────────────────────────────────┘
```

### Foreign key summary

| Source Entity | FK Column | Target Entity | Target Column | Cardinality | ORM |
|---------------|-----------|---------------|---------------|-------------|-----|
| Workspace | `tenant_id` | Tenant | `id` | N:1 | DML |
| BrandConfig | `tenant_id` | Tenant | `id` | 1:1 | DML |
| CustomerTenantLink | `tenant_id` | Tenant | `id` | N:1 | DML |
| CustomerTenantLink | `customer_id` | Medusa customer | `id` | N:1 | Link |
| OrderTenantLink | `tenant_id` | Tenant | `id` | N:1 | DML |
| OrderTenantLink | `order_id` | Medusa order | `id` | N:1 | Link |
| PaymentTransaction | `tenant_id` | Tenant | `id` | N:1 | DML |
| PaymentTransaction | `order_id` | Medusa order | `id` | N:1 | DML |
| VPNPeer | `tenant_id` | Tenant | `id` | N:1 | DML |
| VPNPeer | `server_id` | VPNServer | `id` | N:1 | DML |
| VPNPeer | `customer_id` | Medusa customer | `id` | N:1 | DML |
| VPNPeer | `order_id` | Medusa order | `id` | N:1 | DML |
| VPNIPPool | `server_id` | VPNServer | `id` | N:1 | DML |
| VPNIPPool | `allocated_to_peer_id` | VPNPeer | `id` | 1:1 | DML |
| AIUsageEvent | `tenant_id` | Tenant | `id` | N:1 | DML |
| AIUsageEvent | `customer_id` | Medusa customer | `id` | N:1 | DML |
| AIKeyVault | `tenant_id` | Tenant | `id` | 1:1 | DML |
| AITierConfig | `tenant_id` | Tenant | `id` | 1:1 | DML |
| FederationCatalogEntry | `instance_id` | FederationInstance | `id` | N:1 | DML |

---

## Migration Strategy Notes

### ORM-specific migration commands

| Layer | Command | When |
|-------|---------|------|
| Medusa Custom Modules (DML) | `medusa db:migrate` | After DML model changes in `apps/medusa/src/modules/` |
| Standalone Packages (Prisma) | `prisma migrate deploy` | After `schema.prisma` changes in `packages/migration-tool/` |
| RLS Policies | Raw SQL via migration scripts | One-time setup + schema changes |

> **Important**: Never run `prisma migrate` inside `apps/medusa/`. Medusa manages its own migrations via DML → MikroORM. Prisma migrations are only for standalone packages.

### Phase approach

| Phase | Entities | Direction | ORM | Notes |
|-------|----------|-----------|-----|-------|
| 1 | Tenant, Workspace, BrandConfig | Manual seed | DML | Create GLOBAL + EU tenants before any data migration |
| 2 | VPNServer, VPNIPPool | Legacy → v2 | DML | Re-encrypt keys with new master; generate IP pools from CIDR |
| 3 | Customer → CustomerTenantLink | Legacy → v2 | DML | Map legacy customer IDs; create Medusa customer + link row atomically |
| 4 | Product | Legacy → v2 | DML | Map to Medusa Product + Variant; assign to tenant's Sales Channel |
| 5 | Order → OrderTenantLink | Legacy → v2 | DML | Map to Medusa Order + Line Items; link to tenant + customer |
| 6 | PaymentTransaction | Legacy → v2 | DML | Map per-provider; crypto tx hashes in `confirmation_code` |
| 7 | VPNPeer | Legacy → v2 | DML | Re-link to new customer_id + order_id via MigrationJournal; verify IP uniqueness |
| 8 | Verification | Read-back | Prisma | SHA-256 compare source_data vs target readback; log diffs |

### Dual-write window (FR-038)

During cutover, both legacy and v2 receive writes:

1. **Order placement**: Legacy creates order → migration tool mirrors to v2 → v2 also accepts direct orders
2. **VPN provisioning**: Legacy provisions → v2 VPNPeer row created from legacy event → v2 also provisions directly
3. **Reconciliation**: Scheduled job compares MigrationJournal `content_hash` vs live v2 data every 15 min

### Integrity verification (FR-004)

```
**Accepted status values**: `pending`, `migrated`, `verified`, `failed`, `orphan_server` (peer cannot be live-verified because its legacy VPNServer is decommissioned; manual ops review required post-migration).

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
- DML entity deletions go through Medusa's soft-delete (`deleted_at`), then hard-delete via cleanup job

---

## Index Strategy Summary

### Total indexes by module

| Module | Tables | Indexes | ORM | Notes |
|--------|--------|---------|-----|-------|
| TenantModule | 3 | 8 | DML | BrandConfig is lightweight (1:1) |
| VPNModule | 3 | 13 | DML | VPNIPPool has critical index for atomic allocation |
| AIMeteringModule | 3 | 11 | DML | Heavy time-series indexing on AIUsageEvent |
| FederationModule | 2 | 6 | DML | Catalog search |
| PaymentBTCPayModule | 1 | 6 | DML | Provider reconciliation |
| Medusa Extensions | 2 | 4 | DML | Customer/Order link tables |
| MigrationTool | 2 | 7 | Prisma | Content hash index for integrity checks |
| **Total** | **16** | **55** | | |

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

> **Note**: Partial indexes with `WHERE` clauses cannot be expressed in DML `.indexes()`. They must be created via raw SQL migrations (`medusa db:migrate` runs custom migration files in addition to DML-generated ones).

---

## RLS Policy Templates

All RLS policies use `current_setting('app.*')` set per-request by the application middleware. RLS is ORM-agnostic — it filters at the Postgres level regardless of whether queries come from MikroORM (DML) or Prisma.

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

RLS is the **third** line of defense. The **first** is the MikroORM TenantSubscriber (for DML modules) or Prisma Client extension (for standalone packages) that injects `tenant_id` into every query. The **second** is application-layer validation. If any layer fails, the others still protect. A malicious authenticated request from tenant A attempting tenant B's data fails with **404** (not 403) so entity existence is not leaked (Edge Case: Tenant-scope leak attempt).

---

*Document generated: 2026-05-25 | Spec ref: `specs/001-init/spec.md` | Decisions: `specs/001-init/decisions/` | ORM: Dual (DML + Prisma)*
