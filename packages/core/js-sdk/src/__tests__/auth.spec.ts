import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

import { Auth } from "../auth"
import { Client } from "../client"

const baseUrl = "https://someurl.com"
const token = "token-123"
const jwtTokenStorageKey = "medusa_auth_token"

const mfaChallenge = {
  id: "authmfachal_123",
  auth_identity_id: "authid_123",
  methods: ["totp"],
  expires_at: "2026-05-20T10:00:00.000Z",
  attempts: 0,
  max_attempts: 5,
  completed_at: null,
  metadata: null,
}

const verification = {
  actor_type: "user",
  provider: "emailpass",
  entity_id: "test@example.com",
  expires_at: "2026-05-20T10:00:00.000Z",
}

const storage = {
  data: new Map<string, string>(),
  getItem: jest.fn((key: string) => storage.data.get(key) ?? null),
  setItem: jest.fn((key: string, value: string) => {
    storage.data.set(key, value)
  }),
  removeItem: jest.fn((key: string) => {
    storage.data.delete(key)
  }),
}

const server = setupServer(
  http.all("*", () => {
    return new HttpResponse(null, {
      status: 404,
      statusText: "Not Found",
    })
  })
)

const createAuth = () => {
  const config = {
    baseUrl,
    auth: {
      type: "jwt",
      jwtTokenStorageMethod: "custom",
      storage,
    },
  } as const

  return new Auth(new Client(config), config)
}

