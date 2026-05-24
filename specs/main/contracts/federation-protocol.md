# API Contract: Federation REST API

**Version**: 1.0.0 (protocol_version: 1)
**Status**: Draft
**Last Updated**: 2026-05-24

---

## Overview

REST API for undrlla instance federation: discovery, catalog exchange, instance notification, and data portability. Enables inter-instance communication for the undrlla VPN marketplace.

---

## Authentication

| Endpoint | Auth Required | Mechanism |
|----------|--------------|-----------|
| `GET /.well-known/undrlla.json` | No | Public |
| `GET /api/federation/catalog.json` | No | Rate-limited, no auth |
| `POST /api/federation/notify` | Yes | `Authorization: Bearer <federation_token>` |
| `GET /api/tenant/:id/export` | Yes | `Authorization: Bearer <user_jwt>` |

Federation tokens issued via admin panel. Scoped to `federation:notify`. JWT tokens from auth service for tenant export.

---

## Rate Limiting

| Endpoint | Window | Limit | Burst |
|----------|--------|-------|-------|
| `/.well-known/undrlla.json` | 60s | 60 req | 10 |
| `/api/federation/catalog.json` | 60s | 30 req | 5 |
| `/api/federation/notify` | 60s | 10 req | 3 |
| `/api/tenant/:id/export` | 60s | 2 req | 1 |

Rate limit headers on all responses:

```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 28
X-RateLimit-Reset: 1716535200
```

---

## Versioning

Protocol version embedded in all response bodies: `protocol_version: 1`. URL prefix: `/api/federation/...`. Breaking changes increment `protocol_version` and may introduce new URL prefix (`/api/federation/v2/...`).

---

## Endpoints

### 1. Instance Discovery

**GET** `/.well-known/undrlla.json`

Public, unauthenticated. Returns instance metadata for federation discovery.

```typescript
interface DiscoveryResponse {
  protocol_version: 1;
  instance: {
    id: string; // UUID, stable instance identifier
    name: string; // human-readable instance name
    description: string;
    url: string; // canonical base URL
    operator: {
      name: string;
      contact: string; // email or URL
      pubkey: string; // instance public key for verification
    };
    version: string; // undrlla software version
    region: string; // ISO 3166-1 alpha-2 or custom region tag
    features: {
      vpn_types: Array<"wireguard" | "amneziawg" | "xray">;
      payment_methods: string[];
      federation_enabled: boolean;
      data_export: boolean;
    };
    federation: {
      catalog_url: string; // full URL to catalog.json
      notify_url: string; // full URL to notify endpoint
      supported_protocol_versions: number[];
    };
    uptime_since: string; // ISO 8601
    stats: {
      total_servers: number;
      total_customers: number;
      total_active_instances: number;
    };
  };
  signature: {
    algorithm: "ed25519";
    value: string; // signature of canonical JSON of instance object
  };
}
```

**Response**: `200 OK` with `Content-Type: application/json`

**Errors**:

| Status | Code | Meaning |
|--------|------|---------|
| 503 | `INSTANCE_UNAVAILABLE` | Instance in maintenance mode |

---

### 2. Catalog Feed

**GET** `/api/federation/catalog.json`

Public, rate-limited. Returns available VPN service catalog for federated discovery.

```typescript
interface CatalogResponse {
  protocol_version: 1;
  instance_id: string;
  generated_at: string; // ISO 8601
  expires_at: string; // ISO 8601, recommended cache TTL
  catalog: Array<CatalogEntry>;
  pagination: {
    total_entries: number;
    page: number;
    per_page: number;
    next_url?: string;
  };
}

interface CatalogEntry {
  id: string;
  name: string;
  description: string;
  vpn_type: "wireguard" | "amneziawg" | "xray";
  pricing: {
    currency: string; // ISO 4217
    periods: Array<{
      duration_days: number;
      price: number;
      price_satoshis?: number; // for BTC payment
      bandwidth_mbps: number;
      data_cap_gb: number;
    }>;
  };
  server_locations: Array<{
    region: string;
    city?: string;
    country: string;
    load_percent: number; // 0-100
  }>;
  features: {
    port_forwarding: boolean;
    dedicated_ip: boolean;
    multihop: boolean;
    split_tunneling: boolean;
    kill_switch: boolean;
  };
  availability: {
    status: "available" | "limited" | "sold_out";
    remaining_slots?: number;
  };
  terms_url?: string;
  accept_tos_required: boolean;
  updated_at: string;
}
```

**Query Parameters**:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `per_page` | number | 50 | Items per page (max 100) |
| `vpn_type` | string | all | Filter by VPN type |
| `region` | string | all | Filter by region |
| `min_bandwidth` | number | 0 | Minimum bandwidth filter |
| `max_price` | number | none | Maximum price filter |

**Cache**: Clients should cache for `expires_at` duration. `ETag` header included for conditional requests (`If-None-Match` → `304 Not Modified`).

**Errors**:

| Status | Code | Meaning |
|--------|------|---------|
| 400 | `INVALID_QUERY_PARAM` | Invalid filter parameter |
| 429 | `RATE_LIMITED` | Rate limit exceeded |

---

### 3. Instance Registration Notification

**POST** `/api/federation/notify`

Authenticated. Remote instance notifies this instance of its existence (for mesh discovery).

