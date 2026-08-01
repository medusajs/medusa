import { MedusaError } from "@medusajs/framework/utils"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { KeycloakAuthService } from "../../src/services/keycloak"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

jest.setTimeout(100000)

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

const issuer = "https://keycloak.example.com/realms/test-realm"

const sampleIdPayload = {
  iss: issuer,
  aud: "test",
  azp: "test",
  sub: "af0e7cf8-33fd-4b3a-a8c6-2fbe341aa48e",
  typ: "ID",
  email: "test@medusajs.com",
  email_verified: true,
  name: "Test Admin",
  given_name: "Test",
  family_name: "Admin",
  preferred_username: "testadmin",
}

const signIdToken = (payload: object, opts: jwt.SignOptions = {}) =>
  jwt.sign(payload, privateKey.export({ format: "pem", type: "pkcs8" }), {
    algorithm: "RS256",
    keyid: KID,
    expiresIn: "1d",
    ...opts,
  })

const encodedIdToken = signIdToken(sampleIdPayload)

const forgedIdToken = jwt.sign(
  { ...sampleIdPayload, sub: "attacker-sub" },
  "attacker-secret",
  { algorithm: "HS256", keyid: KID, expiresIn: "1d" }
)

const baseUrl = "https://someurl.com"
const callbackUrl = encodeURIComponent(
  "https://someurl.com/auth/keycloak/callback"
)

let state = {}
const defaultSpies = {
  retrieve: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  setState: jest.fn().mockImplementation((key, value) => {
    state[key] = value
  }),
  getState: jest.fn().mockImplementation((key) => {
    return Promise.resolve(state[key])
  }),
}

// This is just a network-layer mocking, it doesn't start an actual server
const server = setupServer(
  http.get(`${issuer}/protocol/openid-connect/certs`, () => {
    return HttpResponse.json({ keys: [jwkPublic] })
  }),

  http.post(
    `${issuer}/protocol/openid-connect/token`,
    async ({ request }) => {
      const params = new URLSearchParams(await request.text())

      if (
        params.get("grant_type") !== "authorization_code" ||
        params.get("client_id") !== "test" ||
        params.get("client_secret") !== "test" ||
        params.get("redirect_uri") !== decodeURIComponent(callbackUrl)
      ) {
        return new HttpResponse(null, {
          status: 400,
          statusText: "Bad Request",
        })
      }

      const code = params.get("code")

      if (code === "invalid-code") {
        return new HttpResponse(null, {
          status: 401,
          statusText: "Unauthorized",
        })
      }

      if (code === "valid-code" || code === "forged-code") {
        return new HttpResponse(
          JSON.stringify({
            access_token: "test",
            expires_in: 300,
            token_type: "Bearer",
            refresh_token: "test",
            id_token: code === "valid-code" ? encodedIdToken : forgedIdToken,
          })
        )
      }

      return new HttpResponse(null, {
        status: 400,
        statusText: "Bad Request",
      })
    }
  ),

  http.all("*", () => {
    return new HttpResponse(null, {
      status: 404,
      statusText: "Not Found",
    })
  })
)

