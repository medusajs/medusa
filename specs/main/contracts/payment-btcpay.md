# API Contract: BTCPay Server Payment Provider

**Version**: 1.0.0
**Status**: Draft
**Last Updated**: 2026-05-24

---

## Overview

BTCPay Server payment provider for Medusa v2. Implements `AbstractPaymentProvider` interface from `@medusajs/framework/utils`. Handles Bitcoin/Lightning invoice lifecycle via BTCPay Server.

---

## Authentication

| Context | Mechanism | Details |
|---------|-----------|---------|
| BTCPay API | API Key | `BTCPAY_API_KEY` env var. Scoped to specific store. |
| Webhook | Signature Header | `BTCPay-Sig` header = `sha256=<hmac>` using webhook secret |
| Medusa Internal | Module Resolution | Provider resolved by Medusa DI, no extra auth needed |

---

## Rate Limiting

| Source | Limit | Notes |
|--------|-------|-------|
| BTCPay API | 120 req/min per API key | BTCPay default. Provider must respect `429`. |
| Webhook endpoint | 60 req/min per IP | Nginx-level rate limit. |

---

## Versioning

Provider follows Medusa v2 payment module interface. BTCPay API version pinned via `BTCPAY_API_VERSION` config (default: `v1`). Internal versioning via npm package semver.

---

## Medusa Provider Interface

### Provider Identifier

```typescript
class BTCPayPaymentProvider extends AbstractPaymentProvider {
  static identifier = "btcpay";
  static DISPLAY_NAME = "BTCPay Server";
}
```

### Configuration

```typescript
interface BTCPayProviderConfig {
  btcpay_url: string;       // e.g. "https://btcpay.undrlla.com"
  api_key: string;          // BTCPay store API key
  store_id: string;         // BTCPay store ID
  webhook_secret: string;   // HMAC secret for webhook verification
  currency: string;         // default: "BTC"
  default_expiry_minutes: number; // default: 60
  speed_policy: "low-fee" | "medium-fee" | "high-fee"; // default: "medium-fee"
  lightning_enabled: boolean; // default: false
  network_fee_mode: "multiple" | "fixed"; // default: "multiple"
  required_confirmations: number; // default: 1
}
```

---

## Operations

### 1. createPaymentSession

Creates a BTCPay invoice and returns payment session data.

**Method**: `provider.createPaymentSession(cart, context)`

```typescript
interface CreateSessionInput {
  cart: {
    id: string;
    total: number; // in smallest currency unit (sats equivalent)
    currency_code: string;
    customer_id?: string;
    email?: string;
    metadata?: Record<string, unknown>;
  };
  context: {
    request_id?: string;
    idempotency_key?: string;
  };
}

interface PaymentSessionResponse {
  id: string; // BTCPay invoice ID
  session_data: {
    btcpay_invoice_id: string;
    checkout_url: string;
    lightning_invoice?: string;
    btc_amount: string;
    exchange_rate: number;
    expiration_timestamp: number;
    addresses: {
      btc?: string;
      lightning?: string;
    };
  };
  amount: number;
  currency_code: string;
  provider_id: string;
}
```

**BTCPay API Call**: `POST /api/v1/stores/{storeId}/invoices`

```typescript
interface BTCPayCreateInvoiceRequest {
  amount: number;
  currency: string;
  metadata: {
    orderId: string;
    buyerEmail?: string;
    cartId: string;
  };
  checkout: {
    speedPolicy: string;
    paymentMethods: string[];
    expirationMinutes: number;
  };
}

interface BTCPayInvoiceResponse {
  id: string;
  amount: string;
  currency: string;
  checkoutLink: string;
  status: "New" | "Paid" | "Processing" | "Settled" | "Expired" | "Invalid";
  metadata: Record<string, unknown>;
  checkout: {
    paymentMethods: string[];
    expirationTimestamp: number;
  };
}
```

---

### 2. authorizePayment

Authorizes payment after BTCPay invoice is settled. Called by webhook handler or manual poll.

**Method**: `provider.authorizePayment(paymentSession, context)`

