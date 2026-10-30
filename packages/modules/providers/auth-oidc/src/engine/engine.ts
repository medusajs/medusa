import { ICacheService } from "@medusajs/framework/types"
import { isDefined, MedusaError } from "@medusajs/framework/utils"
import type {
  Configuration,
  ServerMetadata,
  TokenEndpointResponse,
  TokenEndpointResponseHelpers,
} from "openid-client" with { "resolution-mode": "import" }
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

type OpenIdClient = typeof import("openid-client", {
  with: { "resolution-mode": "import" },
})

let openIdClient: OpenIdClient | undefined

// openid-client is ESM-only, so loading it eagerly breaks Jest suites that only load this provider
function loadOpenIdClient(): OpenIdClient {
  openIdClient ??= require("openid-client") as OpenIdClient
  return openIdClient
}

// openid-client throws generic messages ("something went wrong") with the actual reason as the cause
function getErrorReason(error: { message: string; cause?: unknown }): string {
  return error.cause instanceof Error ? error.cause.message : error.message
}

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
   * The memoized OIDC client configuration. `openid-client` caches the JWKS per
   * `Configuration` instance, so building a fresh one on every call would refetch
   * the JWKS over HTTP on every login callback. The client is built lazily and
   * reused until the discovery cache entry expires; when all endpoints are
   * configured explicitly (no discovery), it's cached indefinitely, since the
   * engine's options are immutable per instance.
   */
  protected clientPromise_?: Promise<Configuration>
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

    const client = loadOpenIdClient()
    const config = await this.getClient_()

    const codeVerifier = client.randomPKCECodeVerifier()
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier)
    const nonce = client.randomNonce()

    const scopes = input.scopes ?? this.options_.scopes ?? DEFAULT_SCOPES

    const url = client.buildAuthorizationUrl(config, {
      scope: scopes.join(" "),
      redirect_uri: input.callbackUrl ?? this.options_.callback_url,
      state: input.state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    })

    return { url: url.href, nonce, codeVerifier }
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

    const config = await this.getClient_()

    // openid-client derives the token request's redirect_uri from this URL, and
    // validates every authorization-response parameter in its query.
    const currentUrl = new URL(input.callbackUrl ?? this.options_.callback_url)
    currentUrl.search = new URLSearchParams(params).toString()

    let tokens: TokenEndpointResponse & TokenEndpointResponseHelpers
    try {
      tokens = await loadOpenIdClient().authorizationCodeGrant(
        config,
        currentUrl,
        {
          pkceCodeVerifier: input.codeVerifier,
          expectedNonce: input.nonce,
          expectedState: input.state,
        }
      )
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        `Could not validate the identity provider's response: ${getErrorReason(
          error
        )}`
      )
    }

    const claims = tokens.claims()
    if (!tokens.id_token || !claims) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "The identity provider did not return an ID token; ensure the 'openid' scope is requested"
      )
    }

    return {
      claims: { ...claims },
      tokens: {
        id_token: tokens.id_token,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at:
          tokens.expires_in === undefined
            ? undefined
            : Math.floor(Date.now() / 1000) + tokens.expires_in,
        token_type: tokens.token_type,
        scope: tokens.scope,
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

  protected async getClient_(): Promise<Configuration> {
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

  protected async buildClient_(): Promise<Configuration> {
    const client = loadOpenIdClient()
    const serverMetadata = await this.resolveServerMetadata_()

    const config = new client.Configuration(
      serverMetadata,
      this.options_.client_id,
      {
        redirect_uris: [this.options_.callback_url],
        response_types: ["code"],
        [client.clockTolerance]:
          this.options_.clock_tolerance_seconds ??
          DEFAULT_CLOCK_TOLERANCE_SECONDS,
      },
      this.options_.client_secret
        ? client.ClientSecretPost(this.options_.client_secret)
        : client.None()
    )

    config.timeout = this.httpTimeoutMs_ / 1000
    if (this.allowsInsecureRequests_(serverMetadata)) {
      client.allowInsecureRequests(config)
    }

    return config
  }

  // assertSecureUrl already limits http:// to localhost outside production
  protected allowsInsecureRequests_(metadata: ServerMetadata): boolean {
    return [
      metadata.issuer,
      metadata.authorization_endpoint,
      metadata.token_endpoint,
      metadata.jwks_uri,
    ].some((url) => url?.startsWith("http:"))
  }

  protected hasAllEndpointOverrides_(): boolean {
    return !!(
      this.options_.authorization_endpoint &&
      this.options_.token_endpoint &&
      this.options_.jwks_uri
    )
  }

  protected async resolveServerMetadata_(): Promise<ServerMetadata> {
    let base: ServerMetadata = { issuer: this.options_.issuer }
    if (!this.hasAllEndpointOverrides_()) {
      base = await this.discoverMetadata_()
    }

    // Explicit endpoint overrides take precedence over discovered values; the
    // configured issuer always wins so it matches the validated `iss` claim.
    return {
      ...base,
      issuer: this.options_.issuer,
      authorization_endpoint:
        this.options_.authorization_endpoint ?? base.authorization_endpoint,
      token_endpoint: this.options_.token_endpoint ?? base.token_endpoint,
      jwks_uri: this.options_.jwks_uri ?? base.jwks_uri,
      end_session_endpoint:
        this.options_.end_session_endpoint ?? base.end_session_endpoint,
    }
  }

  protected async discoverMetadata_(): Promise<ServerMetadata> {
    const key = `${DISCOVERY_CACHE_KEY_PREFIX}${this.options_.issuer}`

    const cached = await this.cache_?.get<ServerMetadata>(key)
    if (cached) {
      return cached
    }

    const client = loadOpenIdClient()
    let config: Configuration
    try {
      config = await client.discovery(
        new URL(this.options_.issuer),
        this.options_.client_id,
        undefined,
        undefined,
        {
          timeout: this.httpTimeoutMs_ / 1000,
          execute: this.options_.issuer.startsWith("http:")
            ? [client.allowInsecureRequests]
            : [],
        }
      )
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Could not discover the identity provider's configuration: ${getErrorReason(
          error
        )}`
      )
    }
    // The spread drops the non-enumerable helper methods so the result is cacheable.
    const metadata = { ...config.serverMetadata() }
    await this.cache_?.set(
      key,
      metadata,
      Math.floor(this.discoveryCacheTtlMs_ / 1000)
    )

    return metadata
  }
}
