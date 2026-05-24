# API Contract: VPN Provisioning Worker

**Version**: 1.0.0
**Status**: Draft
**Last Updated**: 2026-05-24

---

## Overview

Hatchet-based workflow worker for VPN instance provisioning. Orchestrates: IP allocation → config generation → server push → encryption → notification. Runs as a background worker consuming from Hatchet task queue.

---

## Authentication

| Context | Mechanism | Details |
|---------|-----------|---------|
| Hatchet Worker | JWT Token | `HATCHET_TOKEN` env var. Worker auth to Hatchet engine. |
| SSH to VPN Server | Key-based | `ssh2` library. Key from vault (`VPN_SSH_KEY_{serverId}`). |
| Database | Connection string | `DATABASE_URL` env var. Worker needs SELECT/INSERT/UPDATE on `vpn_ip_pool`, `vpn_peer`. |
| Notification | Internal HTTP | Service-to-service JWT for notification API. |

---

## Rate Limiting

Not applicable — worker processes events from queue, not HTTP requests. Concurrency controlled by Hatchet worker config:

```typescript
interface WorkerConcurrency {
  max_concurrent_workflows: number; // default: 10
  max_concurrent_steps: number;     // default: 50
}
```

---

## Versioning

Workflow definitions versioned via Hatchet workflow name suffix: `vpn-provision-v1`. Breaking changes create `vpn-provision-v2` with migration path.

---

## Workflow Input

```typescript
interface VPNProvisionInput {
  order_id: string;
  customer_id: string;
  tenant_id: string;
  vpn_type: "wireguard" | "amneziawg" | "xray";
  server_id?: string; // optional: preferred server, auto-select if omitted
  plan: {
    name: string;
    bandwidth_mbps: number;
    data_cap_gb: number;
    duration_days: number;
  };
  metadata?: Record<string, string>;
}
```

---

## Workflow Steps

### Step 1: Allocate IP

Atomic IP allocation from server's available pool.