```typescript
interface AuthorizeInput {
  payment_session: {
    id: string;
    data: PaymentSessionResponse["session_data"];
  };
  context: {
    request_id?: string;
    btcpay_event?: WebhookEvent; // present when triggered by webhook
  };
}

interface AuthorizeResponse {
  status: "authorized" | "pending" | "error";
  data: {
    btcpay_invoice_id: string;
    settled_amount: string;
    settled_currency: string;
    settlement_timestamp: number;
    transaction_id: string; // on-chain tx hash or lightning payment hash
  };
  error?: {
    code: string;
    message: string;
  };
}
```

Authorization requires invoice status = `Settled` with required confirmations met.

---

### 3. capturePayment

Captures an authorized payment. For BTC, authorization = capture (no separate capture phase).

**Method**: `provider.capturePayment(payment, context)`

```typescript
interface CaptureInput {
  payment: {
    id: string;
    amount: number;
    data: AuthorizeResponse["data"];
  };
  context: {
    request_id?: string;
  };
}

interface CaptureResponse {
  status: "captured" | "error";
  data: {
    btcpay_invoice_id: string;
    captured_amount: number;
    captured_currency: string;
    capture_timestamp: number;
  };
  error?: {
    code: string;
    message: string;
  };
}
```

**Note**: BTCPay invoices settle on-chain. Capture is a bookkeeping operation — marks the Medusa payment as captured. No additional BTCPay API call needed.

---

### 4. refundPayment

Issues a refund via BTCPay payout mechanism.

**Method**: `provider.refundPayment(payment, context)`

```typescript
interface RefundInput {
  payment: {
    id: string;
    amount: number;
    data: AuthorizeResponse["data"];
  };
  refund_amount: number;
  context: {
    request_id?: string;
    refund_address?: string; // BTC address for refund
    refund_lightning?: string; // Lightning invoice for refund
  };
}

interface RefundResponse {
  status: "refunded" | "partially_refunded" | "pending" | "error";
  data: {
    btcpay_payout_id?: string;
    refund_amount: number;
    refund_currency: string;
    refund_address?: string;
    refund_tx_hash?: string;
    refund_timestamp?: number;
  };
  error?: {
    code: string;
    message: string;
  };
}
```

**BTCPay API Call**: `POST /api/v1/stores/{storeId}/payouts`

```typescript
interface BTCPayPayoutRequest {
  destination: string; // BTC address or Lightning invoice
  amount: number;
  paymentMethod: "BTC" | "BTC-LNURL";
  metadata: {
    refund_for_invoice: string;
    medusa_payment_id: string;
  };
}
```

---

### 5. cancelPayment

Cancels an unpaid invoice. Only works on invoices with status `New` or `Expired`.

**Method**: `provider.cancelPayment(payment, context)`

```typescript
interface CancelInput {
  payment: {
    id: string;
    data: PaymentSessionResponse["session_data"];
  };
  context: {
    request_id?: string;
  };
}

interface CancelResponse {
  status: "canceled" | "error";
  data: {
    btcpay_invoice_id: string;
    cancellation_timestamp: number;
  };
  error?: {
    code: string;
    message: string;
  };
}
```

**BTCPay API Call**: `DELETE /api/v1/stores/{storeId}/invoices/{invoiceId}` (marks as invalid)

---

## Webhook Handling

**Endpoint**: `POST /hooks/btcpay` (mounted by Medusa, proxied to provider)

### Webhook Verification

```typescript
function verifyWebhookSignature(
  payload: string, // raw body
  signature: string, // BTCPay-Sig header value
  secret: string
): boolean;
// HMAC-SHA256 of payload using secret
// Signature format: "sha256=<hex>"
```

### Webhook Events

```typescript
interface WebhookEvent {
  deliveryId: string;
  webhookId: string;
  originalDeliveryId: string;
  isRedelivery: boolean;
  type: BTCPayEventType;
  timestamp: number;
  storeId: string;
  invoiceId: string;
}

type BTCPayEventType =
  | "InvoiceSettled"
  | "InvoiceExpired"
  | "InvoiceInvalid"
  | "InvoicePaymentSettled"
  | "InvoiceProcessing";
```

### Event Processing

