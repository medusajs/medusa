import jwt from "jsonwebtoken"
import { AuthEvents, Modules } from "@medusajs/framework/utils"
import { POST as validateCallback } from "../../[actor_type]/[auth_provider]/callback/route"
import { POST as authenticate } from "../../[actor_type]/[auth_provider]/route"
import { POST as verifyChallenge } from "../challenges/[id]/verify/route"
import { GET as listFactors, POST as createFactor } from "../factors/route"
import { DELETE as disableFactor } from "../factors/[id]/route"
import { POST as verifyFactor } from "../factors/[id]/verify/route"
import { POST as generateRecoveryCodes } from "../recovery-codes/route"

const createResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }

  return res as any
}

const createRequest = ({
  authService,
  params = {},
  validatedBody = {},
  authContext = {
    actor_id: "user_1",
    actor_type: "user",
    auth_identity_id: "auth_identity_1",
    app_metadata: {},
    user_metadata: {},
  },
  eventBus = {
    emit: jest.fn(),
  },
}: {
  authService: Record<string, jest.Mock>
  params?: Record<string, string>
  validatedBody?: Record<string, unknown>
  authContext?: Record<string, unknown>
  eventBus?: { emit: jest.Mock }
}) => {
  return {
    params,
    url: "/auth/user/emailpass",
    headers: {},
    query: {},
    body: validatedBody,
    protocol: "http",
    validatedBody,
    auth_context: authContext,
    scope: {
      resolve: jest.fn((key) => {
        if (key === Modules.AUTH) {
          return authService
        }

        if (key === Modules.EVENT_BUS) {
          return eventBus
        }

        if (key === "configModule") {
          return {
            projectConfig: {
              http: {
                jwtSecret: "test-secret",
                jwtExpiresIn: "1h",
              },
            },
          }
        }

        throw new Error(`Unexpected dependency: ${key}`)
      }),
    },
  } as any
}

const authIdentity = {
  id: "auth_identity_1",
  app_metadata: {
    user_id: "user_1",
  },
  provider_identities: [
    {
      provider: "emailpass",
      user_metadata: {
        email: "test@example.com",
      },
    },
  ],
}

