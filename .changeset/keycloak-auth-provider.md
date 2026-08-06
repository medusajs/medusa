---
"@medusajs/auth-keycloak": minor
"@medusajs/types": patch
---

feat(auth-keycloak): add Keycloak OIDC auth module provider

Adds a new auth module provider for Keycloak, mirroring the structure of
the Google provider. The provider implements the OIDC authorization code
flow against a configurable realm issuer: endpoints are derived from the
issuer URL, the token exchange uses a form-encoded body (Keycloak rejects
query-parameter exchanges), and the returned id_token is verified against
the realm JWKS with issuer and audience checks. Identities are keyed on the
`sub` claim.
