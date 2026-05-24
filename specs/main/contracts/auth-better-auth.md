# API Contract: Better-Auth + Medusa Integration

**Version**: 1.0.0
**Status**: Draft
**Last Updated**: 2026-05-24

---

## Overview

Integration contract for Better-Auth (with organization plugin) as the primary auth system, bridged to Medusa v2 via a custom auth provider adapter. Handles credential migration, token versioning, SAML via Jackson, and cross-service session management.

---

## Authentication Architecture

```
┌─────────────────────────────────────────────────┐
│                  Next.js Frontend                │
│         (Better-Auth client SDK)                 │
└──────────────┬──────────────────┬────────────────┘
               │                  │
               ▼                  ▼
┌──────────────────────┐  ┌──────────────────────────┐
│    Better-Auth        │  │    Medusa Backend          │
│    (auth service)     │  │    (custom auth adapter)   │
│                       │  │                            │
│  - Sessions           │  │  - Medusa Auth Provider    │
│  - Organizations      │──│  - Module routes            │
│  - Credentials        │  │  - Admin auth               │
│  - OAuth/SAML         │  │                            │
│  - Token versioning   │  └────────────────────────────┘
│  - Jackson (SAML)     │
└──────────────────────┘
```

---

## Rate Limiting

| Endpoint | Window | Limit | Burst |
|----------|--------|-------|-------|
| `POST /api/auth/sign-in` | 60s | 10 req | 3 |
| `POST /api/auth/sign-up` | 60s | 5 req | 2 |
| `POST /api/auth/forgot-password` | 60s | 3 req | 1 |
| `POST /api/auth/saml/*` | 60s | 20 req | 5 |
| `POST /api/auth/token/refresh` | 60s | 30 req | 10 |
| Admin auth routes | 60s | 20 req | 5 |

Brute-force protection: 5 failed attempts → account locked for 15 min. Lockout counter resets on successful login or admin unlock.

---

## Versioning

Token version embedded in JWT claims (`tv: number`). Current version: `1`. Bumping token version invalidates all sessions with lower versions, forcing re-authentication.

---

## Core Interfaces

### Better-Auth Session

```typescript
interface BetterAuthSession {
  id: string;
  user_id: string;
  token: string; // JWT
  token_version: number;
  expires_at: string;
  ip_address: string;
  user_agent: string;
  impersonated_by?: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
    role: "owner" | "admin" | "member";
  };
  metadata: SessionMetadata;
}

interface SessionMetadata {
  tenant_id: string; // mapped from organization
  auth_methods: Array<"password" | "oauth" | "saml">;
  mfa_verified: boolean;
  created_at: string;
  last_refreshed_at: string;
}
```

### JWT Claims Structure

```typescript
interface UndrllaJWTClaims {
  // Standard claims
  sub: string; // user_id
  iss: string; // "undrlla-auth"
  aud: string; // "undrlla-platform"
  exp: number;
  iat: number;
  jti: string; // session ID

  // Token versioning
  tv: number; // token_version

  // Custom claims
  uid: string; // user_id (redundant but explicit)
  email: string;
  email_verified: boolean;
  org_id?: string;
  org_role?: "owner" | "admin" | "member";
  tenant_id?: string; // derived from org
  scopes: string[];
  auth_method: "password" | "oauth" | "saml";
  mfa: boolean;
}
```

---

## Better-Auth Organization Plugin → Medusa Adapter

### Organization Mapping

```typescript
interface OrganizationMedusaMapping {
  better_auth_org_id: string;
  medusa_customer_group_id?: string;
  tenant_id: string;
  billing_customer_id?: string;
  roles_mapping: {
    owner: "admin";
    admin: "admin";
    member: "customer";
  };
}
```

### Medusa Auth Provider