describe("MFA auth routes", () => {
  it("returns an MFA challenge from the auth route", async () => {
    const mfaChallenge = {
      id: "challenge_1",
      auth_identity_id: "auth_identity_1",
      actor_type: "user",
      auth_provider: "emailpass",
      methods: ["totp"],
      attempts: 0,
      max_attempts: 5,
    }
    const authService = {
      authenticate: jest.fn().mockResolvedValue({
        success: true,
        authIdentity,
        mfaChallenge: mfaChallenge,
      }),
    }
    const req = createRequest({
      authService,
      params: {
        actor_type: "user",
        auth_provider: "emailpass",
      },
      validatedBody: {
        email: "test@example.com",
        password: "password",
      },
    })
    const res = createResponse()

    await authenticate(req, res)

    expect(authService.authenticate).toHaveBeenCalledWith(
      "emailpass",
      expect.objectContaining({
        actor_type: "user",
        body: {
          email: "test@example.com",
          password: "password",
        },
      })
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mfa_required: true,
        mfa_challenge: mfaChallenge,
        token: expect.any(String),
      })
    )
  })

  it("returns an MFA challenge from the auth callback route", async () => {
    const mfaChallenge = {
      id: "challenge_1",
      auth_identity_id: "auth_identity_1",
      actor_type: "user",
      auth_provider: "google",
      methods: ["totp"],
      attempts: 0,
      max_attempts: 5,
    }
    const authService = {
      validateCallback: jest.fn().mockResolvedValue({
        success: true,
        authIdentity: {
          ...authIdentity,
          provider_identities: [
            {
              provider: "google",
              user_metadata: {
                email: "test@example.com",
              },
            },
          ],
        },
        mfaChallenge: mfaChallenge,
      }),
    }
    const req = createRequest({
      authService,
      params: {
        actor_type: "user",
        auth_provider: "google",
      },
      validatedBody: {
        code: "oauth-code",
      },
    })
    const res = createResponse()

    await validateCallback(req, res)

    expect(authService.validateCallback).toHaveBeenCalledWith(
      "google",
      expect.objectContaining({
        actor_type: "user",
        body: {
          code: "oauth-code",
        },
      })
    )
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mfa_required: true,
        mfa_challenge: mfaChallenge,
        token: expect.any(String),
      })
    )
  })

  it("verifies an MFA challenge and issues an auth token", async () => {
    const authService = {
      verifyAuthMfaChallenge: jest.fn().mockResolvedValue({
        id: "challenge_1",
        auth_identity_id: "auth_identity_1",
        actor_type: "user",
        auth_provider: "emailpass",
      }),
      retrieveAuthIdentity: jest.fn().mockResolvedValue({
        id: "auth_identity_1",
        app_metadata: {
          user_id: "user_1",
        },
        provider_identities: [
          {
            provider: "emailpass",
            user_metadata: {
              email: "test@example.com",
            },
          },
        ],
      }),
    }
    const req = createRequest({
      authService,
      params: { id: "challenge_1" },
      validatedBody: {
        method: "totp",
        code: "123456",
      },
    })
    const res = createResponse()

    await verifyChallenge(req, res)

    expect(authService.verifyAuthMfaChallenge).toHaveBeenCalledWith({
      id: "challenge_1",
      method: "totp",
      code: "123456",
    })
    expect(res.status).toHaveBeenCalledWith(200)
    const { token } = res.json.mock.calls[0][0]
    const decoded = jwt.decode(token) as Record<string, unknown>
    expect(decoded).toEqual(
      expect.objectContaining({
        actor_id: "user_1",
        actor_type: "user",
        auth_identity_id: "auth_identity_1",
        auth_provider: "emailpass",
      })
    )
  })

  it("lists factors for the authenticated auth identity", async () => {
    const authService = {
      listAuthMfa: jest.fn().mockResolvedValue([
        {
          id: "factor_1",
          auth_identity_id: "auth_identity_1",
          provider: "totp",
        },
      ]),
    }
    const req = createRequest({ authService })
    const res = createResponse()

    await listFactors(req, res)

    expect(authService.listAuthMfa).toHaveBeenCalledWith({
      auth_identity_id: "auth_identity_1",
    })
    expect(res.json).toHaveBeenCalledWith({
      mfa_factors: [
        {
          id: "factor_1",
          auth_identity_id: "auth_identity_1",
          provider: "totp",
        },
      ],
    })
  })

  it("creates factors for the authenticated auth identity", async () => {
    const authService = {
      startAuthMfa: jest.fn().mockResolvedValue({
        mfa: {
          id: "factor_1",
          auth_identity_id: "auth_identity_1",
          provider: "totp",
        },
        secret: "secret",
        otpauth_url: "otpauth://totp/test",
      }),
    }
    const req = createRequest({
      authService,
      validatedBody: {
        provider: "totp",
        label: "Authenticator app",
      },
    })
    const res = createResponse()

    await createFactor(req, res)

    expect(authService.startAuthMfa).toHaveBeenCalledWith({
      auth_identity_id: "auth_identity_1",
      provider: "totp",
      label: "Authenticator app",
      issuer: undefined,
      metadata: undefined,
    })
    expect(res.json).toHaveBeenCalledWith({
      mfa_factor: {
        id: "factor_1",
        auth_identity_id: "auth_identity_1",
        provider: "totp",
      },
      secret: "secret",
      otpauth_url: "otpauth://totp/test",
    })
  })

  it("verifies only factors owned by the authenticated auth identity", async () => {
    const authService = {
      retrieveAuthMfa: jest.fn().mockResolvedValue({
        id: "factor_1",
        auth_identity_id: "auth_identity_1",
        provider: "totp",
        status: "pending",
      }),
      verifyAuthMfa: jest.fn().mockResolvedValue({
        id: "factor_1",
        auth_identity_id: "auth_identity_1",
        provider: "totp",
        status: "enabled",
      }),
    }
    const req = createRequest({
      authService,
      params: { id: "factor_1" },
      validatedBody: { code: "123456" },
    })
    const res = createResponse()

    await verifyFactor(req, res)

    expect(authService.retrieveAuthMfa).toHaveBeenCalledWith({
      id: "factor_1",
      auth_identity_id: "auth_identity_1",
    })
    expect(authService.verifyAuthMfa).toHaveBeenCalledWith({
      id: "factor_1",
      auth_identity_id: "auth_identity_1",
      code: "123456",
    })
    expect(res.json).toHaveBeenCalledWith({
      mfa_factor: {
        id: "factor_1",
        auth_identity_id: "auth_identity_1",
        provider: "totp",
        status: "enabled",
      },
    })
    expect(req.scope.resolve(Modules.EVENT_BUS).emit).toHaveBeenCalledWith({
      name: AuthEvents.MFA_ENABLED,
      data: {
        auth_identity_id: "auth_identity_1",
        mfa_id: "factor_1",
        provider: "totp",
      },
    })
  })

  it("disables only factors owned by the authenticated auth identity", async () => {
    const authService = {
      retrieveAuthMfa: jest.fn().mockResolvedValue({
        id: "factor_1",
        auth_identity_id: "auth_identity_1",
        provider: "totp",
        status: "enabled",
      }),
      disableAuthMfa: jest.fn().mockResolvedValue({
        id: "factor_1",
        auth_identity_id: "auth_identity_1",
        provider: "totp",
        status: "disabled",
      }),
    }
    const req = createRequest({
      authService,
      params: { id: "factor_1" },
      validatedBody: {
        method: "totp",
        code: "123456",
      },
    })
    const res = createResponse()

    await disableFactor(req, res)

    expect(authService.retrieveAuthMfa).toHaveBeenCalledWith({
      id: "factor_1",
      auth_identity_id: "auth_identity_1",
    })
    expect(authService.disableAuthMfa).toHaveBeenCalledWith({
      id: "factor_1",
      method: "totp",
      code: "123456",
    })
    expect(res.json).toHaveBeenCalledWith({
      mfa_factor: {
        id: "factor_1",
        auth_identity_id: "auth_identity_1",
        provider: "totp",
        status: "disabled",
      },
    })
    expect(req.scope.resolve(Modules.EVENT_BUS).emit).toHaveBeenCalledWith({
      name: AuthEvents.MFA_DISABLED,
      data: {
        auth_identity_id: "auth_identity_1",
        mfa_id: "factor_1",
        provider: "totp",
      },
    })
  })

  it("generates recovery codes only when an enabled factor exists", async () => {
    const authService = {
      listAuthMfa: jest.fn().mockResolvedValue([
        {
          id: "factor_1",
          status: "enabled",
        },
      ]),
      generateAuthMfaRecoveryCodes: jest.fn().mockResolvedValue({
        codes: ["code-1", "code-2"],
      }),
    }
    const req = createRequest({
      authService,
      validatedBody: { count: 2 },
    })
    const res = createResponse()

    await generateRecoveryCodes(req, res)

    expect(authService.listAuthMfa).toHaveBeenCalledWith({
      auth_identity_id: "auth_identity_1",
      status: "enabled",
    })
    expect(authService.generateAuthMfaRecoveryCodes).toHaveBeenCalledWith({
      auth_identity_id: "auth_identity_1",
      count: 2,
    })
    expect(res.json).toHaveBeenCalledWith({
      recovery_codes: ["code-1", "code-2"],
    })
    expect(req.scope.resolve(Modules.EVENT_BUS).emit).toHaveBeenCalledWith({
      name: AuthEvents.MFA_RECOVERY_CODES_GENERATED,
      data: {
        auth_identity_id: "auth_identity_1",
        count: 2,
      },
    })
  })
})
