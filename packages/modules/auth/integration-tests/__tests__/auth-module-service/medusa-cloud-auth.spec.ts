import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { IAuthModuleService } from "@medusajs/types"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

jest.setTimeout(30000)

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
})

const KID = "test-kid"

const jwkPublic = {
  ...(publicKey.export({ format: "jwk" }) as Record<string, string>),
  kid: KID,
  use: "sig",
  alg: "RS256",
}

const TOKEN_ENDPOINT = "https://medusa.cloud/oauth/token"
const JWKS_URI = "https://medusa.cloud/oauth/jwks"

const createMockIdToken = (payload: Record<string, any> = {}) => {
  return jwt.sign(
    {
      sub: "user-123",
      email: "john@doe.com",
      email_verified: true,
      name: "John Doe",
      given_name: "John",
      family_name: "Doe",
      aud: "test-environment",
      ...payload,
    },
    privateKey.export({ format: "pem", type: "pkcs8" }),
    {
      algorithm: "RS256",
      keyid: KID,
      expiresIn: "1d",
    }
  )
}

type TokenResponse = {
  status?: number
  body: Record<string, unknown>
}

let nextTokenResponse: TokenResponse | null = null
let lastTokenRequest: {
  url: string
  method: string
  headers: Record<string, string>
  body: URLSearchParams
} | null = null

const server = setupServer(
  http.get(JWKS_URI, () => HttpResponse.json({ keys: [jwkPublic] })),

  http.post(TOKEN_ENDPOINT, async ({ request }) => {
    const rawBody = await request.text()
    lastTokenRequest = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: new URLSearchParams(rawBody),
    }

    if (!nextTokenResponse) {
      return HttpResponse.json({}, { status: 500 })
    }
    const { status = 200, body } = nextTokenResponse
    return HttpResponse.json(body, { status })
  })
)

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }))
afterAll(() => server.close())

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
      oauth_token_endpoint: TOKEN_ENDPOINT,
      oauth_jwks_uri: JWKS_URI,
      oauth_audience: "test-environment",
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
        nextTokenResponse = null
        lastTokenRequest = null
        server.resetHandlers(
          http.get(JWKS_URI, () => HttpResponse.json({ keys: [jwkPublic] })),
          http.post(TOKEN_ENDPOINT, async ({ request }) => {
            const rawBody = await request.text()
            lastTokenRequest = {
              url: request.url,
              method: request.method,
              headers: Object.fromEntries(request.headers.entries()),
              body: new URLSearchParams(rawBody),
            }
            if (!nextTokenResponse) {
              return HttpResponse.json({}, { status: 500 })
            }
            const { status = 200, body } = nextTokenResponse
            return HttpResponse.json(body, { status })
          })
        )
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

          nextTokenResponse = {
            body: { id_token: createMockIdToken() },
          }
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

          expect(lastTokenRequest).not.toBeNull()
          expect(lastTokenRequest!.url).toBe(TOKEN_ENDPOINT)
          expect(lastTokenRequest!.method).toBe("POST")
          expect(lastTokenRequest!.headers["content-type"]).toContain(
            "application/x-www-form-urlencoded"
          )
          expect(lastTokenRequest!.body.get("client_id")).toBe("test-environment")
          expect(lastTokenRequest!.body.get("client_secret")).toBe("test-api-key")
          expect(lastTokenRequest!.body.get("code")).toBe("code1")
          expect(lastTokenRequest!.body.get("redirect_uri")).toBe(
            "https://store.app/oauth/callback"
          )
          expect(lastTokenRequest!.body.get("grant_type")).toBe(
            "authorization_code"
          )
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
          nextTokenResponse = { body: {} }
          const response = await service.validateCallback("cloud", {
            query: {
              code: "code1",
              state: state,
            },
          })

          expect(response.success).toBe(false)
          expect(response.error).toBe("No id_token")
        })

        it("should reject a forged id_token whose signature does not match the JWKS", async () => {
          nextTokenResponse = {
            body: {
              id_token: jwt.sign(
                {
                  sub: "attacker-sub",
                  email: "attacker@example.com",
                  email_verified: true,
                  aud: "test-environment",
                },
                "attacker-secret",
                { algorithm: "HS256", keyid: KID, expiresIn: "1d" }
              ),
            },
          }

          const response = await service.validateCallback("cloud", {
            query: {
              code: "code1",
              state: state,
            },
          })

          expect(response.success).toBe(false)
          expect(response.error).toMatch(/Could not verify id_token/i)
        })

        it("should return an error if the email is not verified", async () => {
          nextTokenResponse = {
            body: {
              id_token: createMockIdToken({ email_verified: false }),
            },
          }
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
      oauth_token_endpoint: TOKEN_ENDPOINT,
      oauth_jwks_uri: JWKS_URI,
      oauth_audience: "test-environment",
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
