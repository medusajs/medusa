# API Contract: OmniRoute TS SDK

**Version**: 1.0.0
**Status**: Draft
**Last Updated**: 2026-05-24

---

## Overview

OmniRoute TS SDK provides a typed client for the OmniRoute sidecar proxy, handling LLM request routing, tier resolution, and metering for the undrlla platform.

**Sidecar Endpoint**: `http://omniroute:20128`

---

## Authentication

| Mechanism | Header | Scope |
|-----------|--------|-------|
| API Key | `X-OMNIROUT-KEY` | Per-tenant key issued by undrlla platform |
| Bearer Token | `Authorization: Bearer <jwt>` | Short-lived JWT from auth service |

All requests require one of the above. Missing auth → `401`. Invalid/expired → `403`.

---

## Rate Limiting

| Tier | Window | Limit | Burst |
|------|--------|-------|-------|
| dev | 60s | 20 req | 5 |
| paid | 60s | 100 req | 20 |
| byok | 60s | 200 req | 50 |

Headers on every response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1716535200
```

`429 Too Many Requests` when exhausted. Body includes `retry_after` field.

---

## Versioning

URL-based: `/v1/...`. Semantic versioning for SDK package. Contract changes require minor version bump; breaking changes require major version bump + new URL prefix.

---

## Operations

### 1. chatCompletion

**POST** `/v1/chat/completions`

```typescript
interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant" | "tool";
    content: string;
    name?: string;
    tool_call_id?: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  tools?: Array<{
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: Record<string, unknown>;
    };
  }>;
  tier?: "dev" | "paid" | "byok";
  byok_key?: string;
  metadata?: Record<string, string>;
}
```

```typescript
interface ChatCompletionResponse {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  tier_used: "dev" | "paid" | "byok";
  choices: Array<{
    index: number;
    message: {
      role: "assistant";
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: "function";
        function: { name: string; arguments: string };
      }>;
    };
    finish_reason: "stop" | "length" | "tool_calls" | "content_filter";
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  metering: {
    event_id: string;
    credits_consumed: number;
    credits_remaining: number;
  };
}
```

---

### 2. streamCompletion

**POST** `/v1/chat/completions` with `stream: true`

```typescript
interface StreamCompletionRequest extends Omit<ChatCompletionRequest, "stream"> {
  stream: true;
  stream_options?: {
    include_usage: boolean;
  };
}
```

Response: `text/event-stream` with SSE chunks:

```typescript
type SSEEvent =
  | { type: "chunk"; data: ChatCompletionChunk }
  | { type: "metering"; data: MeteringEvent }
  | { type: "error"; data: ErrorResponse };

interface ChatCompletionChunk {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: "assistant";
      content?: string;
      tool_calls?: Array<{
        index: number;
        id?: string;
        type?: "function";
        function?: { name?: string; arguments?: string };
      }>;
    };
    finish_reason: "stop" | "length" | "tool_calls" | "content_filter" | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

---

### 3. listModels

**GET** `/v1/models`

```typescript
interface ListModelsResponse {
  object: "list";
  data: Array<{
    id: string;
    object: "model";
    created: number;
    owned_by: string;
    tiers: Array<"dev" | "paid" | "byok">;
    capabilities: {
      chat: boolean;
      streaming: boolean;
      tools: boolean;
      vision: boolean;
      max_context: number;
    };
  }>;
}
```

---

### 4. healthCheck

**GET** `/v1/health`

```typescript
interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  version: string;
  uptime_seconds: number;
  providers: Array<{
    name: string;
    status: "up" | "down" | "degraded";
    latency_ms: number;
  }>;
}
```

---

## Tier Resolution Logic

Note: tier enum values are lowercase (`"dev"`, `"paid"`, `"byok"`) matching data-model `ai_tier` CHECK constraint.

```
Request arrives
  ├─ explicit tier in request → use that tier
  ├─ BYOK key present → BYOK tier, validate key
  ├─ tenant has active subscription → paid tier
  └─ fallback → dev tier (rate-limited)
```

If requested tier unavailable → `403` with `available_tiers` in response body.

---

## Error Handling

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    type: "authentication" | "rate_limit" | "invalid_request" | "upstream" | "billing" | "internal";
    param?: string;
    retry_after?: number;
    upstream_error?: {
      provider: string;
      code: string;
      message: string;
    };
  };
}
```

| HTTP Status | Code | Meaning |
|-------------|------|---------|
| 400 | `INVALID_REQUEST` | Malformed request body |
| 401 | `AUTH_REQUIRED` | Missing auth header |
| 403 | `TIER_UNAVAILABLE` | Requested tier not allowed for tenant |
| 403 | `BYOK_INVALID` | BYOK key failed validation |
| 404 | `MODEL_NOT_FOUND` | Requested model not available |
| 429 | `RATE_LIMITED` | Rate limit exceeded |
| 402 | `INSUFFICIENT_CREDITS` | Paid tier, no credits |
| 502 | `UPSTREAM_ERROR` | LLM provider returned error |
| 503 | `SERVICE_UNAVAILABLE` | OmniRoute unhealthy |
| 504 | `UPSTREAM_TIMEOUT` | LLM provider timed out |

### SDK Retry Strategy

```typescript
interface RetryConfig {
  max_retries: number;       // default: 3
  initial_delay_ms: number;  // default: 1000
  max_delay_ms: number;      // default: 10000
  backoff_multiplier: number; // default: 2
  retryable_statuses: [429, 502, 503, 504];
}
```

Exponential backoff with jitter. Stream requests retry on connection drop only (no mid-stream retry for partial chunks).

---

## Metering Event Emission

Every completed request emits a metering event:

```typescript
interface MeteringEvent {
  event_id: string;
  timestamp: string;
  tenant_id: string;
  request_id: string;
  model: string;
  tier: "dev" | "paid" | "byok";
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  credits: {
    consumed: number;
    remaining: number;
    rate_per_1k_tokens: number;
  };
  latency_ms: number;
  success: boolean;
}
```

Emitted to internal event bus (Redis stream `omniroute:metering`). Consumers: billing service, analytics, tenant dashboard.

---

## Graceful Degradation

When primary provider fails:

1. Try fallback provider for same model (if configured)
2. Return `502` with `retry_after` if no fallback available
3. Stream requests: emit `error` SSE event, then close connection
4. Health check reflects provider status within 30s

---

## SDK Configuration

```typescript
interface OmniRouteConfig {
  baseUrl: string; // default: "http://omniroute:20128"
  apiKey?: string;
  jwt?: string;
  defaultTier?: "dev" | "paid" | "byok";
  defaultModel?: string;
  retry?: Partial<RetryConfig>;
  timeout_ms?: number; // default: 30000
  metadata?: Record<string, string>;
}
```
