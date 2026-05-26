import jwt from "jsonwebtoken"

jest.mock("@medusajs/core-flows", () => ({
  requestVerificationWorkflow: jest.fn(),
}))

import { requestVerificationWorkflow } from "@medusajs/core-flows"
import { MedusaError } from "@medusajs/framework/utils"
import { POST as confirmVerification } from "../../[actor_type]/[auth_provider]/verification/confirm/route"
import { POST as requestVerification } from "../../[actor_type]/[auth_provider]/verification/request/route"
import { POST as register } from "../../[actor_type]/[auth_provider]/register/route"
import { POST as authenticate } from "../../[actor_type]/[auth_provider]/route"

const mockRequestVerificationWorkflow =
  requestVerificationWorkflow as unknown as jest.Mock

const createResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }

  return res as any
}

const createRequest = ({
  authService = {},
  params = {
    actor_type: "user",
    auth_provider: "emailpass",
  },
  validatedBody = {},
}: {
  authService?: Record<string, jest.Mock>
  params?: Record<string, string>
  validatedBody?: Record<string, unknown>
}) => {
  return {
    params,
    url: "/auth/user/emailpass",
    headers: {},
    query: {},
    body: validatedBody,
    protocol: "http",
    validatedBody,
    scope: {
      resolve: jest.fn((key) => {
        if (key === "auth") {
          return authService
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

describe("Verification auth routes", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const verification = {
    actor_type: "user",
    provider: "emailpass",
    entity_id: "test@example.com",
  }

  it("returns a verification requirement from the auth route", async () => {
    const authService = {
      authenticate: jest.fn().mockResolvedValue({
        success: true,
        verification: verification,
      }),
    }
    const req = createRequest({
      authService,
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
    expect(res.json).toHaveBeenCalledWith({
      verification_required: true,
      verification: verification,
    })
  })

  it("returns a verification requirement from the register route", async () => {
    const authService = {
      register: jest.fn().mockResolvedValue({
        success: true,
        verification: verification,
      }),
    }
    const req = createRequest({
      authService,
      validatedBody: {
        email: "test@example.com",
        password: "password",
      },
    })
    const res = createResponse()

    await register(req, res)

    expect(authService.register).toHaveBeenCalledWith(
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
    expect(res.json).toHaveBeenCalledWith({
      verification_required: true,
      verification: verification,
    })
  })

  it("requests verification through the workflow", async () => {
    mockRequestVerificationWorkflow.mockReturnValue({
      run: jest.fn().mockResolvedValue({
        result: {
          ...verification,
          expires_at: new Date("2026-05-20T10:00:00.000Z"),
        },
      }),
    })
    const req = createRequest({
      authService: {},
      validatedBody: {
        entity_id: "test@example.com",
        metadata: {
          source: "dashboard",
        },
      },
    })
    const res = createResponse()

    await requestVerification(req, res)

    expect(mockRequestVerificationWorkflow).toHaveBeenCalledWith(req.scope)
    expect(
      mockRequestVerificationWorkflow.mock.results[0].value.run
    ).toHaveBeenCalledWith({
      input: {
        actor_type: "user",
        provider: "emailpass",
        entity_id: "test@example.com",
        metadata: {
          source: "dashboard",
        },
      },
    })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      verification: {
        ...verification,
        expires_at: new Date("2026-05-20T10:00:00.000Z"),
      },
    })
  })

  it("confirms verification and issues an auth token", async () => {
    const authService = {
      confirmAuthVerification: jest.fn().mockResolvedValue({
        verified: true,
        auth_identity_id: "auth_identity_1",
        provider_identity_id: "provider_identity_1",
        entity_id: "test@example.com",
      }),
      retrieveAuthIdentity: jest.fn().mockResolvedValue({
        id: "auth_identity_1",
        app_metadata: {
          user_id: "user_1",
        },
        provider_identities: [
          {
            id: "provider_identity_1",
            provider: "emailpass",
            user_metadata: {
              entity_id: "test@example.com",
            },
          },
        ],
      }),
      createAuthMfaChallenge: jest
        .fn()
        .mockRejectedValue(
          new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Auth identity does not have any enabled MFA methods"
          )
        ),
    }
    const req = createRequest({
      authService,
      validatedBody: {
        token: "verify-token",
      },
    })
    const res = createResponse()

    await confirmVerification(req, res)

    expect(authService.confirmAuthVerification).toHaveBeenCalledWith({
      token: "verify-token",
      provider: "emailpass",
    })
    expect(authService.retrieveAuthIdentity).toHaveBeenCalledWith(
      "auth_identity_1",
      { relations: ["provider_identities"] }
    )
    expect(res.status).toHaveBeenCalledWith(200)
    const responseBody = res.json.mock.calls[0][0]
    const decoded = jwt.decode(responseBody.token) as Record<string, unknown>

    expect(decoded).toEqual(
      expect.objectContaining({
        actor_id: "user_1",
        actor_type: "user",
        auth_identity_id: "auth_identity_1",
        auth_provider: "emailpass",
      })
    )
    expect(responseBody).toEqual({
      token: expect.any(String),
      entity_id: "test@example.com",
      verified: true,
    })
  })

  it("returns an MFA challenge after verification when MFA is available", async () => {
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
      confirmAuthVerification: jest.fn().mockResolvedValue({
        verified: true,
        auth_identity_id: "auth_identity_1",
        provider_identity_id: "provider_identity_1",
        entity_id: "test@example.com",
      }),
      retrieveAuthIdentity: jest.fn().mockResolvedValue({
        id: "auth_identity_1",
        app_metadata: {
          user_id: "user_1",
        },
        provider_identities: [
          {
            id: "provider_identity_1",
            provider: "emailpass",
            user_metadata: {
              entity_id: "test@example.com",
            },
          },
        ],
      }),
      createAuthMfaChallenge: jest.fn().mockResolvedValue(mfaChallenge),
    }
    const req = createRequest({
      authService,
      validatedBody: {
        token: "verify-token",
      },
    })
    const res = createResponse()

    await confirmVerification(req, res)

    expect(authService.confirmAuthVerification).toHaveBeenCalledWith({
      token: "verify-token",
      provider: "emailpass",
    })
    expect(authService.createAuthMfaChallenge).toHaveBeenCalledWith({
      auth_identity_id: "auth_identity_1",
      actor_type: "user",
      auth_provider: "emailpass",
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mfa_required: true,
      mfa_challenge: mfaChallenge,
      entity_id: "test@example.com",
      verified: true,
    })
  })
})