```typescript
import { MedusaError, Modules } from "@medusajs/framework/utils";
import { AuthProvider } from "@medusajs/framework/types";

class BetterAuthMedusaProvider implements AuthProvider {
  static identifier = "better-auth";

  async authenticate(
    req: MedusaRequest,
    res: MedusaResponse
  ): Promise<AuthenticationResult> {
    const token = this.extractToken(req);
    if (!token) {
      return { success: false, error: "No token provided" };
    }

    const session = await this.validateSession(token);
    if (!session) {
      return { success: false, error: "Invalid or expired session" };
    }

    if (session.token_version < this.currentTokenVersion) {
      return { success: false, error: "Token version expired" };
    }

    return {
      success: true,
      authIdentity: {
        id: session.user_id,
        provider_identities: [{
          entity_id: session.user_id,
          provider: "better-auth",
        }],
        app_metadata: {
          email: session.email,
          org_id: session.organization?.id,
          tenant_id: session.metadata.tenant_id,
          org_role: session.organization?.role,
          scopes: session.scopes,
          token_version: session.token_version,
        },
      },
    };
  }

  async register(
    req: MedusaRequest,
    res: MedusaResponse
  ): Promise<AuthenticationResult> {
    // Better-Auth handles registration
    // This method syncs to Medusa customer record
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Use Better-Auth sign-up endpoint"
    );
  }
}
```

---

## Credential Migration

### Migration Strategy

Legacy bcrypt hashes migrated transparently on first login.

```typescript
interface CredentialMigrationInput {
  user_email: string;
  legacy_hash: string; // bcrypt hash from old system
  legacy_salt?: string;
}

interface CredentialMigrationOutput {
  migrated: boolean;
  new_auth_method: "better-auth-password";
  migration_timestamp: string;
}
```

### Migration Flow

```
1. User submits login (email + password)
2. Better-Auth: no credential found for email
3. Check migration table: legacy_credentials
   ├─ Found: verify password against bcrypt hash
   │   ├─ Valid: create Better-Auth credential, delete legacy entry
   │   │   → emit credential.migrated event
   │   │   → proceed with normal session
   │   └─ Invalid: return auth_failed (don't reveal migration)
   └─ Not found: return auth_failed
```

```typescript
interface LegacyCredentialRecord {
  email: string;
  bcrypt_hash: string;
  migrated_at: string | null;
  migrated_to_id: string | null;
  created_at: string;
}
```

### Migration Table SQL

```sql
CREATE TABLE auth_legacy_credentials (
  email TEXT PRIMARY KEY,
  bcrypt_hash TEXT NOT NULL,
  migrated_at TIMESTAMPTZ,
  migrated_to_id UUID REFERENCES auth_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_legacy_credentials_migrated
  ON auth_legacy_credentials (migrated_at) WHERE migrated_at IS NULL;
```

---

## Token Versioning

### Version Management

```typescript
interface TokenVersionConfig {
  current_version: number;
  minimum_version: number;
  rotation_policy: "manual" | "on_incident";
}

// Global token version stored in config
// Checked on every session validation
```

### Version Bump Flow

```
1. Admin triggers token version bump (security incident, policy change)
2. UPDATE system_config SET token_version = token_version + 1 WHERE key = 'auth'
3. All sessions with tv < new_version → invalidated on next request
4. Active WebSocket connections → receive session_invalidated event
5. Frontend → redirect to login
6. Audit log entry created
```

```typescript
interface TokenVersionBumpEvent {
  type: "token_version.bumped";
  old_version: number;
  new_version: number;
  reason: string;
  triggered_by: string; // admin user ID
  affected_sessions_estimated: number;
  timestamp: string;
}
```

---

## SAML via Jackson Integration

### Architecture

```
IdP (e.g., Okta, Azure AD)
   │
   ▼
Jackson (SAML bridge)  ←→  Better-Auth
   │                        │
   ▼                        ▼
SAML Assertion         Session + JWT
```

### Jackson Configuration

```typescript
interface JacksonConfig {
  externalUrl: string; // e.g. "https://auth.undrlla.com"
  samlPath: string; // "/api/auth/saml/sso";
  oidcPath: string; // "/api/auth/saml/oidc";
  db: {
    engine: "sql";
    url: string; // DATABASE_URL
  };
  clientSecretVerifier: string;
  preloadedConfig?: Array<{
    tenant: string; // maps to org_id
    product: string; // "undrlla"
    defaultRedirectUrl: string;
    allowedRedirectUrls: string[];
    metadataUrl?: string; // IdP metadata URL
    metadataXml?: string; // IdP metadata XML
  }>;
}
```

