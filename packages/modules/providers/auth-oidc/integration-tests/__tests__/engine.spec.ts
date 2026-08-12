import { MedusaError } from "@medusajs/framework/utils"
import { Issuer } from "openid-client"
import { OidcEngine } from "../../src/engine/engine"
import { OidcEngineOptions } from "../../src/engine/types"

const ISSUER = "https://idp.example.com"
const AUTHORIZATION_ENDPOINT = "https://idp.example.com/authorize"
const TOKEN_ENDPOINT = "https://idp.example.com/token"
const JWKS_URI = "https://idp.example.com/jwks"
const CALLBACK_URL = "https://app.example.com/callback"

const baseOptions = (
  overrides: Partial<OidcEngineOptions> = {}
): OidcEngineOptions => ({
  issuer: ISSUER,
  client_id: "client-123",
  client_secret: "super-secret",
  callback_url: CALLBACK_URL,
  authorization_endpoint: AUTHORIZATION_ENDPOINT,
  token_endpoint: TOKEN_ENDPOINT,
  jwks_uri: JWKS_URI,
  ...overrides,
})

describe("OidcEngine", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  describe("constructor validation", () => {
    it("throws when the issuer is missing", () => {
      expect(() => new OidcEngine({ ...baseOptions(), issuer: "" })).toThrow(
        /requires an 'issuer'/
      )
    })

    it("throws when client_id is missing", () => {
      expect(() => new OidcEngine({ ...baseOptions(), client_id: "" })).toThrow(
        /requires a 'client_id'/
      )
    })

    it("throws when callback_url is missing", () => {
      expect(
        () => new OidcEngine({ ...baseOptions(), callback_url: "" })
      ).toThrow(/requires a 'callback_url'/)
    })

    it("rejects a non-https issuer that isn't localhost", () => {
      expect(
        () => new OidcEngine(baseOptions({ issuer: "http://idp.example.com" }))
      ).toThrow(/must use https/)
    })

    it("allows an http issuer on localhost", () => {
      expect(
        () =>
          new OidcEngine(
            baseOptions({
              issuer: "http://localhost:4000",
              authorization_endpoint: "http://localhost:4000/authorize",
              token_endpoint: "http://localhost:4000/token",
              jwks_uri: "http://localhost:4000/jwks",
            })
          )
      ).not.toThrow()
    })

    it("rejects an http issuer on localhost in production", () => {
      const nodeEnv = process.env.NODE_ENV
      process.env.NODE_ENV = "production"

      try {
        expect(
          () =>
            new OidcEngine(
              baseOptions({
                issuer: "http://localhost:4000",
                authorization_endpoint: "http://localhost:4000/authorize",
                token_endpoint: "http://localhost:4000/token",
                jwks_uri: "http://localhost:4000/jwks",
              })
            )
        ).toThrow(/must use https/)
      } finally {
        process.env.NODE_ENV = nodeEnv
      }
    })

    it("rejects a non-https endpoint override", () => {
      expect(
        () =>
          new OidcEngine(
            baseOptions({ token_endpoint: "http://idp.example.com/token" })
          )
      ).toThrow(/must use https/)
    })
  })

  describe("buildAuthorizationUrl", () => {
    it("builds an authorization URL with PKCE, nonce, and state (no discovery when endpoints are set)", async () => {
      const discoverSpy = jest.spyOn(Issuer, "discover")
      const engine = new OidcEngine(baseOptions())

      const result = await engine.buildAuthorizationUrl({ state: "state-key" })

      expect(discoverSpy).not.toHaveBeenCalled()

      const url = new URL(result.url)
      expect(`${url.origin}${url.pathname}`).toBe(AUTHORIZATION_ENDPOINT)
      expect(url.searchParams.get("response_type")).toBe("code")
      expect(url.searchParams.get("client_id")).toBe("client-123")
      expect(url.searchParams.get("redirect_uri")).toBe(CALLBACK_URL)
      expect(url.searchParams.get("scope")).toBe("openid email profile")
      expect(url.searchParams.get("state")).toBe("state-key")
      expect(url.searchParams.get("nonce")).toBe(result.nonce)
      expect(url.searchParams.get("code_challenge")).toBeTruthy()
      expect(url.searchParams.get("code_challenge_method")).toBe("S256")

      // PKCE verifier is a high-entropy string (43-128 chars per RFC 7636).
      expect(result.codeVerifier.length).toBeGreaterThanOrEqual(43)
      expect(result.nonce.length).toBeGreaterThan(0)
    })

    it("uses the configured scopes and overridden callback URL", async () => {
      const engine = new OidcEngine(
        baseOptions({ scopes: ["openid", "email"] })
      )

      const result = await engine.buildAuthorizationUrl({
        state: "state-key",
        callbackUrl: "https://other.example.com/callback",
      })

      const url = new URL(result.url)
      expect(url.searchParams.get("scope")).toBe("openid email")
      expect(url.searchParams.get("redirect_uri")).toBe(
        "https://other.example.com/callback"
      )
    })

    it("generates a fresh nonce and code verifier on each call", async () => {
      const engine = new OidcEngine(baseOptions())

      const first = await engine.buildAuthorizationUrl({ state: "a" })
      const second = await engine.buildAuthorizationUrl({ state: "b" })

      expect(first.nonce).not.toBe(second.nonce)
      expect(first.codeVerifier).not.toBe(second.codeVerifier)
    })

    it("throws when no state is provided", async () => {
      const engine = new OidcEngine(baseOptions())
      await expect(engine.buildAuthorizationUrl({ state: "" })).rejects.toThrow(
        /'state' value is required/
      )
    })
  })

  describe("exchangeCode", () => {
    it("throws when no code is provided", async () => {
      const engine = new OidcEngine(baseOptions())

      await expect(
        engine.exchangeCode({
          params: {},
          nonce: "nonce",
          codeVerifier: "verifier",
        })
      ).rejects.toThrow(/authorization 'code' is required/)
    })

    it("throws UNAUTHORIZED when the token response contains no ID token", async () => {
      const engine = new OidcEngine(baseOptions())

      // Simulate a token endpoint response without an id_token, which happens
      // when the 'openid' scope isn't requested.
      jest.spyOn(engine as any, "getClient_").mockResolvedValue({
        callback: jest.fn().mockResolvedValue({
          access_token: "access-token",
          token_type: "Bearer",
        }),
      })

      const error = await engine
        .exchangeCode({
          params: { code: "code-123" },
          nonce: "nonce",
          codeVerifier: "verifier",
        })
        .catch((e) => e)

      expect(error).toBeInstanceOf(MedusaError)
      expect(error.type).toBe(MedusaError.Types.UNAUTHORIZED)
      expect(error.message).toMatch(
        /did not return an ID token.*'openid' scope/
      )
    })
  })

  describe("client caching", () => {
    it("builds the client once and reuses it across calls", async () => {
      const engine = new OidcEngine(baseOptions())
      const buildSpy = jest.spyOn(engine as any, "buildClient_")

      await engine.buildAuthorizationUrl({ state: "one" })
      await engine.buildAuthorizationUrl({ state: "two" })

      const firstClient = await (engine as any).getClient_()
      const secondClient = await (engine as any).getClient_()

      expect(buildSpy).toHaveBeenCalledTimes(1)
      expect(firstClient).toBe(secondClient)
    })

    it("shares a single client build between concurrent first calls", async () => {
      const engine = new OidcEngine(baseOptions())
      const buildSpy = jest.spyOn(engine as any, "buildClient_")

      const [first, second] = await Promise.all([
        (engine as any).getClient_(),
        (engine as any).getClient_(),
      ])

      expect(buildSpy).toHaveBeenCalledTimes(1)
      expect(first).toBe(second)
    })

    it("rebuilds the client after the discovery TTL lapses", async () => {
      const discoveredIssuer = new Issuer({
        issuer: ISSUER,
        authorization_endpoint: AUTHORIZATION_ENDPOINT,
        token_endpoint: TOKEN_ENDPOINT,
        jwks_uri: JWKS_URI,
      })
      const discoverSpy = jest
        .spyOn(Issuer, "discover")
        .mockResolvedValue(discoveredIssuer)

      const ttlMs = 1000

      // No endpoint overrides -> discovery is used and the client's lifetime is
      // aligned with the discovery cache TTL.
      const engine = new OidcEngine({
        issuer: ISSUER,
        client_id: "client-123",
        client_secret: "super-secret",
        callback_url: CALLBACK_URL,
        discovery_cache_ttl_ms: ttlMs,
      })
      const buildSpy = jest.spyOn(engine as any, "buildClient_")

      const start = Date.now()
      const nowSpy = jest.spyOn(Date, "now").mockReturnValue(start)

      const firstClient = await (engine as any).getClient_()
      const cachedClient = await (engine as any).getClient_()
      expect(cachedClient).toBe(firstClient)
      expect(buildSpy).toHaveBeenCalledTimes(1)
      expect(discoverSpy).toHaveBeenCalledTimes(1)

      // Advance past the TTL: both the client and discovery caches expire.
      nowSpy.mockReturnValue(start + ttlMs + 1)

      const rebuiltClient = await (engine as any).getClient_()
      expect(rebuiltClient).not.toBe(firstClient)
      expect(buildSpy).toHaveBeenCalledTimes(2)
      expect(discoverSpy).toHaveBeenCalledTimes(2)
    })

    it("does not cache a failed client build", async () => {
      jest
        .spyOn(Issuer, "discover")
        .mockRejectedValueOnce(new Error("network down"))
        .mockResolvedValueOnce(
          new Issuer({
            issuer: ISSUER,
            authorization_endpoint: AUTHORIZATION_ENDPOINT,
            token_endpoint: TOKEN_ENDPOINT,
            jwks_uri: JWKS_URI,
          })
        )

      const engine = new OidcEngine({
        issuer: ISSUER,
        client_id: "client-123",
        callback_url: CALLBACK_URL,
      })

      await expect((engine as any).getClient_()).rejects.toThrow(/network down/)

      // The failure isn't memoized: the next call retries and succeeds.
      const client = await (engine as any).getClient_()
      expect(client).toBeDefined()
    })
  })

  describe("discovery caching via the cache module", () => {
    const discoveredIssuer = () =>
      new Issuer({
        issuer: ISSUER,
        authorization_endpoint: AUTHORIZATION_ENDPOINT,
        token_endpoint: TOKEN_ENDPOINT,
        jwks_uri: JWKS_URI,
      })

    const options: OidcEngineOptions = {
      issuer: ISSUER,
      client_id: "client-123",
      callback_url: CALLBACK_URL,
      discovery_cache_ttl_ms: 3600_000,
    }

    it("stores the discovery document in the cache module on a miss", async () => {
      const discoverSpy = jest
        .spyOn(Issuer, "discover")
        .mockResolvedValue(discoveredIssuer())

      const cache = {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(undefined),
        invalidate: jest.fn().mockResolvedValue(undefined),
      }

      const engine = new OidcEngine(options, cache as any)
      await engine.buildAuthorizationUrl({ state: "one" })

      expect(cache.get).toHaveBeenCalledWith(`oidc:discovery:${ISSUER}`)
      expect(discoverSpy).toHaveBeenCalledTimes(1)
      // TTL is passed to the cache module in seconds.
      expect(cache.set).toHaveBeenCalledWith(
        `oidc:discovery:${ISSUER}`,
        expect.objectContaining({ issuer: ISSUER }),
        3600
      )
    })

    it("uses the cached discovery document and skips network discovery on a hit", async () => {
      const discoverSpy = jest.spyOn(Issuer, "discover")

      const cache = {
        get: jest.fn().mockResolvedValue(discoveredIssuer().metadata),
        set: jest.fn().mockResolvedValue(undefined),
        invalidate: jest.fn().mockResolvedValue(undefined),
      }

      const engine = new OidcEngine(options, cache as any)
      await engine.buildAuthorizationUrl({ state: "one" })

      expect(cache.get).toHaveBeenCalledWith(`oidc:discovery:${ISSUER}`)
      expect(discoverSpy).not.toHaveBeenCalled()
      expect(cache.set).not.toHaveBeenCalled()
    })
  })

  describe("mapClaims", () => {
    it("maps sub to entityId and profile claims to user_metadata by default", () => {
      const engine = new OidcEngine(baseOptions())

      const mapped = engine.mapClaims({
        sub: "user-1",
        email: "alice@acme.com",
        email_verified: true,
        name: "Alice",
        picture: "https://cdn.example.com/alice.png",
      })

      expect(mapped.entityId).toBe("user-1")
      expect(mapped.userMetadata).toEqual({
        email: "alice@acme.com",
        name: "Alice",
      })
    })

    it("supports custom claim mappings", () => {
      const engine = new OidcEngine(
        baseOptions({
          claim_mappings: {
            entity_id: "oid",
            email: "upn",
            name: "display_name",
            department: "dept",
          },
        })
      )

      const mapped = engine.mapClaims({
        oid: "azure-oid-123",
        upn: "bob@acme.com",
        email_verified: true,
        display_name: "Bob",
        dept: "Engineering",
      })

      expect(mapped.entityId).toBe("azure-oid-123")
      expect(mapped.userMetadata).toEqual({
        email: "bob@acme.com",
        name: "Bob",
        department: "Engineering",
      })
    })

    it("throws when the entity_id claim is missing", () => {
      const engine = new OidcEngine(baseOptions())

      const error = getError(() =>
        engine.mapClaims({ email: "a@acme.com", email_verified: true })
      )
      expect(error.type).toBe(MedusaError.Types.INVALID_DATA)
      expect(error.message).toMatch(/missing the 'sub' claim/)
    })

    it("throws when email is not verified and verification is required", () => {
      const engine = new OidcEngine(baseOptions())

      const error = getError(() =>
        engine.mapClaims({
          sub: "user-1",
          email: "a@acme.com",
          email_verified: false,
        })
      )
      expect(error.type).toBe(MedusaError.Types.INVALID_DATA)
      expect(error.message).toMatch(/verified email/)
    })

    it("allows unverified email when require_verified_email is false", () => {
      const engine = new OidcEngine(
        baseOptions({ require_verified_email: false })
      )

      const mapped = engine.mapClaims({
        sub: "user-1",
        email: "a@acme.com",
        email_verified: false,
      })

      expect(mapped.entityId).toBe("user-1")
    })

    it("enforces the allowed_email_domains policy", () => {
      const engine = new OidcEngine(
        baseOptions({ allowed_email_domains: ["acme.com"] })
      )

      // Allowed domain passes.
      expect(
        engine.mapClaims({
          sub: "user-1",
          email: "alice@ACME.com",
          email_verified: true,
        }).entityId
      ).toBe("user-1")

      // Disallowed domain is rejected with UNAUTHORIZED.
      const error = getError(() =>
        engine.mapClaims({
          sub: "user-2",
          email: "eve@evil.com",
          email_verified: true,
        })
      )
      expect(error.type).toBe(MedusaError.Types.UNAUTHORIZED)
    })
  })
})

function getError(fn: () => unknown): MedusaError {
  try {
    fn()
  } catch (e) {
    return e as MedusaError
  }
  throw new Error("Expected function to throw, but it did not")
}
