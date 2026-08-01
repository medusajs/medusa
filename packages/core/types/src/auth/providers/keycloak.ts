export interface KeycloakAuthProviderOptions {
  clientId: string
  clientSecret: string
  callbackUrl: string
  /**
   * The realm issuer URL, e.g. `https://keycloak.example.com/realms/my-realm`.
   * The OIDC endpoints (authorization, token, JWKS) are derived from it.
   */
  issuer: string
}