```typescript
interface NotifyRequest {
  protocol_version: 1;
  source_instance: {
    id: string;
    name: string;
    url: string;
    pubkey: string;
    region: string;
  };
  action: "register" | "update" | "decommission";
  payload: {
    discovery_url: string; // full URL to .well-known/undrlla.json
    catalog_url?: string;
    reason?: string; // required for "decommission"
  };
  timestamp: string; // ISO 8601
  signature: {
    algorithm: "ed25519";
    value: string; // signature of canonical JSON of request (excluding signature)
  };
}
```

```typescript
interface NotifyResponse {
  protocol_version: 1;
  status: "accepted" | "rejected" | "pending_verification";
  message: string;
  verification_url?: string; // URL to verify discovery reachability
  instance_known_peers?: number; // how many peers this instance knows
}
```

**Processing**:

1. Verify signature against `source_instance.pubkey`
2. Fetch `payload.discovery_url` and validate `/.well-known/undrlla.json`
3. Verify returned instance `id` matches `source_instance.id`
4. Store/update in `federation_instance` table
5. Schedule catalog sync

**Errors**:

| Status | Code | Meaning |
|--------|------|---------|
| 400 | `INVALID_PAYLOAD` | Malformed request body |
| 401 | `AUTH_REQUIRED` | Missing auth header |
| 403 | `INVALID_TOKEN` | Federation token invalid |
| 403 | `SIGNATURE_INVALID` | Ed25519 signature verification failed |
| 403 | `INSTANCE_MISMATCH` | Discovery ID doesn't match source ID |
| 404 | `DISCOVERY_UNREACHABLE` | Can't fetch discovery URL |
| 429 | `RATE_LIMITED` | Rate limit exceeded |
| 422 | `VALIDATION_FAILED` | Payload validation failed |

---

### 4. Data Portability Export

**GET** `/api/tenant/:id/export`

Authenticated. Tenant-initiated data export for GDPR compliance and migration.

```typescript
interface ExportQueryParams {
  format: "json" | "csv";
  include: Array<"profile" | "orders" | "vpn_configs" | "billing" | "audit_log">;
  date_from?: string; // ISO 8601
  date_to?: string; // ISO 8601
}
```

```typescript
interface ExportResponse {
  export_id: string;
  tenant_id: string;
  format: "json" | "csv";
  generated_at: string;
  data: {
    profile?: {
      id: string;
      email: string;
      display_name: string;
      created_at: string;
      auth_methods: string[];
      organizations: Array<{
        id: string;
        name: string;
        role: string;
      }>;
    };
    orders?: Array<{
      id: string;
      status: string;
      items: Array<{
        vpn_type: string;
        plan_name: string;
        duration_days: number;
        price_paid: number;
        currency: string;
      }>;
      created_at: string;
      completed_at: string | null;
    }>;
    vpn_configs?: Array<{
      instance_id: string;
      vpn_type: string;
      server_region: string;
      activated_at: string;
      expires_at: string;
      config_url: string; // time-limited presigned URL
    }>;
    billing?: Array<{
      id: string;
      amount: number;
      currency: string;
      payment_method: string;
      status: string;
      created_at: string;
    }>;
    audit_log?: Array<{
      action: string;
      ip_address: string;
      user_agent: string;
      timestamp: string;
    }>;
  };
  checksum: {
    algorithm: "sha256";
    value: string;
  };
}
```

**Authorization**: JWT must match tenant `:id` OR have `admin:export` scope.

**Async Processing**: If export takes >5s, returns `202 Accepted`:

```typescript
interface ExportPendingResponse {
  export_id: string;
  status: "processing";
  estimated_completion_seconds: number;
  poll_url: string; // GET /api/tenant/:id/export/:export_id/status
}
```

**Errors**:

| Status | Code | Meaning |
|--------|------|---------|
| 401 | `AUTH_REQUIRED` | Missing auth |
| 403 | `FORBIDDEN` | JWT doesn't match tenant, no admin scope |
| 404 | `TENANT_NOT_FOUND` | Tenant ID doesn't exist |
| 400 | `INVALID_FORMAT` | Unsupported export format |
| 400 | `INVALID_INCLUDE` | Invalid include parameter |
| 503 | `EXPORT_BUSY` | Another export in progress for this tenant |

---

## Error Response Schema

All errors follow a consistent structure:

```typescript
interface FederationError {
  protocol_version: 1;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    retry_after?: number;
    doc_url?: string;
  };
  request_id: string;
  timestamp: string;
}
```

---

## Federation Peer Management

Internal data model (maps to `federation_instance` table in data-model.md):

```typescript
interface FederationInstancePeer {
  id: string; // remote instance ID
  name: string;
  url: string;
  pubkey: string;
  region: string;
  status: "active" | "inactive" | "suspended" | "decommissioned";
  last_seen_at: string;
  last_catalog_sync_at: string;
  reputation_score: number; // 0-100
  registered_at: string;
  metadata: Record<string, unknown>;
}
```

---

## Signature Verification

All signed payloads use Ed25519:

```typescript
interface SignatureVerification {
  // 1. Canonicalize JSON (sorted keys, no whitespace)
  // 2. Extract payload (everything except `signature` field)
  // 3. Verify signature against instance pubkey
  // 4. Check timestamp within ±5 minutes
  verify(payload: string, signature: string, pubkey: string): boolean;
}
```

Timestamp drift tolerance: ±5 minutes. Reject notifications with stale timestamps.

---

## Catalog Sync Schedule

After peer registration:

```
Immediate sync: fetch catalog.json once
Scheduled sync: every 6 hours via cron
On-demand: re-sync on `update` notification
Health check: GET .well-known/undrlla.json every hour
Mark inactive: 3 consecutive health check failures → status = "inactive"
```
