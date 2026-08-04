import { ICacheService } from "@medusajs/framework/types"
import { isDefined, MedusaError } from "@medusajs/framework/utils"
import {
  Client,
  custom,
  generators,
  Issuer,
  IssuerMetadata,
  TokenSet,
} from "openid-client"
import {
  OidcAuthorizationUrlResult,
  OidcBuildAuthorizationUrlInput,
  OidcClaimMappings,
  OidcEngineOptions,
  OidcExchangeCodeInput,
  OidcExchangeCodeResult,
  OidcMappedClaims,
} from "./types"
import { assertSecureUrl } from "../utils"

const DEFAULT_SCOPES = ["openid", "email", "profile"]
const DEFAULT_CLOCK_TOLERANCE_SECONDS = 5
const DEFAULT_DISCOVERY_CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour
const DEFAULT_HTTP_TIMEOUT_MS = 10_000

const DEFAULT_CLAIM_MAPPINGS: OidcClaimMappings = {
  entity_id: "sub",
  email: "email",
  name: "name",
}

// Cache-module key prefix for cached discovery documents.
const DISCOVERY_CACHE_KEY_PREFIX = "oidc:discovery:"

// Apply a sane default timeout to all outgoing HTTP requests (discovery, JWKS,
// token exchange) so an IdP outage degrades to a login failure rather than a hang.
custom.setHttpOptionsDefaults({ timeout: DEFAULT_HTTP_TIMEOUT_MS })

/**
 * A reusable OIDC engine built on `openid-client`. It handles discovery,
 * building the authorization URL (PKCE + nonce), exchanging the authorization
 * code with full ID-token validation, and mapping validated claims to an
 * auth-identity shape.
 */
export class OidcEngine {
  protected readonly options_: OidcEngineOptions
  protected readonly discoveryCacheTtlMs_: number
  protected readonly httpTimeoutMs_: number
  protected readonly cache_?: ICacheService

  /**
   * The memoized OIDC client. `openid-client` v5 caches the JWKS keystore per
   * `Issuer` instance, so building a fresh client on every call would refetch
   * the JWKS over HTTP on every login callback. The client is built lazily and
   * reused until the discovery cache entry expires; when all endpoints are
   * configured explicitly (no discovery), it's cached indefinitely, since the
   * engine's options are immutable per instance.
   */
  protected clientPromise_?: Promise<Client>
  protected clientExpiresAt_ = 0

