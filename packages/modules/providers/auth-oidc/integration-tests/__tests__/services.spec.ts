import {
  AuthenticationInput,
  Logger,
  OidcAuthProviderOptions,
} from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { OidcAuthService } from "../../src/services/oidc"

const ISSUER = "https://idp.example.com"
const CALLBACK_URL = "https://app.example.com/callback"

const baseOptions = (
  overrides: Partial<OidcAuthProviderOptions> = {}
): OidcAuthProviderOptions => ({
  issuer: ISSUER,
  client_id: "client-123",
  client_secret: "super-secret",
  callback_url: CALLBACK_URL,
  ...overrides,
})

type MockEngine = {
  buildAuthorizationUrl: jest.Mock
  exchangeCode: jest.Mock
  mapClaims: jest.Mock
}

type MockAuthIdentityService = {
  setState: jest.Mock
  getState: jest.Mock
  retrieve: jest.Mock
  create: jest.Mock
  update: jest.Mock
}

const createLogger = (): Logger =>
  ({
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  } as unknown as Logger)

const createAuthIdentityService = (): MockAuthIdentityService => ({
  setState: jest.fn().mockResolvedValue(undefined),
  getState: jest.fn(),
  retrieve: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
})

const createService = (
  options: OidcAuthProviderOptions = baseOptions()
): { service: OidcAuthService; engine: MockEngine } => {
  const service = new OidcAuthService({ logger: createLogger() }, options)

  const engine: MockEngine = {
    buildAuthorizationUrl: jest.fn(),
    exchangeCode: jest.fn(),
    mapClaims: jest.fn(),
  }

  // Replace the real engine with a mock so no network I/O happens.
  ;(service as any).engine_ = engine

  return { service, engine }
}