| BTCPay Event | Medusa Action | Notes |
|--------------|---------------|-------|
| `InvoiceSettled` | `authorizePayment()` → emit `payment.authorized` | Confirmations met. Trigger fulfillment. |
| `InvoiceExpired` | `cancelPayment()` → emit `payment.canceled` | Invoice not paid in time. |
| `InvoiceInvalid` | `cancelPayment()` → emit `payment.canceled` | Double-spend detected or manual invalidation. |
| `InvoiceProcessing` | No action, log event; map to `payment_transaction.status = 'pending'` | Payment received, awaiting confirmations. Maps to `pending` status in `payment_transaction` enum (not a distinct `processing` state). |
| `InvoicePaymentSettled` | Update session metadata | Partial payment settled. |

### Webhook Response

```
HTTP 200 OK  — event processed successfully
HTTP 200 OK  — event acknowledged, processing async (idempotent)
HTTP 400 Bad Request — malformed payload
HTTP 401 Unauthorized — signature verification failed
HTTP 500 Internal Server Error — retry by BTCPay (exponential backoff, 5 retries)
```

---

## Edge Cases

### Late Settlement After Refund Window

Scenario: Invoice settles after Medusa order was refunded/canceled.

```
Timeline:
1. Invoice created → status: New
2. Invoice expires → status: Expired
3. Medusa cancels order, triggers refund (or no-op for expired)
4. Late payment arrives → BTCPay changes status: Expired → Settled

Resolution:
- Webhook `InvoiceSettled` received for expired order
- Provider checks: order status == canceled/refunded?
  YES → issue immediate refund via BTCPay payout
  NO  → normal authorization flow
- Log as `LATE_SETTLEMENT` incident for reconciliation
- Emit custom event `payment.late_settlement` with original order context
```

```typescript
interface LateSettlementEvent {
  invoice_id: string;
  order_id: string;
  order_status: "canceled" | "refunded" | "archived";
  settlement_amount: string;
  settlement_timestamp: number;
  auto_refund_initiated: boolean;
  payout_id?: string;
}
```

### Underpayment

Invoice partially paid but not fully settled:

- BTCPay status: `Processing` (partial payment received)
- Provider waits for `InvoiceSettled` or `InvoiceExpired`
- On expiry with partial payment: BTCPay auto-refunds partial amount
- Medusa: mark payment as `requires_attention`, notify customer

### Overpayment

Customer pays more than invoice amount:

- BTCPay settles for full amount, excess stored in store wallet
- Provider records `settled_amount > requested_amount`
- Emit `payment.overpayment` event
- Manual reconciliation via admin panel

---

## Error Response Schema

```typescript
interface ProviderError {
  code: string;
  message: string;
  detail?: unknown;
  btcpay_status?: number;
  btcpay_error?: string;
}

// Error codes
type ProviderErrorCode =
  | "INVOICE_CREATION_FAILED"
  | "INVOICE_NOT_FOUND"
  | "INVOICE_ALREADY_SETTLED"
  | "REFUND_FAILED"
  | "REFUND_ADDRESS_REQUIRED"
  | "PAYOUT_CREATION_FAILED"
  | "WEBHOOK_VERIFICATION_FAILED"
  | "RATE_LIMITED"
  | "UPSTREAM_UNAVAILABLE"
  | "CONFIGURATION_ERROR"
  | "CURRENCY_MISMATCH"
  | "LATE_SETTLEMENT";
```

---

## Medusa Payment Module Integration Events

Provider emits and consumes Medusa event bus events:

```typescript
// Emitted by provider
type ProviderEmits =
  | "payment.authorized"     // after InvoiceSettled
  | "payment.captured"       // after capture
  | "payment.refunded"       // after payout confirmed
  | "payment.canceled"       // after InvoiceExpired/Invalid
  | "payment.late_settlement" // edge case
  | "payment.overpayment";   // edge case

// Consumed by provider
type ProviderConsumes =
  | "order.canceled"    // trigger cancelPayment
  | "order.refunded"    // trigger refundPayment
  | "cart.completed";   // trigger createPaymentSession
```

---

## Idempotency

All operations accept optional `idempotency_key` in context. Provider stores mapping:

```
idempotency_key → (operation, btcpay_invoice_id, response)
```

Same key + same operation returns cached response without calling BTCPay API. TTL: 24 hours. Storage: Redis `btcpay:idempotency:{key}`.
