# @medusajs/auth-keycloak

Keycloak OIDC authentication provider for Medusa.

## Configuration

```ts
// medusa-config.ts
{
  resolve: "@medusajs/medusa/auth",
  options: {
    providers: [
      // re-register emailpass and any other providers you rely on —
      // overriding the auth module replaces the default provider list
      {
        resolve: "@medusajs/medusa/auth-emailpass",
        id: "emailpass",
      },
      {
        resolve: "@medusajs/medusa/auth-keycloak",
        id: "keycloak",
        options: {
          clientId: process.env.KEYCLOAK_CLIENT_ID,
          clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
          callbackUrl: process.env.KEYCLOAK_CALLBACK_URL,
          // realm issuer URL; OIDC endpoints are derived from it
          issuer: "https://keycloak.example.com/realms/my-realm",
        },
      },
    ],
  },
}
```

The Keycloak client must be a confidential OIDC client with the standard
(authorization code) flow enabled, and its valid redirect URIs must include
`callbackUrl` exactly.

The `id_token` returned by the token exchange is verified against the
realm's JWKS (`{issuer}/protocol/openid-connect/certs`), including issuer
and audience checks. Identities are keyed on the immutable `sub` claim.
`email_verified` is not enforced — self-hosted realms commonly run without
email verification — but the claim is passed through in `user_metadata` so
applications can enforce their own policy.

## Testing

In order to manually test the flow, you can do the following:

1. Create a confidential client in your Keycloak realm with the standard flow enabled
2. Add the test callback URL to the client's valid redirect URIs
3. Replace the values in the test with your realm issuer and client credentials
4. Remove the `server.listen()` call
5. Run the tests, get the `location` value from the `authenticate` test, open the browser
6. Once redirected, copy the `code` param from the URL, and add it in one of the `callback` success tests
7. Once you run the tests, you should get back an access token, id token, and so on.