### SAML Endpoints

**GET** `/api/auth/saml/sso?tenant=:org_id`

Initiates SAML SSO for organization. Redirects to IdP.

**POST** `/api/auth/saml/sso/callback`

IdP callback. Jackson validates assertion, Better-Auth creates session.

```typescript
interface SAMLCallbackResult {
  session: BetterAuthSession;
  idp_attributes: {
    email: string;
    display_name?: string;
    groups?: string[];
    department?: string;
  };
  saml_assertion_id: string;
}
```

**GET** `/api/auth/saml/metadata/:tenant`

SP metadata XML for IdP configuration.

### SAML Organization Binding

```typescript
interface SAMLOrgBinding {
  org_id: string;
  idp_entity_id: string;
  sp_entity_id: string;
  default_role: "admin" | "member";
  group_role_mapping?: Record<string, "owner" | "admin" | "member">;
  auto_provision: boolean; // create user on first SAML login
  jit_provision_role: "member"; // default role for JIT-provisioned users
}
```

---

## Session Management

### Cross-Service Session Flow

```
1. Frontend → Better-Auth client SDK → sign-in
2. Better-Auth → JWT issued + session stored
3. Frontend stores JWT in httpOnly cookie (Better-Auth managed)
4. Frontend calls Medusa API → Medusa adapter validates JWT
5. Medusa adapter → Better-Auth session API for verification
6. Both services share JWT secret (or use JWKS)
```

### Session Store

```typescript
interface SessionStore {
  create(session: BetterAuthSession): Promise<void>;
  get(sessionId: string): Promise<BetterAuthSession | null>;
  get_by_token(token: string): Promise<BetterAuthSession | null>;
  refresh(sessionId: string, newToken: string, newExpiry: string): Promise<void>;
  revoke(sessionId: string): Promise<void>;
  revoke_all_for_user(userId: string): Promise<number>; // returns count revoked
  list_for_user(userId: string): Promise<Array<{
    id: string;
    device: string;
    ip: string;
    last_active: string;
    created_at: string;
  }>>;
}
```

### Session Refresh

**POST** `/api/auth/token/refresh`

```typescript
interface RefreshRequest {
  refresh_token: string;
}

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  token_version: number;
}

// Old refresh token is single-use — rotated on every refresh
```

---

## Tenant Context Injection

Tenant context derived from organization membership, injected into auth session and propagated to all downstream services.

### Injection Point

```typescript
// Better-Auth organization plugin hook
async function onSessionCreate(session: Session, user: User): Promise<void> {
  const activeOrg = await getActiveOrganization(user.id);
  if (!activeOrg) return;

  const mapping = await getOrgMedusaMapping(activeOrg.id);
  if (!mapping) return;

  // Inject into session metadata
  session.metadata = {
    ...session.metadata,
    tenant_id: mapping.tenant_id,
  };

  // Inject into JWT claims
  session.token = injectClaims(session.token, {
    org_id: activeOrg.id,
    org_role: activeOrg.role,
    tenant_id: mapping.tenant_id,
  });
}
```

### Tenant Context Propagation

```typescript
interface TenantContext {
  tenant_id: string;
  org_id: string;
  org_role: "owner" | "admin" | "member";
  effective_scopes: string[];
  effective_permissions: string[];
  resource_limits: {
    max_vpn_instances: number;
    max_users: number;
    max_servers: number;
  };
}

// Propagated via:
// 1. JWT claims (stateless)
// 2. Session metadata (Better-Auth store)
// 3. Request headers (service-to-service):
//    X-Tenant-ID: <tenant_id>
//    X-Org-Role: <org_role>
//    X-Request-User: <user_id>
```

### Medusa Tenant Middleware

