import { MedusaError } from "@medusajs/utils"
import { GoogleAuthService } from "../../src/services/google"
jest.setTimeout(100000)
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import jwt from "jsonwebtoken"

const sampleIdPayload = {
  iss: "https://accounts.google.com",
  azp: "199301612397-l1lrg08vd6dvu98r43l7ul0ri2rd2b6r.apps.googleusercontent.com",
  aud: "199301612397-l1lrg08vd6dvu98r43l7ul0ri2rd2b6r.apps.googleusercontent.com",
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
  iat: 1716891837,
  exp: 1716895437,
}

const encodedIdToken = jwt.sign(sampleIdPayload, "test")

const baseUrl = "https://someurl.com"

// This is just a network-layer mocking, it doesn't start an actual server
const server = setupServer(
  http.post(
    "https://oauth2.googleapis.com/token",
    async ({ request, params, cookies }) => {
      const url = request.url
      if (
        url ===
        "https://oauth2.googleapis.com/token?client_id=test&client_secret=test&code=invalid-code&redirect_uri=https%3A%2F%2Fsomeurl.com%2Fauth%2Fgoogle%2Fcallback&grant_type=authorization_code"
      ) {
        return new HttpResponse(null, {
          status: 401,
          statusText: "Unauthorized",
        })
      }

      if (
        url ===
        "https://oauth2.googleapis.com/token?client_id=test&client_secret=test&code=valid-code&redirect_uri=https%3A%2F%2Fsomeurl.com%2Fauth%2Fgoogle%2Fcallback&grant_type=authorization_code"
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
        clientID: "test",
        clientSecret: "test",
        successRedirectUrl: baseUrl,
        callbackURL: `${baseUrl}/auth/google/callback`,
      }
    )

    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    jest.restoreAllMocks()
  })

  afterAll(() => server.close())

  it("throw an error if required options are not passed", async () => {
    let msg = ""
    try {
      new GoogleAuthService(
        {
          logger: console as any,
        },
        {
          clientID: "test",
          clientSecret: "test",
        } as any
      )
    } catch (e) {
      msg = e.message
    }

    expect(msg).toEqual("Google callbackUrl is required")
  })

  it("returns a redirect URL on authenticate", async () => {
    const res = await googleService.authenticate({})
    expect(res).toEqual({
      success: true,
      location:
        "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https%3A%2F%2Fsomeurl.com%2Fauth%2Fgoogle%2Fcallback&client_id=test&response_type=code&scope=email+profile+openid",
    })
  })

  it("validate callback should return an error on empty code", async () => {
    const res = await googleService.validateCallback(
      {
        query: {},
      },
      {} as any
    )
    expect(res).toEqual({
      success: false,
      error: "No code provided",
    })
  })

  it("validate callback should return on a missing access token for code", async () => {
    const res = await googleService.validateCallback(
      {
        query: {
          code: "invalid-code",
        },
      },
      {} as any
    )

    expect(res).toEqual({
      success: false,
      error: "Could not exchange token, 401, Unauthorized",
    })
  })

  it("validate callback should return successfully on a correct code for a new user", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
      create: jest.fn().mockImplementation(() => {
        return {
          entity_id: "test@admin.com",
          provider: "google",
        }
      }),
    }

    const res = await googleService.validateCallback(
      {
        query: {
          code: "valid-code",
        },
      },
      authServiceSpies
    )

    expect(res).toEqual({
      success: true,
      successRedirectUrl: baseUrl,
      authIdentity: {
        entity_id: "test@admin.com",
        provider: "google",
      },
    })
  })

  it("validate callback should return successfully on a correct code for an existing user", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return {
          entity_id: "test@admin.com",
          provider: "google",
        }
      }),
      create: jest.fn().mockImplementation(() => {
        return {}
      }),
    }

    const res = await googleService.validateCallback(
      {
        query: {
          code: "valid-code",
        },
      },
      authServiceSpies
    )

    expect(res).toEqual({
      success: true,
      successRedirectUrl: baseUrl,
      authIdentity: {
        entity_id: "test@admin.com",
        provider: "google",
      },
    })
  })
})