describe("Auth", () => {
  beforeAll(() => server.listen())

  beforeEach(() => {
    storage.data.clear()
    jest.clearAllMocks()
  })

  afterEach(() => server.resetHandlers())

  afterAll(() => server.close())

  it("stores a token returned from login", async () => {
    server.use(
      http.post(`${baseUrl}/auth/user/emailpass`, async ({ request }) => {
        expect(await request.json()).toEqual({
          email: "test@example.com",
          password: "secret",
        })

        return HttpResponse.json({ token })
      })
    )

    const auth = createAuth()
    const result = await auth.login("user", "emailpass", {
      email: "test@example.com",
      password: "secret",
    })

    expect(result).toBe(token)
    expect(storage.setItem).toHaveBeenCalledWith(jwtTokenStorageKey, token)
  })

  it("returns an MFA challenge from login without storing a token", async () => {
    server.use(
      http.post(`${baseUrl}/auth/user/emailpass`, () => {
        return HttpResponse.json({
          mfa_required: true,
          mfa_challenge: mfaChallenge,
        })
      })
    )

    const auth = createAuth()
    const result = await auth.login("user", "emailpass", {
      email: "test@example.com",
      password: "secret",
    })

    expect(result).toEqual({
      mfa_required: true,
      mfa_challenge: mfaChallenge,
    })
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it("returns a verification requirement from login without storing a token", async () => {
    server.use(
      http.post(`${baseUrl}/auth/user/emailpass`, () => {
        return HttpResponse.json({
          verification_required: true,
          verification: verification,
        })
      })
    )

    const auth = createAuth()
    const result = await auth.login("user", "emailpass", {
      email: "test@example.com",
      password: "secret",
    })

    expect(result).toEqual({
      verification_required: true,
      verification: verification,
    })
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it("throws from register by default when verification is required", async () => {
    server.use(
      http.post(
        `${baseUrl}/auth/user/emailpass/register`,
        async ({ request }) => {
          expect(await request.json()).toEqual({
            email: "test@example.com",
            password: "secret",
          })

          return HttpResponse.json({
            verification_required: true,
            verification: verification,
          })
        }
      )
    )

    const auth = createAuth()

    await expect(
      auth.register("user", "emailpass", {
        email: "test@example.com",
        password: "secret",
      })
    ).rejects.toThrow("Unexpected registration response")
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it("returns a verification requirement from register when opted in", async () => {
    server.use(
      http.post(
        `${baseUrl}/auth/user/emailpass/register`,
        async ({ request }) => {
          expect(await request.json()).toEqual({
            email: "test@example.com",
            password: "secret",
          })

          return HttpResponse.json({
            verification_required: true,
            verification: verification,
          })
        }
      )
    )

    const auth = createAuth()
    const result = await auth.register(
      "user",
      "emailpass",
      {
        email: "test@example.com",
        password: "secret",
      },
      {
        returnVerification: true,
      }
    )

    expect(result).toEqual({
      verification_required: true,
      verification: verification,
    })
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it("returns redirect locations from login", async () => {
    server.use(
      http.post(`${baseUrl}/auth/user/github`, () => {
        return HttpResponse.json({
          location: "https://github.com/login/oauth/authorize",
        })
      })
    )

    const auth = createAuth()
    const result = await auth.login("user", "github", {})

    expect(result).toEqual({
      location: "https://github.com/login/oauth/authorize",
    })
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it("returns an MFA challenge from auth callbacks without storing a token", async () => {
    server.use(
      http.get(`${baseUrl}/auth/user/github/callback`, ({ request }) => {
        expect(new URL(request.url).searchParams.get("code")).toBe("code_123")

        return HttpResponse.json({
          mfa_required: true,
          mfa_challenge: mfaChallenge,
        })
      })
    )

    const auth = createAuth()
    const result = await auth.callback("user", "github", {
      code: "code_123",
    })

    expect(result).toEqual({
      mfa_required: true,
      mfa_challenge: mfaChallenge,
    })
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it("manages MFA factors", async () => {
    const mfaFactor = {
      id: "authmfa_123",
      auth_identity_id: "authid_123",
      provider: "totp",
      status: "pending",
      metadata: null,
    }

    server.use(
      http.get(`${baseUrl}/auth/mfa/factors`, () => {
        return HttpResponse.json({ mfa_factors: [mfaFactor] })
      }),
      http.post(`${baseUrl}/auth/mfa/factors`, async ({ request }) => {
        expect(await request.json()).toEqual({
          provider: "totp",
          label: "Authenticator app",
        })

        return HttpResponse.json({
          mfa_factor: mfaFactor,
          secret: "SECRET",
          otpauth_url: "otpauth://totp/test",
        })
      }),
      http.post(
        `${baseUrl}/auth/mfa/factors/${mfaFactor.id}/verify`,
        async ({ request }) => {
          expect(await request.json()).toEqual({ code: "123456" })

          return HttpResponse.json({
            mfa_factor: {
              ...mfaFactor,
              status: "enabled",
            },
          })
        }
      ),
      http.delete(
        `${baseUrl}/auth/mfa/factors/${mfaFactor.id}`,
        async ({ request }) => {
          expect(await request.json()).toEqual({
            method: "totp",
            code: "123456",
          })

          return HttpResponse.json({
            mfa_factor: {
              ...mfaFactor,
              status: "disabled",
            },
          })
        }
      ),
      http.post(`${baseUrl}/auth/mfa/recovery-codes`, async ({ request }) => {
        expect(await request.json()).toEqual({ count: 8 })

        return HttpResponse.json({
          recovery_codes: ["code-1", "code-2"],
        })
      })
    )

    const auth = createAuth()

    await expect(auth.mfa.list()).resolves.toEqual({
      mfa_factors: [mfaFactor],
    })
    await expect(
      auth.mfa.start({
        provider: "totp",
        label: "Authenticator app",
      })
    ).resolves.toEqual({
      mfa_factor: mfaFactor,
      secret: "SECRET",
      otpauth_url: "otpauth://totp/test",
    })
    await expect(
      auth.mfa.verify(mfaFactor.id, { code: "123456" })
    ).resolves.toEqual({
      mfa_factor: {
        ...mfaFactor,
        status: "enabled",
      },
    })
    await expect(
      auth.mfa.disable(mfaFactor.id, {
        method: "totp",
        code: "123456",
      })
    ).resolves.toEqual({
      mfa_factor: {
        ...mfaFactor,
        status: "disabled",
      },
    })
    await expect(auth.mfa.generateRecoveryCodes({ count: 8 })).resolves.toEqual(
      {
        recovery_codes: ["code-1", "code-2"],
      }
    )
  })

  it("stores the token returned from MFA challenge verification", async () => {
    server.use(
      http.post(
        `${baseUrl}/auth/mfa/challenges/${mfaChallenge.id}/verify`,
        async ({ request }) => {
          expect(await request.json()).toEqual({
            method: "totp",
            code: "123456",
          })

          return HttpResponse.json({ token })
        }
      )
    )

    const auth = createAuth()
    const result = await auth.mfa.verifyChallenge(mfaChallenge.id, {
      method: "totp",
      code: "123456",
    })

    expect(result).toBe(token)
    expect(storage.setItem).toHaveBeenCalledWith(jwtTokenStorageKey, token)
  })

  it("requests and confirms verification", async () => {
    server.use(
      http.post(
        `${baseUrl}/auth/user/emailpass/verification/request`,
        async ({ request }) => {
          expect(await request.json()).toEqual({
            entity_id: "test@example.com",
            metadata: {
              source: "dashboard",
            },
          })

          return HttpResponse.json(
            {
              verification: verification,
            },
            { status: 201 }
          )
        }
      ),
      http.post(
        `${baseUrl}/auth/user/emailpass/verification/confirm`,
        async ({ request }) => {
          expect(await request.json()).toEqual({
            token: "verify-token",
          })

          return HttpResponse.json({
            entity_id: "test@example.com",
            verified: true,
          })
        }
      )
    )

    const auth = createAuth()

    await expect(
      auth.verification.request("user", "emailpass", {
        entity_id: "test@example.com",
        metadata: {
          source: "dashboard",
        },
      })
    ).resolves.toEqual({
      verification: verification,
    })

    await expect(
      auth.verification.confirm("user", "emailpass", {
        token: "verify-token",
      })
    ).resolves.toEqual({
      entity_id: "test@example.com",
      verified: true,
    })
    expect(storage.setItem).not.toHaveBeenCalled()
  })
})