  constructor(options: OidcEngineOptions, cache?: ICacheService) {
    if (!options?.issuer) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "OIDC engine requires an 'issuer' option"
      )
    }
    if (!options.client_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "OIDC engine requires a 'client_id' option"
      )
    }
    if (!options.callback_url) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "OIDC engine requires a 'callback_url' option"
      )
    }

    assertSecureUrl(options.issuer, "issuer")
    for (const [key, value] of [
      ["authorization_endpoint", options.authorization_endpoint],
      ["token_endpoint", options.token_endpoint],
      ["jwks_uri", options.jwks_uri],
    ] as const) {
      if (value) {
        assertSecureUrl(value, key)
      }
    }

    this.options_ = options
    this.discoveryCacheTtlMs_ =
      options.discovery_cache_ttl_ms ?? DEFAULT_DISCOVERY_CACHE_TTL_MS
    this.httpTimeoutMs_ = options.http_timeout_ms ?? DEFAULT_HTTP_TIMEOUT_MS
    this.cache_ = cache
  }

  /**
   * Builds the authorization URL to redirect the browser to, generating a fresh
   * PKCE code verifier/challenge (S256) and nonce. The returned `nonce` and
   * `codeVerifier` must be persisted alongside the state so they can be replayed
   * when validating the callback.
   */
  async buildAuthorizationUrl(
    input: OidcBuildAuthorizationUrlInput
  ): Promise<OidcAuthorizationUrlResult> {
    if (!input?.state) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "A 'state' value is required to build the authorization URL"
      )
    }

    const client = await this.getClient_()

    const codeVerifier = generators.codeVerifier()
    const codeChallenge = generators.codeChallenge(codeVerifier)
    const nonce = generators.nonce()

    const scopes = input.scopes ?? this.options_.scopes ?? DEFAULT_SCOPES

    const url = client.authorizationUrl({
      scope: scopes.join(" "),
      redirect_uri: input.callbackUrl ?? this.options_.callback_url,
      state: input.state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    })

    return { url, nonce, codeVerifier }
  }

  /**
   * Exchanges the authorization code for tokens and performs full ID-token
   * validation via `openid-client` (signature through JWKS, `iss`, `aud`/`azp`,
   * `exp`/`iat`/`nbf` with clock tolerance, and `nonce`). Returns the validated
   * claims plus the tokens.
   */
  async exchangeCode(
    input: OidcExchangeCodeInput
  ): Promise<OidcExchangeCodeResult> {
    const params = input?.params ?? {}

    if (!params.code) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "An authorization 'code' is required to exchange for tokens"
      )
    }

    const client = await this.getClient_()
    const redirectUri = input.callbackUrl ?? this.options_.callback_url

    let tokenSet: TokenSet
    try {
      // Forward every authorization-response parameter so
      // openid-client can enforce all applicable checks. The `checks` argument
      // carries the values we stored ourselves (PKCE verifier, nonce, state).
      tokenSet = await client.callback(redirectUri, params, {
        code_verifier: input.codeVerifier,
        nonce: input.nonce,
        state: input.state,
      })
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        `Could not validate the identity provider's response: ${error.message}`
      )
    }

    // Without the `openid` scope, the token endpoint returns no ID token and
    // `tokenSet.claims()` would throw an unhelpful TypeError.
    if (!tokenSet.id_token) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "The identity provider did not return an ID token; ensure the 'openid' scope is requested"
      )
    }

    const claims = tokenSet.claims()

    return {
      claims: { ...claims },
      tokens: {
        id_token: tokenSet.id_token,
        access_token: tokenSet.access_token,
        refresh_token: tokenSet.refresh_token,
        expires_at: tokenSet.expires_at,
        token_type: tokenSet.token_type,
        scope: tokenSet.scope,
      },
    }
  }

  /**
   * Maps validated ID-token claims to an auth-identity shape, applying the
   * `require_verified_email` and `allowed_email_domains` policy checks.
   *
   * `entity_id` defaults to the `sub` claim (never the email, which is mutable
   * and reassignable).
   */
  mapClaims(claims: Record<string, unknown>): OidcMappedClaims {
    const mappings: OidcClaimMappings = {
      ...DEFAULT_CLAIM_MAPPINGS,
      ...this.options_.claim_mappings,
    }

    const entityIdClaim = mappings.entity_id ?? "sub"
    const entityIdValue = claims[entityIdClaim]

    if (
      entityIdValue === undefined ||
      entityIdValue === null ||
      entityIdValue === ""
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The identity provider's ID token is missing the '${entityIdClaim}' claim used to identify the user`
      )
    }

    const emailClaim = mappings.email ?? "email"
    const email = claims[emailClaim]

    const requireVerifiedEmail = this.options_.require_verified_email ?? true
    if (requireVerifiedEmail && claims.email_verified !== true) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The identity provider did not confirm a verified email address"
      )
    }

    if (this.options_.allowed_email_domains?.length) {
      const allowedDomains = this.options_.allowed_email_domains.map((domain) =>
        domain.toLowerCase()
      )
      const domain =
        typeof email === "string"
          ? email.split("@")[1]?.toLowerCase()
          : undefined

      if (!domain || !allowedDomains.includes(domain)) {
        throw new MedusaError(
          MedusaError.Types.UNAUTHORIZED,
          "The email domain is not allowed to authenticate with this provider"
        )
      }
    }

    const userMetadata: Record<string, unknown> = {}
    for (const [field, claimName] of Object.entries(mappings)) {
      if (field === "entity_id" || !claimName) {
        continue
      }
      if (isDefined(claims[claimName])) {
        userMetadata[field] = claims[claimName]
      }
    }

    return {
      entityId: String(entityIdValue),
      userMetadata,
    }
  }

  protected async getClient_(): Promise<Client> {
    const now = Date.now()

    if (
      this.clientPromise_ &&
      (this.hasAllEndpointOverrides_() || now < this.clientExpiresAt_)
    ) {
      return this.clientPromise_
    }

    // Memoize the in-flight promise synchronously so concurrent first calls
    // share a single client build instead of racing.
    const promise = this.buildClient_()
    this.clientPromise_ = promise
    this.clientExpiresAt_ = now + this.discoveryCacheTtlMs_

    try {
      return await promise
    } catch (error) {
      // Never cache a failed build; the next call retries.
      if (this.clientPromise_ === promise) {
        this.clientPromise_ = undefined
        this.clientExpiresAt_ = 0
      }
      throw error
    }
  }

  protected async buildClient_(): Promise<Client> {
    const issuer = await this.resolveIssuer_()

    const client = new issuer.Client({
      client_id: this.options_.client_id,
      ...(this.options_.client_secret
        ? { client_secret: this.options_.client_secret }
        : {}),
      redirect_uris: [this.options_.callback_url],
      response_types: ["code"],
      token_endpoint_auth_method: this.options_.client_secret
        ? "client_secret_post"
        : "none",
    })

    client[custom.clock_tolerance] =
      this.options_.clock_tolerance_seconds ?? DEFAULT_CLOCK_TOLERANCE_SECONDS
    client[custom.http_options] = () => ({ timeout: this.httpTimeoutMs_ })

    return client
  }

  protected hasAllEndpointOverrides_(): boolean {
    return !!(
      this.options_.authorization_endpoint &&
      this.options_.token_endpoint &&
      this.options_.jwks_uri
    )
  }

  protected async resolveIssuer_(): Promise<Issuer> {
    let base: IssuerMetadata = { issuer: this.options_.issuer }
    if (!this.hasAllEndpointOverrides_()) {
      base = await this.discoverMetadata_()
    }

    // Explicit endpoint overrides take precedence over discovered values; the
    // configured issuer always wins so it matches the validated `iss` claim.
    return new Issuer({
      ...base,
      issuer: this.options_.issuer,
      authorization_endpoint:
        this.options_.authorization_endpoint ?? base.authorization_endpoint,
      token_endpoint: this.options_.token_endpoint ?? base.token_endpoint,
      jwks_uri: this.options_.jwks_uri ?? base.jwks_uri,
      end_session_endpoint:
        this.options_.end_session_endpoint ?? base.end_session_endpoint,
    })
  }

  protected async discoverMetadata_(): Promise<IssuerMetadata> {
    const key = `${DISCOVERY_CACHE_KEY_PREFIX}${this.options_.issuer}`

    const cached = await this.cache_?.get<IssuerMetadata>(key)
    if (cached) {
      return cached
    }

    const metadata = (await Issuer.discover(this.options_.issuer)).metadata
    await this.cache_?.set(
      key,
      metadata,
      Math.floor(this.discoveryCacheTtlMs_ / 1000)
    )

    return metadata
  }
}