describe("Keycloak auth provider", () => {
  let keycloakService: KeycloakAuthService
  beforeAll(() => {
    keycloakService = new KeycloakAuthService(
      {
        logger: console as any,
      },
      {
        clientId: "test",
        clientSecret: "test",
        callbackUrl: `${baseUrl}/auth/keycloak/callback`,
        issuer,
      }
    )

    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    jest.restoreAllMocks()
    state = {}
  })

  afterAll(() => server.close())

  it("throw an error if required options are not passed", async () => {
    let msg = ""
    try {
      KeycloakAuthService.validateOptions({
        clientId: "test",
        clientSecret: "test",
        callbackUrl: "test",
      } as any)
    } catch (e) {
      msg = e.message
    }

    expect(msg).toEqual("Keycloak issuer is required")
  })

  it("strips a trailing slash from the issuer", async () => {
    const service = new KeycloakAuthService(
      { logger: console as any },
      {
        clientId: "test",
        clientSecret: "test",
        callbackUrl: `${baseUrl}/auth/keycloak/callback`,
        issuer: `${issuer}/`,
      }
    )
    const res = await service.authenticate({}, defaultSpies)
    expect(res.location).toContain(
      `${issuer}/protocol/openid-connect/auth?`
    )
  })

  it("returns a redirect URL on authenticate", async () => {
    const res = await keycloakService.authenticate({}, defaultSpies)
    expect(res).toEqual({
      success: true,
      location: `${issuer}/protocol/openid-connect/auth?redirect_uri=${callbackUrl}&client_id=test&response_type=code&scope=openid+email+profile&state=${
        Object.keys(state)[0]
      }`,
    })
  })

  it("returns a custom redirect_uri on authenticate", async () => {
    const res = await keycloakService.authenticate(
      {
        body: { callback_url: "https://someotherurl.com" },
      },
      defaultSpies
    )
    expect(res).toEqual({
      success: true,
      location: `${issuer}/protocol/openid-connect/auth?redirect_uri=https%3A%2F%2Fsomeotherurl.com&client_id=test&response_type=code&scope=openid+email+profile&state=${
        Object.keys(state)[0]
      }`,
    })
  })

  it("validate callback should return an error on empty code", async () => {
    const res = await keycloakService.validateCallback(
      {
        query: {},
      },
      defaultSpies
    )
    expect(res).toEqual({
      success: false,
      error: "No code provided",
    })
  })

  it("validate callback should return an error on missing state", async () => {
    const res = await keycloakService.validateCallback(
      {
        query: {
          code: "valid-code",
        },
      },
      defaultSpies
    )
    expect(res).toEqual({
      success: false,
      error: "No state provided, or session expired",
    })
  })

  it("validate callback should return an error on expired/invalid state", async () => {
    const res = await keycloakService.validateCallback(
      {
        query: {
          code: "valid-code",
          state: "somekey",
        },
      },
      defaultSpies
    )
    expect(res).toEqual({
      success: false,
      error: "No state provided, or session expired",
    })
  })

  it("validate callback should return on a missing access token for code", async () => {
    state = {
      somekey: {
        callback_url: decodeURIComponent(callbackUrl),
      },
    }

    const res = await keycloakService.validateCallback(
      {
        query: {
          code: "invalid-code",
          state: "somekey",
        },
      },
      defaultSpies
    )

    expect(res).toEqual({
      success: false,
      error: "Could not exchange token, 401, Unauthorized",
    })
  })

  it("validate callback should return successfully on a correct code for a new user", async () => {
    const authServiceSpies = {
      ...defaultSpies,
      retrieve: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
      create: jest.fn().mockImplementation(() => {
        return {
          provider_identities: [
            {
              entity_id: sampleIdPayload.sub,
              provider: "keycloak",
            },
          ],
        }
      }),
      update: jest.fn().mockImplementation(() => {
        return {}
      }),
    }

    state = {
      somekey: {
        callback_url: decodeURIComponent(callbackUrl),
      },
    }

    const res = await keycloakService.validateCallback(
      {
        query: {
          code: "valid-code",
          state: "somekey",
        },
      },
      authServiceSpies
    )

    expect(res).toEqual({
      success: true,
      authIdentity: {
        provider_identities: [
          {
            entity_id: sampleIdPayload.sub,
            provider: "keycloak",
          },
        ],
      },
    })

    expect(authServiceSpies.create).toHaveBeenCalledWith({
      entity_id: sampleIdPayload.sub,
      user_metadata: {
        name: "Test Admin",
        email: "test@medusajs.com",
        email_verified: true,
        given_name: "Test",
        family_name: "Admin",
        preferred_username: "testadmin",
      },
    })
  })

  it("validate callback should return successfully for an existing user", async () => {
    const existingIdentity = {
      provider_identities: [
        {
          entity_id: sampleIdPayload.sub,
          provider: "keycloak",
        },
      ],
    }
    const authServiceSpies = {
      ...defaultSpies,
      retrieve: jest.fn().mockImplementation(() => existingIdentity),
    }

    state = {
      somekey: {
        callback_url: decodeURIComponent(callbackUrl),
      },
    }

    const res = await keycloakService.validateCallback(
      {
        query: {
          code: "valid-code",
          state: "somekey",
        },
      },
      authServiceSpies
    )

    expect(res).toEqual({
      success: true,
      authIdentity: existingIdentity,
    })
    expect(authServiceSpies.create).not.toHaveBeenCalled()
  })

  it("validate callback should reject a forged id_token whose signature does not match the realm JWKS", async () => {
    state = {
      somekey: {
        callback_url: decodeURIComponent(callbackUrl),
      },
    }

    const res = await keycloakService.validateCallback(
      {
        query: {
          code: "forged-code",
          state: "somekey",
        },
      },
      defaultSpies
    )

    expect(res.success).toEqual(false)
    expect(res.error).toContain("Could not verify Keycloak id_token")
  })
})
