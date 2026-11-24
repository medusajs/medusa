import { MedusaError } from "@medusajs/framework/utils"
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
const callbackUrl = encodeURIComponent(
  "https://someurl.com/auth/github/callback"
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
  http.post(
    "https://github.com/login/oauth/access_token",
    async ({ request, params, cookies }) => {
      const url = request.url
      if (
        url ===
        `https://github.com/login/oauth/access_token?client_id=test&client_secret=test&code=invalid-code&redirect_uri=${callbackUrl}`
      ) {
        return new HttpResponse(null, {
          status: 401,
          statusText: "Unauthorized",
        })
      }

      if (
        url ===
        `https://github.com/login/oauth/access_token?client_id=test&client_secret=test&code=valid-code&redirect_uri=${callbackUrl}`
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

const providerTokens = {
  access_token: "test",
  refresh_token: "test",
  access_token_expires_at: expect.any(String),
  refresh_token_expires_at: expect.any(String),
}

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
    state = {}
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
    const res = await githubService.authenticate({}, defaultSpies)
    expect(res).toEqual({
      success: true,
      location: `https://github.com/login/oauth/authorize?redirect_uri=${callbackUrl}&client_id=test&response_type=code&state=${
        Object.keys(state)[0]
      }`,
    })
  })

  it("returns a custom redirect_uri on authenticate", async () => {
    const res = await githubService.authenticate(
      {
        body: { callback_url: "https://someotherurl.com" },
      },
      defaultSpies
    )
    expect(res).toEqual({
      success: true,
      location: `https://github.com/login/oauth/authorize?redirect_uri=https%3A%2F%2Fsomeotherurl.com&client_id=test&response_type=code&state=${
        Object.keys(state)[0]
      }`,
    })
  })

  it("validate callback should return an error on empty code", async () => {
    const res = await githubService.validateCallback(
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
    const res = await githubService.validateCallback(
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
    const res = await githubService.validateCallback(
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
    const res = await githubService.validateCallback(
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

    state = {
      somekey: {
        callback_url: callbackUrl,
      },
    }

    const res = await githubService.validateCallback(
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
            entity_id: "test@admin.com",
            provider: "github",
          },
        ],
      },
      providerTokens,
    })
    expect(authServiceSpies.create).toHaveBeenCalledWith(
      expect.objectContaining({ provider_metadata: providerTokens })
    )
  })

  it("validate callback should return successfully on a correct code for an existing user", async () => {
    const authServiceSpies = {
      ...defaultSpies,
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

    state = {
      somekey: {
        callback_url: callbackUrl,
      },
    }

    const res = await githubService.validateCallback(
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
            entity_id: "test@admin.com",
            provider: "github",
            provider_metadata: {
              access_token: "test",
            },
          },
        ],
      },
      providerTokens,
    })
  })

  it("validate callback doesn't store the tokens when storeTokens is false, but still returns them", async () => {
    const service = new GithubAuthService(
      { logger: console as any },
      {
        clientId: "test",
        clientSecret: "test",
        callbackUrl: `${baseUrl}/auth/github/callback`,
        storeTokens: false,
      }
    )
    const authServiceSpies = {
      ...defaultSpies,
      update: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
      create: jest.fn().mockImplementation(() => ({ id: "authid_1" })),
    }

    state = {
      somekey: {
        callback_url: callbackUrl,
      },
    }

    const res = await service.validateCallback(
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
      authIdentity: { id: "authid_1" },
      providerTokens,
    })
    expect(authServiceSpies.update).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ provider_metadata: {} })
    )
    expect(authServiceSpies.create).toHaveBeenCalledWith(
      expect.objectContaining({ provider_metadata: {} })
    )
  })
})
