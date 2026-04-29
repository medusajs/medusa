import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { IAuthModuleService } from "@medusajs/types"
import jwt from "jsonwebtoken"

jest.setTimeout(30000)

const createMockIdToken = (payload: Record<string, any> = {}) => {
  return jwt.sign(
    {
      sub: "user-123",
      email: "john@doe.com",
      email_verified: true,
      name: "John Doe",
      given_name: "John",
      family_name: "Doe",
      ...payload,
    },
    "test-secret"
  )
}

const mockTokenFetch = jest.fn()
global.fetch = mockTokenFetch

const mockCache = new Map()
const inMemoryCache = {
  get: async (key: string) => mockCache.get(key) ?? null,
  set: async (key: string, data: any, ttl?: number) => {
    mockCache.set(key, data)
  },
  invalidate: async (key: string) => {
    mockCache.delete(key)
  },
  clear: async () => {
    mockCache.clear()
  },
}

moduleIntegrationTestRunner<IAuthModuleService>({
  moduleName: Modules.AUTH,
  moduleOptions: {
    cloud: {
      oauth_authorize_endpoint: "https://medusa.cloud/oauth/authorize",
      oauth_token_endpoint: "https://medusa.cloud/oauth/token",
      api_key: "test-api-key",
      callback_url: "https://store.app/oauth/callback",
      environment_handle: "test-environment",
    },
  },
  moduleDependencies: [Modules.CACHE],
  injectedDependencies: {
    [Modules.CACHE]: inMemoryCache,
  },
  testSuite: ({ service }) =>
    describe("Medusa Cloud Auth provider", () => {
      afterEach(() => {
        mockCache.clear()
        mockTokenFetch.mockReset()
      })

      describe("authenticate", () => {
        it("should redirect to authorization URL with default callback URL", async () => {
          const response = await service.authenticate("cloud", {
            query: {},
            body: {},
          })

          expect(response.success).toBe(true)
          expect(response.location).toBeDefined()
          const query = new URL(response.location!).searchParams
          expect(query.size).toBe(5)
          expect(query.get("redirect_uri")).toBe(
            "https://store.app/oauth/callback"
          )
          expect(query.get("client_id")).toBe("test-environment")
          expect(query.get("response_type")).toBe("code")
          expect(query.get("scope")).toBe("email profile openid")
          expect(query.get("state")?.length).toBeGreaterThan(0)
        })

        it("should redirect to authorization URL with overriden callback URL", async () => {
          const response = await service.authenticate("cloud", {
            query: {},
            body: {
              callback_url: "https://overriden-callback.app/oauth/callback",
            },
          })

          expect(response.success).toBe(true)
          expect(response.location).toBeDefined()
          const query = new URL(response.location!).searchParams
          expect(query.size).toBe(5)
          expect(query.get("redirect_uri")).toBe(
            "https://overriden-callback.app/oauth/callback"
          )
          expect(query.get("client_id")).toBe("test-environment")
          expect(query.get("response_type")).toBe("code")
          expect(query.get("scope")).toBe("email profile openid")
          expect(query.get("state")?.length).toBeGreaterThan(0)
        })
      })

      describe("validateCallback", () => {
        let state: string

        beforeEach(async () => {
          const response = await service.authenticate("cloud", {
            query: {},
            body: {},
          })

          expect(response.success).toBe(true)
          expect(response.location).toBeDefined()
          const query = new URL(response.location!).searchParams
          state = query.get("state")!

          mockTokenFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              id_token: createMockIdToken(),
            }),
          })
        })

        it("should validate a valid callback", async () => {
          const response = await service.validateCallback("cloud", {
            query: {
              code: "code1",
              state: state,
            },
          })
          expect(response).toMatchObject({
            success: true,
            authIdentity: {
              provider_identities: [
                {
                  entity_id: "user-123",
                  provider: "cloud",
                  user_metadata: {
                    email: "john@doe.com",
                    given_name: "John",
                    family_name: "Doe",
                    name: "John Doe",
                  },
                },
              ],
            },
          })

          expect(mockTokenFetch.mock.calls[0][0]).toBe(
            "https://medusa.cloud/oauth/token"
          )
          expect(mockTokenFetch.mock.calls[0][1].method).toBe("POST")
          expect(mockTokenFetch.mock.calls[0][1].headers).toEqual({
            "Content-Type": "application/x-www-form-urlencoded",
          })
          const body = mockTokenFetch.mock.calls[0][1].body as URLSearchParams
          expect(body.get("client_id")).toBe("test-environment")
          expect(body.get("client_secret")).toBe("test-api-key")
          expect(body.get("code")).toBe("code1")
          expect(body.get("redirect_uri")).toBe(
            "https://store.app/oauth/callback"
          )
          expect(body.get("grant_type")).toBe("authorization_code")
        })

        it("should return an error if the code is not provided", async () => {
          const response = await service.validateCallback("cloud", {
            query: {
              state: state,
            },
          })

          expect(response.success).toBe(false)
          expect(response.error).toBe("No code provided")
        })

        it("should return an error if the state is not provided", async () => {
          const response = await service.validateCallback("cloud", {
            query: {
              code: "code1",
            },
          })

          expect(response.success).toBe(false)
          expect(response.error).toBe("No state provided, or session expired")
        })

        it("should return an error if the state doesn't match the stored state", async () => {
          const response = await service.validateCallback("cloud", {
            query: {
              code: "code1",
              state: "other-state",
            },
          })

          expect(response.success).toBe(false)
          expect(response.error).toBe("No state provided, or session expired")
        })

        it("should return an error if the token exchange does not return an id_token", async () => {
          mockTokenFetch.mockReset()
          mockTokenFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
          })
          const response = await service.validateCallback("cloud", {
            query: {
              code: "code1",
              state: state,
            },
          })

          expect(response.success).toBe(false)
          expect(response.error).toBe("No id_token")
        })

        it("should return an error if the token exchange does not return a valid JWT id_token", async () => {
          mockTokenFetch.mockReset()
          mockTokenFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id_token: "invalid-jwt-token" }),
          })
          const response = await service.validateCallback("cloud", {
            query: {
              code: "code1",
              state: state,
            },
          })

          expect(response.success).toBe(false)
          expect(response.error).toBe("The id_token is not a valid JWT")
        })

        it("should return an error if the email is not verified", async () => {
          mockTokenFetch.mockReset()
          mockTokenFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              id_token: createMockIdToken({ email_verified: false }),
            }),
          })
          const response = await service.validateCallback("cloud", {
            query: {
              code: "code1",
              state: state,
            },
          })

          expect(response.success).toBe(false)
          expect(response.error).toBe(
            "Email not verified, cannot proceed with authentication"
          )
        })
      })
    }),
})

