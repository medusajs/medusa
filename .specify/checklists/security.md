# Specification Quality Checklist: Security

**Purpose**: Validate that security-relevant requirements are complete, specific, and threat-modeled before implementation.
**When to use**: Any feature handling user input, AuthN, AuthZ, sessions, secrets, PII, payments, file uploads, or external integrations.
**When to skip**: Pure internal refactors with no I/O surface change. Even then, run a 60-second sanity pass.

## Validation Items

### Authentication & Identity

- [ ] CHK001 - Are AuthN requirements specified for every entry point that touches non-public data? [Coverage]
- [ ] CHK002 - Is the session lifecycle defined (creation, refresh, expiry, revocation)? [Completeness]
- [ ] CHK003 - Are MFA / step-up auth requirements explicit for sensitive actions? [Gap]

### Authorization

- [ ] CHK004 - Is the AuthZ model named (RBAC / ABAC / per-resource ACL / explicit deny)? [Clarity]
- [ ] CHK005 - Are permission matrices specified per role × resource × action? [Coverage]
- [ ] CHK006 - Are "shadow admin" paths (impersonation, support, debug endpoints) explicitly bounded? [Edge Case]

### Input Validation & Injection

- [ ] CHK007 - Is the validation strategy named (Zod / JSON-schema / DTO + whitelist)? [Clarity]
- [ ] CHK008 - Are requirements explicit that all external input MUST be validated server-side regardless of client validation? [Consistency]
- [ ] CHK009 - Are SQLi vectors covered (parametrized queries / ORM-only / no raw interpolation)? [Coverage]
- [ ] CHK010 - Is XSS prevention specified (output encoding, CSP headers, sanitization library)? [Completeness]

### Secrets & Configuration

- [ ] CHK011 - Are secret-source requirements specified (env vars, vault, KMS — never hardcoded)? [Completeness]
- [ ] CHK012 - Is rotation policy defined (cadence, blast radius, hot-swap mechanism)? [Gap]
- [ ] CHK013 - Are requirements explicit that secrets MUST NOT appear in logs, error responses, or tracing payloads? [Coverage]

### Network & Transport

- [ ] CHK014 - Is TLS specified for every external transport (incl. internal cross-network calls)? [Completeness]
- [ ] CHK015 - Are SSRF prevention requirements specified for features fetching user-supplied URLs? [Gap]
- [ ] CHK016 - Are CORS requirements explicit (allowed origins, credentials, preflight)? [Clarity]

### Data Protection

- [ ] CHK017 - Is data classification specified per field (public / internal / PII / sensitive)? [Coverage]
- [ ] CHK018 - Are encryption-at-rest requirements specified for sensitive classes? [Completeness]
- [ ] CHK019 - Is the retention + deletion policy specified (regulatory cadence, user-initiated deletion)? [Gap]

### Supply Chain

- [ ] CHK020 - Are dependency-policy requirements specified (allowlist source, audit cadence, lockfile discipline)? [Completeness]
- [ ] CHK021 - Are SBOM / vulnerability-scanning requirements explicit? [Gap]

### Failure Modes & Incident Response

- [ ] CHK022 - Are rate-limit / abuse-prevention requirements quantified (per IP, per user, per token)? [Clarity]
- [ ] CHK023 - Are security-event logging + alerting requirements specified (failed auth, AuthZ deny, anomaly)? [Coverage]
- [ ] CHK024 - Are "fail closed" requirements explicit for security-critical paths (don't degrade to no-auth on error)? [Edge Case]

### Threat Model

- [ ] CHK025 - Is a STRIDE / OWASP Top 10 (2025) threat-mapping included or referenced? [Traceability]
- [ ] CHK026 - Are attacker personas + attack surfaces enumerated (external, authenticated, insider, compromised dependency)? [Completeness]
- [ ] CHK027 - Are explicit non-goals listed (e.g., "we accept risk X because Y")? [Clarity]

## Notes

- References: OWASP Top 10 (2025), CWE, NIST framework. Augment with PCI-DSS / HIPAA / GDPR for regulated domains.
- Pair with `/speckit.review` from the `security-auditor` agent for adversarial probing.
