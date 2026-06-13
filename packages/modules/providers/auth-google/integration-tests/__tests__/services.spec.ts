import { MedusaError } from "@medusajs/framework/utils"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { GoogleAuthService } from "../../src/services/google"
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

const sampleIdPayload = {
  iss: "https://accounts.google.com",
  azp: "test",
  aud: "test",
  sub: "113664482950786663866",
  hd: "medusajs.com",
  email: "test@medusajs.com",
  email_verified: true,
  at_hash: "7DKi89ceSj-Bii1m_V1Pew",
  name: "Test Admin",
  picture:
    "https://lh3.googleusercontent.com/a/ACg8ocJu6nzIGJRzHnl6peAh3fKOzOkrrRCWyMOMuIfCwePDG-ykulA=s96-c",
  given_name: "Test",
  family_name: "Admin",
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
  "https://someurl.com/auth/google/callback"
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
  http.get("https://www.googleapis.com/oauth2/v3/certs", () => {
    return HttpResponse.json({ keys: [jwkPublic] })
  }),

  http.post(
    "https://oauth2.googleapis.com/token",
    async ({ request, params, cookies }) => {
      const url = request.url
      if (
        url ===
        `https://oauth2.googleapis.com/token?client_id=test&client_secret=test&code=invalid-code&redirect_uri=${callbackUrl}&grant_type=authorization_code`
      ) {
        return new HttpResponse(null, {
          status: 401,
          statusText: "Unauthorized",
        })
      }

      if (
        url ===
        `https://oauth2.googleapis.com/token?client_id=test&client_secret=test&code=valid-code&redirect_uri=${callbackUrl}&grant_type=authorization_code`
      ) {
        return new HttpResponse(
          JSON.stringify({
            access_token: "test",
            expires_in: 3600,
            token_type: "Bearer",
            refresh_token: "test",
            id_token: encodedIdToken,
          })
        )
      }

      if (
        url ===
        `https://oauth2.googleapis.com/token?client_id=test&client_secret=test&code=forged-code&redirect_uri=${callbackUrl}&grant_type=authorization_code`
      ) {
        return new HttpResponse(
          JSON.stringify({
            access_token: "test",
            expires_in: 3600,
            token_type: "Bearer",
            refresh_token: "test",
            id_token: forgedIdToken,
          })
        )
      }
    }
  ),

  http.all("*", ({ request, params, cookies }) => {
    return new HttpResponse(null, {
      status: 404,
      statusText: "Not Found",
    })
  })
)

describe("Google auth provider", () => {
  let googleService: GoogleAuthService
  beforeAll(() => {
    googleService = new GoogleAuthService(
      {
        logger: console as any,
      },
      {
        clientId: "test",
        clientSecret: "test",
        callbackUrl: `${baseUrl}/auth/google/callback`,
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
      GoogleAuthService.validateOptions({
        clientId: "test",
        clientSecret: "test",
      } as any)
    } catch (e) {
      msg = e.message
    }

    expect(msg).toEqual("Google callbackUrl is required")
  })

  it("returns a redirect URL on authenticate", async () => {
    const res = await googleService.authenticate({}, defaultSpies)
    expect(res).toEqual({
      success: true,
      location: `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${callbackUrl}&client_id=test&response_type=code&scope=email+profile+openid&state=${
        Object.keys(state)[0]
      }`,
    })
  })

  it("returns a custom redirect_uri on authenticate", async () => {
    const res = await googleService.authenticate(
      {
        body: { callback_url: "https://someotherurl.com" },
      },
      defaultSpies
    )
    expect(res).toEqual({
      success: true,
      location: `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https%3A%2F%2Fsomeotherurl.com&client_id=test&response_type=code&scope=email+profile+openid&state=${
        Object.keys(state)[0]
      }`,
    })
  })

  it("validate callback should return an error on empty code", async () => {
    const res = await googleService.validateCallback(
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
    const res = await googleService.validateCallback(
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
    const res = await googleService.validateCallback(
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
        callback_url: callbackUrl,
      },
    }

    const res = await googleService.validateCallback(
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
              entity_id: "113664482950786663866",
              provider: "google",
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
        callback_url: callbackUrl,
      },
    }

    const res = await googleService.validateCallback(
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
            entity_id: "113664482950786663866",
            provider: "google",
          },
        ],
      },
    })
  })

  it("validate callback should reject a forged id_token whose signature does not match Google's JWKS", async () => {
    state = {
      somekey: {
        callback_url: callbackUrl,
      },
    }

    const res = await googleService.validateCallback(
      {
        query: {
          code: "forged-code",
          state: "somekey",
        },
      },
      defaultSpies
    )

    expect(res.success).toBe(false)
    expect(res.error).toMatch(/Could not verify Google id_token/i)
  })

  it("validate callback should return successfully on a correct code for an existing user", async () => {
    const authServiceSpies = {
      ...defaultSpies,
      retrieve: jest.fn().mockImplementation(() => {
        return {
          provider_identities: [
            {
              entity_id: "113664482950786663866",
              provider: "google",
            },
          ],
        }
      }),
      create: jest.fn().mockImplementation(() => {
        return {}
      }),
      update: jest.fn().mockImplementation(() => {
        return {}
      }),
    }

    state = {
      somekey: {
        callback_url: callbackUrl,
      },
    }

    const res = await googleService.validateCallback(
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
            entity_id: "113664482950786663866",
            provider: "google",
          },
        ],
      },
    })
  })
})