moduleIntegrationTestRunner<IAuthModuleService>({
  moduleName: Modules.AUTH,
  moduleOptions: {},
  moduleDependencies: [Modules.CACHE],
  injectedDependencies: {
    [Modules.CACHE]: inMemoryCache,
  },
  testSuite: ({ service }) =>
    describe("Medusa Cloud Auth provider - when cloud options are not provided", () => {
      it("should not enable Medusa Cloud Email provider", async () => {
        const error = await service
          .authenticate("cloud", {
            query: {},
            body: {},
          })
          .catch((e) => e)

        expect(error).toEqual({
          success: false,
          error: expect.stringContaining(
            "Unable to retrieve the auth provider with id: cloud"
          ),
        })
      })
    }),
})

moduleIntegrationTestRunner<IAuthModuleService>({
  moduleName: Modules.AUTH,
  moduleOptions: {
    cloud: {
      oauth_authorize_endpoint: "https://medusa.cloud/oauth/authorize",
      oauth_token_endpoint: "https://medusa.cloud/oauth/token",
      api_key: "test-api-key",
      callback_url: "https://store.app/oauth/callback",
      environment_handle: "test-environment",
      disabled: true,
    },
  },
  moduleDependencies: [Modules.CACHE],
  injectedDependencies: {
    [Modules.CACHE]: inMemoryCache,
  },
  testSuite: ({ service }) =>
    describe("Medusa Cloud Auth provider - when cloud auth is disabled", () => {
      it("should not enable Medusa Cloud Email provider", async () => {
        const error = await service
          .authenticate("cloud", {
            query: {},
            body: {},
          })
          .catch((e) => e)

        expect(error).toEqual({
          success: false,
          error: expect.stringContaining(
            "Unable to retrieve the auth provider with id: cloud"
          ),
        })
      })
    }),
})