```typescript
interface AllocateIPInput {
  server_id: string;
  vpn_type: "wireguard" | "amneziawg" | "xray";
}

interface AllocateIPOutput {
  allocated_ip: string;
  subnet_mask: string;
  gateway_ip: string;
  allocation_id: string;
}

// Atomic SQL (PostgreSQL)
// Uses advisory lock + INSERT ... ON CONFLICT for race safety
const ALLOCATE_IP_SQL = `
  WITH candidate AS (
    SELECT ip_address
    FROM vpn_ip_pool
    WHERE server_id = $1
      AND allocated = false
    ORDER BY ip_address
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  UPDATE vpn_ip_pool
  SET allocated = true,
      allocated_at = now(),
      allocated_to_peer_id = $3
  FROM candidate
  WHERE vpn_ip_pool.ip_address = candidate.ip_address
    AND vpn_ip_pool.server_id = $1
  RETURNING vpn_ip_pool.ip_address, vpn_ip_pool.subnet_mask, vpn_ip_pool.gateway_ip;
`;
```

**Failure**: No available IPs → throw `AllocationError` → trigger rollback.

---

### Step 2: Generate Config

Generate VPN configuration based on type.

```typescript
interface GenerateConfigInput {
  vpn_type: "wireguard" | "amneziawg" | "xray";
  allocated_ip: string;
  subnet_mask: string;
  server_endpoint: string;
  server_public_key: string;
  customer_public_key: string;
  dns_servers: string[];
  mtu: number;
  plan: VPNProvisionInput["plan"];
}

interface GenerateConfigOutput {
  config_content: string; // raw config file content
  config_format: "ini" | "json" | "yaml";
  config_hash: string; // SHA-256 of config_content
  client_private_key?: string; // only if server generates keys
}
```

Config generation per type:

| Type | Format | Key Exchange |
|------|--------|-------------|
| wireguard | INI | Client generates keypair, sends public key |
| amneziawg | INI (with obfuscation params) | Client generates keypair + Amnezia params |
| xray | JSON | Server generates UUID for client |

---

### Step 3: Push to Server

SSH to VPN server and deploy config.

```typescript
interface PushConfigInput {
  server_id: string;
  server_host: string;
  ssh_port: number; // default: 22
  vpn_type: string;
  config_content: string;
  allocated_ip: string;
}

interface PushConfigOutput {
  success: boolean;
  server_config_path: string;
  applied_at: string; // ISO 8601
  wireguard_interface?: string; // e.g., "wg0"
}
```

SSH interface via `ssh2`:

```typescript
interface SSHProvisioner {
  connect(options: {
    host: string;
    port: number;
    username: string;
    privateKey: Buffer;
  }): Promise<void>;

  writeConfig(path: string, content: string): Promise<void>;
  reloadService(vpnType: string): Promise<{ exitCode: number; stdout: string; stderr: string }>;
  verifyConnection(ip: string): Promise<boolean>;

  disconnect(): Promise<void>;
}
```

Server-side commands:

```bash
# WireGuard
scp config.conf server:/etc/wireguard/clients/{allocation_id}.conf
ssh server -- wg syncconf wg0 <(wg-quick strip wg0)

# AmneziaWG
scp config.conf server:/etc/amnezia/amneziawg/clients/{allocation_id}.conf
ssh server -- awg syncconf awg0 <(awg-quick strip awg0)

# Xray
scp config.json server:/etc/xray/clients/{allocation_id}.json
ssh server -- systemctl reload xray
```

---

### Step 4: Encrypt & Store

Encrypt sensitive config data and store in database.

```typescript
interface EncryptStoreInput {
  customer_id: string;
  order_id: string;
  allocation_id: string;
  config_content: string;
  client_private_key?: string;
}

interface EncryptStoreOutput {
  instance_id: string;
  encrypted_config_ref: string; // reference to encrypted blob in storage
  stored_at: string;
}
```

Encryption: AES-256-GCM with per-customer key derived from KMS. Encrypted config stored in `vpn_peer.config_ref` (S3 object key). Encryption key derived from KMS at encrypt/decrypt time, never stored in DB.

---

### Step 5: Notify

Send provisioning completion notification.

```typescript
interface NotifyInput {
  customer_id: string;
  tenant_id: string;
  order_id: string;
  instance_id: string;
  vpn_type: string;
  status: "provisioned" | "failed";
  config_download_url?: string; // time-limited presigned URL
}

interface NotifyOutput {
  notification_id: string;
  channels: Array<"email" | "telegram" | "webhook">;
  sent_at: string;
}
```

**Notification API Call**: `POST /api/internal/notifications`

```typescript
interface NotificationRequest {
  recipient_type: "customer";
  recipient_id: string;
  template: "vpn_provisioned" | "vpn_provision_failed";
  data: Record<string, unknown>;
  priority: "high" | "normal" | "low";
}
```

---

## Workflow Definition

```typescript
const vpnProvisionWorkflow = hatchet.workflow({
  name: "vpn-provision-v1",
  on: {
    event: "order.vpn.provision",
  },
});

const step1 = vpnProvisionWorkflow.step("allocate-ip", {
  timeout: "30s",
  retries: 2,
}, async (ctx) => {
  const input = ctx.workflowInput() as VPNProvisionInput;
  const serverId = input.server_id ?? await selectServer(input.vpn_type);
  const result = await allocateIP(serverId, input.vpn_type);
  return { ...result, server_id: serverId };
});

const step2 = vpnProvisionWorkflow.step("generate-config", {
  timeout: "10s",
  retries: 1,
  parents: [step1],
}, async (ctx) => {
  const alloc = ctx.stepOutput(step1);
  const input = ctx.workflowInput() as VPNProvisionInput;
  return await generateConfig({ ...input, ...alloc });
});

const step3 = vpnProvisionWorkflow.step("push-to-server", {
  timeout: "60s",
  retries: 3,
  parents: [step2],
}, async (ctx) => {
  const config = ctx.stepOutput(step2);
  const alloc = ctx.stepOutput(step1);
  return await pushToServer(alloc.server_id, config);
});

const step4 = vpnProvisionWorkflow.step("encrypt-store", {
  timeout: "15s",
  retries: 2,
  parents: [step3],
}, async (ctx) => {
  const config = ctx.stepOutput(step2);
  const input = ctx.workflowInput() as VPNProvisionInput;
  return await encryptAndStore({ ...input, ...config });
});

const step5 = vpnProvisionWorkflow.step("notify", {
  timeout: "15s",
  retries: 3,
  parents: [step4],
}, async (ctx) => {
  const store = ctx.stepOutput(step4);
  const input = ctx.workflowInput() as VPNProvisionInput;
  return await notify({ ...input, ...store });
});
```

---

## Rollback on Failure

Any step failure triggers rollback of completed steps in reverse order:

```typescript
interface RollbackPlan {
  notify: () => Promise<void>;          // notify failure (always runs)
  encrypt_store: () => Promise<void>;   // delete encrypted blob
  push_to_server: () => Promise<void>;  // SSH: remove config, reload service
  generate_config: () => Promise<void>; // no-op (local only)
  allocate_ip: () => Promise<void>;     // release IP back to pool
}
```

```typescript
async function rollback(
  completedSteps: Map<string, StepOutput>,
  failedStep: string,
  input: VPNProvisionInput
): Promise<void> {
  const rollbackOrder = ["notify", "encrypt-store", "push-to-server", "allocate-ip"];
  const failedIndex = rollbackOrder.indexOf(failedStep);

  for (let i = 0; i < failedIndex; i++) {
    const stepName = rollbackOrder[i];
    const output = completedSteps.get(stepName);
    try {
      await rollbackStep(stepName, output, input);
    } catch (rollbackError) {
      // Log rollback failure, emit alert — manual intervention required
      await emitAlert({
        type: "rollback_failed",
        step: stepName,
        original_failure: failedStep,
        rollback_error: rollbackError,
        order_id: input.order_id,
      });
    }
  }

  // Always send failure notification
  await notify({ ...input, status: "failed" });
}
```

Rollback SQL for IP release:

```sql
UPDATE vpn_ip_pool
SET allocated = false,
    allocated_at = NULL,
    allocated_to_peer_id = NULL
WHERE allocated_to_peer_id = $1;
```

---

## Idempotency

```typescript
interface IdempotencyRecord {
  order_id: string;
  workflow_run_id: string;
  status: "running" | "completed" | "failed" | "rolled_back";
  completed_steps: string[];
  step_outputs: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
```

**Guarantee**: Same `order_id` + `vpn_type` never provisions twice.

1. Worker checks `vpn_provisioning_locks` table for existing run
2. If `running` → return current status, don't start new workflow
3. If `completed` → return existing result
4. If `failed` → check retry policy, retry or reject
5. INSERT with `ON CONFLICT (order_id, vpn_type) DO NOTHING`

```sql
INSERT INTO vpn_provisioning_locks (order_id, vpn_type, workflow_run_id, status)
VALUES ($1, $2, $3, 'running')
ON CONFLICT (order_id, vpn_type)
DO UPDATE SET status = EXCLUDED.status
WHERE vpn_provisioning_locks.status IN ('failed', 'rolled_back')
RETURNING *;
```

If no rows returned → idempotent reject (already running/completed).

---

## Error Schema

```typescript
interface ProvisioningError {
  code: string;
  message: string;
  step: string;
  retryable: boolean;
  context: {
    order_id: string;
    server_id?: string;
    allocation_id?: string;
  };
  original_error?: {
    name: string;
    message: string;
    code?: string | number;
  };
}

type ErrorCode =
  | "NO_AVAILABLE_SERVERS"
  | "IP_POOL_EXHAUSTED"
  | "CONFIG_GENERATION_FAILED"
  | "SSH_CONNECTION_FAILED"
  | "SSH_COMMAND_FAILED"
  | "SERVICE_RELOAD_FAILED"
  | "ENCRYPTION_FAILED"
  | "STORAGE_FAILED"
  | "NOTIFICATION_FAILED"
  | "IDEMPOTENCY_CONFLICT"
  | "ROLLBACK_FAILED";
```

---

## Server Selection (Auto)

When `server_id` not provided:

```typescript
interface ServerSelectionCriteria {
  vpn_type: string;
  preferred_region?: string;
  exclude_servers?: string[]; // recently failed
}

interface ServerCandidate {
  server_id: string;
  host: string;
  region: string;
  available_ips: number;
  current_load: number; // 0-1
  health_score: number; // 0-100
}

// Selection: ORDER BY health_score DESC, current_load ASC, available_ips DESC LIMIT 1
```

---

## Monitoring Events

```typescript
type ProvisioningEvent =
  | { type: "provisioning.started"; order_id: string }
  | { type: "provisioning.ip_allocated"; allocation_id: string }
  | { type: "provisioning.config_generated"; config_hash: string }
  | { type: "provisioning.config_pushed"; server_path: string }
  | { type: "provisioning.completed"; instance_id: string }
  | { type: "provisioning.failed"; step: string; error: ProvisioningError }
  | { type: "provisioning.rolled_back"; steps_reverted: string[] }
  | { type: "provisioning.rollback_failed"; step: string };
```

All events emitted to Hatchet event bus + logged to structured logger.