describe("OidcAuthService", () => {
  describe("validateOptions", () => {
    it("throws when issuer is missing", () => {
      expect(() =>
        OidcAuthService.validateOptions(baseOptions({ issuer: "" }))
      ).toThrow(/requires an 'issuer'/)
    })

    it("throws when client_id is missing", () => {
      expect(() =>
        OidcAuthService.validateOptions(baseOptions({ client_id: "" }))
      ).toThrow(/requires a 'client_id'/)
    })

    it("throws when callback_url is missing", () => {
      expect(() =>
        OidcAuthService.validateOptions(baseOptions({ callback_url: "" }))
      ).toThrow(/requires a 'callback_url'/)
    })

    it("throws when the issuer is not https and not localhost", () => {
      expect(() =>
        OidcAuthService.validateOptions(
          baseOptions({ issuer: "http://idp.example.com" })
        )
      ).toThrow(/must use https/)
    })

    it("allows an http issuer on localhost", () => {
      expect(() =>
        OidcAuthService.validateOptions(
          baseOptions({ issuer: "http://localhost:8080" })
        )
      ).not.toThrow()
    })

    it("does not throw for valid options", () => {
      expect(() => OidcAuthService.validateOptions(baseOptions())).not.toThrow()
    })
  })

  describe("register", () => {
    it("throws NOT_ALLOWED", async () => {
      const { service } = createService()
      await expect(
        service.register({} as AuthenticationInput)
      ).rejects.toMatchObject({
        type: MedusaError.Types.NOT_ALLOWED,
      })
    })
  })

  describe("authenticate", () => {
    it("stores single-use state with the configured TTL and returns the location", async () => {
      const { service, engine } = createService(
        baseOptions({ state_ttl_seconds: 900, scopes: ["openid", "email"] })
      )
      const authIdentityService = createAuthIdentityService()

      engine.buildAuthorizationUrl.mockResolvedValue({
        url: "https://idp.example.com/authorize?state=abc",
        nonce: "nonce-value",
        codeVerifier: "verifier-value",
      })

      const result = await service.authenticate(
        { body: {} } as AuthenticationInput,
        authIdentityService as any
      )

      expect(result.success).toBe(true)
      expect(result.location).toBe(
        "https://idp.example.com/authorize?state=abc"
      )

      expect(engine.buildAuthorizationUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          callbackUrl: CALLBACK_URL,
          scopes: ["openid", "email"],
          state: expect.any(String),
        })
      )

      expect(authIdentityService.setState).toHaveBeenCalledTimes(1)
      const [stateKey, stateValue, ttl] =
        authIdentityService.setState.mock.calls[0]
      expect(typeof stateKey).toBe("string")
      expect(stateValue).toEqual({
        callback_url: CALLBACK_URL,
        nonce: "nonce-value",
        code_verifier: "verifier-value",
      })
      expect(ttl).toBe(900)
    })

    it("defaults the state TTL to 600 seconds", async () => {
      const { service, engine } = createService()
      const authIdentityService = createAuthIdentityService()

      engine.buildAuthorizationUrl.mockResolvedValue({
        url: "https://idp.example.com/authorize",
        nonce: "n",
        codeVerifier: "v",
      })

      await service.authenticate(
        { body: {} } as AuthenticationInput,
        authIdentityService as any
      )

      expect(authIdentityService.setState.mock.calls[0][2]).toBe(600)
    })

    it("allows a body callback_url that is in the allowlist", async () => {
      const override = "https://app.example.com/other"
      const { service, engine } = createService(
        baseOptions({ allowed_callback_urls: [CALLBACK_URL, override] })
      )
      const authIdentityService = createAuthIdentityService()

      engine.buildAuthorizationUrl.mockResolvedValue({
        url: "https://idp.example.com/authorize",
        nonce: "n",
        codeVerifier: "v",
      })

      const result = await service.authenticate(
        { body: { callback_url: override } } as unknown as AuthenticationInput,
        authIdentityService as any
      )

      expect(result.success).toBe(true)
      expect(engine.buildAuthorizationUrl).toHaveBeenCalledWith(
        expect.objectContaining({ callbackUrl: override })
      )
    })

    it("rejects a body callback_url that is not in the allowlist without echoing it", async () => {
      const { service, engine } = createService(
        baseOptions({ allowed_callback_urls: [CALLBACK_URL] })
      )
      const authIdentityService = createAuthIdentityService()

      const result = await service.authenticate(
        {
          body: { callback_url: "https://evil.example.com/callback" },
        } as unknown as AuthenticationInput,
        authIdentityService as any
      )

      expect(result.success).toBe(false)
      expect(result.error).not.toContain("evil.example.com")
      expect(engine.buildAuthorizationUrl).not.toHaveBeenCalled()
      expect(authIdentityService.setState).not.toHaveBeenCalled()
    })

    it("accepts any body callback_url when no allowlist is configured", async () => {
      const override = "https://other.example.com/callback"
      const { service, engine } = createService()
      const authIdentityService = createAuthIdentityService()

      engine.buildAuthorizationUrl.mockResolvedValue({
        url: "https://idp.example.com/authorize",
        nonce: "n",
        codeVerifier: "v",
      })

      const result = await service.authenticate(
        { body: { callback_url: override } } as unknown as AuthenticationInput,
        authIdentityService as any
      )

      expect(result.success).toBe(true)
      expect(engine.buildAuthorizationUrl).toHaveBeenCalledWith(
        expect.objectContaining({ callbackUrl: override })
      )
    })
  })

  describe("validateCallback", () => {
    const validState = {
      callback_url: CALLBACK_URL,
      nonce: "nonce-value",
      code_verifier: "verifier-value",
    }

    it("creates a new auth identity on NOT_FOUND", async () => {
      const { service, engine } = createService()
      const authIdentityService = createAuthIdentityService()

      authIdentityService.getState.mockResolvedValue(validState)
      engine.exchangeCode.mockResolvedValue({
        claims: { sub: "user-1", email: "a@acme.com" },
        tokens: {},
      })
      engine.mapClaims.mockReturnValue({
        entityId: "user-1",
        userMetadata: { email: "a@acme.com" },
      })
      authIdentityService.retrieve.mockRejectedValue(
        new MedusaError(MedusaError.Types.NOT_FOUND, "not found")
      )
      authIdentityService.create.mockResolvedValue({ id: "authid_1" })

      const result = await service.validateCallback(
        {
          query: { code: "the-code", state: "state-key" },
        } as unknown as AuthenticationInput,
        authIdentityService as any
      )

      expect(result.success).toBe(true)
      expect(result.authIdentity).toEqual({ id: "authid_1" })
      expect(authIdentityService.getState).toHaveBeenCalledTimes(1)
      expect(authIdentityService.getState).toHaveBeenCalledWith("state-key")
      expect(engine.exchangeCode).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { code: "the-code", state: "state-key" },
          nonce: "nonce-value",
          codeVerifier: "verifier-value",
          callbackUrl: CALLBACK_URL,
          state: "state-key",
        })
      )
      expect(authIdentityService.create).toHaveBeenCalledWith({
        entity_id: "user-1",
        user_metadata: { email: "a@acme.com" },
      })
      expect(authIdentityService.update).not.toHaveBeenCalled()
    })

    it("updates the existing auth identity to refresh claims", async () => {
      const { service, engine } = createService()
      const authIdentityService = createAuthIdentityService()

      authIdentityService.getState.mockResolvedValue(validState)
      engine.exchangeCode.mockResolvedValue({
        claims: { sub: "user-1" },
        tokens: {},
      })
      engine.mapClaims.mockReturnValue({
        entityId: "user-1",
        userMetadata: { email: "new@acme.com" },
      })
      authIdentityService.retrieve.mockResolvedValue({ id: "authid_1" })
      authIdentityService.update.mockResolvedValue({
        id: "authid_1",
        user_metadata: { email: "new@acme.com" },
      })

      const result = await service.validateCallback(
        {
          query: { code: "the-code", state: "state-key" },
        } as unknown as AuthenticationInput,
        authIdentityService as any
      )

      expect(result.success).toBe(true)
      expect(authIdentityService.update).toHaveBeenCalledWith("user-1", {
        user_metadata: { email: "new@acme.com" },
      })
      expect(authIdentityService.create).not.toHaveBeenCalled()
    })

    it("fails when the state is missing or expired", async () => {
      const { service, engine } = createService()
      const authIdentityService = createAuthIdentityService()

      authIdentityService.getState.mockResolvedValue(null)

      const result = await service.validateCallback(
        {
          query: { code: "the-code", state: "state-key" },
        } as unknown as AuthenticationInput,
        authIdentityService as any
      )

      expect(result).toEqual({
        success: false,
        error: "No state provided, or session expired",
      })
      expect(engine.exchangeCode).not.toHaveBeenCalled()
    })

    it("fails when no state key is provided", async () => {
      const { service } = createService()
      const authIdentityService = createAuthIdentityService()

      const result = await service.validateCallback(
        { query: { code: "the-code" } } as unknown as AuthenticationInput,
        authIdentityService as any
      )

      expect(result).toEqual({
        success: false,
        error: "No state provided, or session expired",
      })
      expect(authIdentityService.getState).not.toHaveBeenCalled()
    })

    it("fails when no code is provided", async () => {
      const { service } = createService()
      const authIdentityService = createAuthIdentityService()

      const result = await service.validateCallback(
        { query: { state: "state-key" } } as unknown as AuthenticationInput,
        authIdentityService as any
      )

      expect(result).toEqual({ success: false, error: "No code provided" })
    })

    it("handles an IdP error query param generically without reflecting it", async () => {
      const { service } = createService()
      const authIdentityService = createAuthIdentityService()

      const result = await service.validateCallback(
        {
          query: {
            error: "access_denied",
            error_description: "<script>alert(1)</script>",
          },
        } as unknown as AuthenticationInput,
        authIdentityService as any
      )

      expect(result.success).toBe(false)
      expect(result.error).toBe("Authentication failed")
      expect(result.error).not.toContain("script")
      expect(authIdentityService.getState).not.toHaveBeenCalled()
    })

    it("returns a generic failure when the engine rejects the callback", async () => {
      const { service, engine } = createService()
      const authIdentityService = createAuthIdentityService()

      authIdentityService.getState.mockResolvedValue(validState)
      engine.exchangeCode.mockRejectedValue(
        new MedusaError(
          MedusaError.Types.UNAUTHORIZED,
          "nonce mismatch detail that must not leak"
        )
      )

      const result = await service.validateCallback(
        {
          query: { code: "the-code", state: "state-key" },
        } as unknown as AuthenticationInput,
        authIdentityService as any
      )

      expect(result.success).toBe(false)
      expect(result.error).toBe("Authentication failed")
      expect(result.error).not.toContain("nonce")
    })
  })
})
