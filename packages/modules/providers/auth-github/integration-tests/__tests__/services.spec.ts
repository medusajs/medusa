import { generateJwtToken, MedusaError } from "@medusajs/framework/utils"
import { GithubAuthService } from "../../src/services/github"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

jest.setTimeout(100000)

const sampleIdPayload = {
  login: "octocat",
  id: 1,
  node_id: "MDQ6VXNlcjE=",
  avatar_url: "https://github.com/images/error/octocat_happy.gif",
  gravatar_id: "",
  url: "https://api.github.com/users/octocat",
  name: "monalisa octocat",
  company: "GitHub",
  location: "San Francisco",
  email: "octocat@github.com",
  two_factor_authentication: true,
}

const baseUrl = "https://someurl.com"

// This is just a network-layer mocking, it doesn't start an actual server
const server = setupServer(
  http.post(
    "https://github.com/login/oauth/access_token",
    async ({ request, params, cookies }) => {
      const url = request.url
      if (
        url ===
        "https://github.com/login/oauth/access_token?client_id=test&client_secret=test&code=invalid-code&redirect_uri=https%3A%2F%2Fsomeurl.com%2Fauth%2Fgithub%2Fcallback"
      ) {
        return new HttpResponse(null, {
          status: 401,
          statusText: "Unauthorized",
        })
      }

      if (
        url ===
        "https://github.com/login/oauth/access_token?client_id=test&client_secret=test&code=valid-code&redirect_uri=https%3A%2F%2Fsomeurl.com%2Fauth%2Fgithub%2Fcallback"
      ) {
        return new HttpResponse(
          JSON.stringify({
            access_token: "test",
            expires_in: 3600,
            refresh_token: "test",
            refresh_token_expires_in: 7200,
          })
        )
      }
    }
  ),

  http.get(
    "https://api.github.com/user",
    async ({ request, params, cookies }) => {
      return new HttpResponse(JSON.stringify(sampleIdPayload), {
        status: 200,
        statusText: "OK",
      })
    }
  ),

  http.all("*", ({ request, params, cookies }) => {
    return new HttpResponse(null, {
      status: 404,
      statusText: "Not Found",
    })
  })
)

describe("Github auth provider", () => {
  let githubService: GithubAuthService
  beforeAll(() => {
    githubService = new GithubAuthService(
      {
        logger: console as any,
      },
      {
        clientId: "test",
        clientSecret: "test",
        callbackUrl: `${baseUrl}/auth/github/callback`,
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
      GithubAuthService.validateOptions({
        clientId: "test",
        clientSecret: "test",
      } as any)
    } catch (e) {
      msg = e.message
    }

    expect(msg).toEqual("Github callbackUrl is required")
  })

  it("returns a redirect URL on authenticate", async () => {
    const res = await githubService.authenticate({})
    expect(res).toEqual({
      success: true,
      location:
        "https://github.com/login/oauth/authorize?redirect_uri=https%3A%2F%2Fsomeurl.com%2Fauth%2Fgithub%2Fcallback&client_id=test&response_type=code",
    })
  })

  it("validate callback should return an error on empty code", async () => {
    const res = await githubService.validateCallback(
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
    const res = await githubService.validateCallback(
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
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "github",
            },
          ],
        }
      }),
      update: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
    }

    const res = await githubService.validateCallback(
      {
        query: {
          code: "valid-code",
        },
      },
      authServiceSpies
    )

    expect(res).toEqual({
      success: true,
      authIdentity: {
        provider_identities: [
          {
            entity_id: "test@admin.com",
            provider: "github",
          },
        ],
      },
    })
  })

  it("validate callback should return successfully on a correct code for an existing user", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return {
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "github",
            },
          ],
        }
      }),
      create: jest.fn().mockImplementation(() => {
        return {}
      }),
      update: jest.fn().mockImplementation(() => {
        return {
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "github",
              provider_metadata: {
                access_token: "test",
              },
            },
          ],
        }
      }),
    }

    const res = await githubService.validateCallback(
      {
        query: {
          code: "valid-code",
        },
      },
      authServiceSpies
    )

    expect(res).toEqual({
      success: true,
      authIdentity: {
        provider_identities: [
          {
            entity_id: "test@admin.com",
            provider: "github",
            provider_metadata: {
              access_token: "test",
            },
          },
        ],
      },
    })
  })
})