```typescript
// Medusa middleware that extracts tenant context from JWT
async function tenantContextMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: NextFunction
): Promise<void> {
  const authIdentity = req.auth_context?.identity;
  if (!authIdentity) {
    return next();
  }

  const metadata = authIdentity.app_metadata;
  if (metadata?.tenant_id) {
    req.tenant_context = {
      tenant_id: metadata.tenant_id,
      org_id: metadata.org_id,
      org_role: metadata.org_role,
      effective_scopes: metadata.scopes ?? [],
      effective_permissions: resolvePermissions(metadata.org_role),
    };
  }

  next();
}
```

---

## Error Schema

```typescript
interface AuthError {
  code: string;
  message: string;
  type: "authentication" | "authorization" | "validation" | "migration" | "saml" | "session" | "internal";
  retryable: boolean;
  detail?: unknown;
}

type AuthErrorCode =
  // Authentication
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_LOCKED"
  | "ACCOUNT_DISABLED"
  | "EMAIL_NOT_VERIFIED"
  | "TOKEN_EXPIRED"
  | "TOKEN_VERSION_EXPIRED"
  | "INVALID_REFRESH_TOKEN"
  | "SESSION_NOT_FOUND"
  // Authorization
  | "INSUFFICIENT_SCOPE"
  | "ORG_MEMBERSHIP_REQUIRED"
  | "ROLE_INSUFFICIENT"
  | "TENANT_ACCESS_DENIED"
  // Migration
  | "MIGRATION_FAILED"
  | "MIGRATION_ALREADY_DONE"
  | "LEGACY_HASH_INVALID"
  // SAML
  | "SAML_ASSERTION_INVALID"
  | "SAML_IDP_UNREACHABLE"
  | "SAML_ORG_NOT_CONFIGURED"
  | "SAML_ATTRIBUTE_MISSING"
  | "SAML_AUTO_PROVISION_DISABLED"
  // Session
  | "SESSION_CONCURRENT_LIMIT"
  | "SESSION_REVOKED"
  | "SESSION_IP_MISMATCH"
  // Internal
  | "BETTER_AUTH_UNAVAILABLE"
  | "MEDUSA_ADAPTER_ERROR"
  | "JACKSON_UNAVAILABLE";
```

---

## Admin Auth (Medusa Dashboard)

```typescript
interface AdminAuthConfig {
  // Admin users authenticate via Better-Auth
  // Mapped to Medusa admin role via org membership
  admin_org_slug: string; // e.g., "undrlla-admin"
  admin_roles_mapping: {
    owner: "admin";
    admin: "admin";
    member: "user"; // no admin panel access
  };
}

// Admin auth flow:
// 1. POST /auth/better-auth/admin → Better-Auth authenticate
// 2. Check org membership in admin org
// 3. Map role → Medusa admin role
// 4. Issue Medusa admin session token
// 5. Frontend stores in separate cookie: __medusa_admin
```

---

## Frontend Integration (Next.js)

```typescript
// lib/auth.ts
import { createAuthClient } from "better-auth/client";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  plugins: [organizationClient()],
});

// Usage in server components / middleware
import { auth } from "better-auth";

const session = await auth.api.getSession({
  headers: request.headers,
});

// Session includes tenant context for RLS
const tenantId = session?.session?.metadata?.tenant_id;
```

---

## Event Emission

```typescript
type AuthEvent =
  | { type: "auth.login"; user_id: string; method: string; org_id?: string; ip: string }
  | { type: "auth.logout"; user_id: string; session_id: string }
  | { type: "auth.signup"; user_id: string; email: string }
  | { type: "auth.credential.migrated"; user_id: string; from: "legacy_bcrypt" }
  | { type: "auth.token_version.bumped"; old_version: number; new_version: number }
  | { type: "auth.saml.login"; user_id: string; idp: string; org_id: string }
  | { type: "auth.account.locked"; user_id: string; reason: "brute_force" }
  | { type: "auth.session.refreshed"; user_id: string; session_id: string }
  | { type: "auth.session.revoked"; user_id: string; session_id: string; reason: string }
  | { type: "auth.organization.joined"; user_id: string; org_id: string; role: string };
```
