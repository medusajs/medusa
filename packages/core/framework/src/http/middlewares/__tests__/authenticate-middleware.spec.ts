import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import { NextFunction } from "express"
import { sign } from "jsonwebtoken"
import { authenticate, AuthType } from "../authenticate-middleware"
import { MedusaRequest, MedusaResponse } from "../../types"

type ResolveOverrides = {
  jwtSecret?: string
  apiKeyModule?: { authenticate: jest.Mock }
}

const createRequest = (
  {
    authorization,
    session,
  }: {
    authorization?: string
    session?: MedusaRequest["session"]
  },
  overrides: ResolveOverrides = {}
): MedusaRequest => {
  const resolve = jest.fn((key: string) => {
    if (key === ContainerRegistrationKeys.CONFIG_MODULE) {
      return {
        projectConfig: {
          http: { jwtSecret: overrides.jwtSecret ?? "test-secret" },
        },
      }
    }

    if (key === Modules.API_KEY) {
      return (
        overrides.apiKeyModule ?? {
          authenticate: jest.fn().mockResolvedValue(null),
        }
      )
    }

    return undefined
  })

  return {
    headers: { authorization },
    session,
    scope: { resolve },
  } as unknown as MedusaRequest
}

const createResponse = () => {
  const json = jest.fn().mockReturnThis()
  const status = jest.fn().mockReturnThis()
  return { status, json } as unknown as MedusaResponse & {
    status: jest.Mock
    json: jest.Mock
  }
}

const createBearer = (payload: Record<string, unknown>) =>
  `Bearer ${sign(
    {
      actor_id: "user_1",
      actor_type: "user",
      auth_identity_id: "authid_1",
      app_metadata: {},
      user_metadata: {},
      ...payload,
    },
    "test-secret"
  )}`

describe("authenticate middleware", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("requireMfa", () => {
    it("rejects a token that has not completed the MFA challenge", async () => {
      const req = createRequest({
        authorization: createBearer({
          mfa_enabled: true,
          mfa_challenge_completed_at: null,
        }),
      })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate("user", ["bearer"], { requireMfa: true })(
        req,
        res,
        next
      )

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(401)
      expect((res.json as jest.Mock).mock.calls[0][0].message).toContain(
        "MFA verification is required"
      )
    })

    it("allows a token that has completed the MFA challenge", async () => {
      const req = createRequest({
        authorization: createBearer({
          mfa_enabled: true,
          mfa_challenge_completed_at: new Date().toISOString(),
        }),
      })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate("user", ["bearer"], { requireMfa: true })(
        req,
        res,
        next
      )

      expect(next).toHaveBeenCalled()
    })

    it("ignores the requirement when the identity does not have MFA enabled", async () => {
      const req = createRequest({
        authorization: createBearer({
          mfa_enabled: false,
          mfa_challenge_completed_at: null,
        }),
      })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate("user", ["bearer"], { requireMfa: true })(
        req,
        res,
        next
      )

      expect(next).toHaveBeenCalled()
    })

    it("is required by default", async () => {
      const req = createRequest({
        authorization: createBearer({
          mfa_enabled: true,
          mfa_challenge_completed_at: null,
        }),
      })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate("user", ["bearer"])(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it("can be opted out of", async () => {
      const req = createRequest({
        authorization: createBearer({
          mfa_enabled: true,
          mfa_challenge_completed_at: null,
        }),
      })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate("user", ["bearer"], { requireMfa: false })(
        req,
        res,
        next
      )

      expect(next).toHaveBeenCalled()
    })

    it("is not required by default on a route that allows unauthenticated requests", async () => {
      const req = createRequest({
        authorization: createBearer({
          mfa_enabled: true,
          mfa_challenge_completed_at: null,
        }),
      })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate("user", ["bearer"], { allowUnauthenticated: true })(
        req,
        res,
        next
      )

      expect(next).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
    })

    it("can still be required explicitly on a route that allows unauthenticated requests", async () => {
      const req = createRequest({
        authorization: createBearer({
          mfa_enabled: true,
          mfa_challenge_completed_at: null,
        }),
      })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate("user", ["bearer"], {
        allowUnauthenticated: true,
        requireMfa: true,
      })(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it("ignores a token that never carried the MFA claims", async () => {
      const req = createRequest({ authorization: createBearer({}) })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate("user", ["bearer"])(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
    })

    it("rejects a completion that is older than the allowed age", async () => {
      const req = createRequest({
        authorization: createBearer({
          mfa_enabled: true,
          mfa_challenge_completed_at: new Date(
            Date.now() - 10 * 60 * 1000
          ).toISOString(),
        }),
      })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate("user", ["bearer"], {
        requireMfa: { maxAgeSeconds: 300 },
      })(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(401)
      expect((res.json as jest.Mock).mock.calls[0][0].message).toContain(
        "MFA was verified too long ago"
      )
    })

    it("allows a recent completion within the allowed age", async () => {
      const req = createRequest({
        authorization: createBearer({
          mfa_enabled: true,
          mfa_challenge_completed_at: new Date(
            Date.now() - 60 * 1000
          ).toISOString(),
        }),
      })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate("user", ["bearer"], {
        requireMfa: { maxAgeSeconds: 300 },
      })(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  const authTypes: AuthType[] = ["session", "bearer", "api-key"]

  it("returns a helpful hint when a secret API key is passed as a Bearer token on an admin route", async () => {
    const req = createRequest({ authorization: "Bearer sk_test_123" })
    const res = createResponse()
    const next = jest.fn() as NextFunction

    await authenticate("user", authTypes)(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(401)
    expect((res.json as jest.Mock).mock.calls[0][0].message).toContain(
      "Secret API keys must be sent using HTTP Basic authentication"
    )
  })

  it("returns a generic Unauthorized message when a non-secret Bearer token fails", async () => {
    const req = createRequest({ authorization: "Bearer not.a.jwt" })
    const res = createResponse()
    const next = jest.fn() as NextFunction

    await authenticate("user", authTypes)(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" })
  })

  it("does not return the secret API key hint when the route does not accept API key auth", async () => {
    const req = createRequest({ authorization: "Bearer sk_test_123" })
    const res = createResponse()
    const next = jest.fn() as NextFunction

    await authenticate("user", ["bearer"])(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" })
  })

  it("does not return the secret API key hint when the route is not exclusively for the admin user", async () => {
    const req = createRequest({ authorization: "Bearer sk_test_123" })
    const res = createResponse()
    const next = jest.fn() as NextFunction

    await authenticate(["user", "customer"], authTypes)(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" })
  })

  it("authenticates a secret API key passed with HTTP Basic auth", async () => {
    const apiKeyModule = {
      authenticate: jest.fn().mockResolvedValue({ id: "apk_1" }),
    }
    const req = createRequest(
      { authorization: "Basic sk_test_123" },
      { apiKeyModule }
    )
    const res = createResponse()
    const next = jest.fn() as NextFunction

    await authenticate("user", authTypes)(req, res, next)

    expect(apiKeyModule.authenticate).toHaveBeenCalledWith("sk_test_123")
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
    expect((req as any).auth_context).toEqual(
      expect.objectContaining({ actor_id: "apk_1", actor_type: "api-key" })
    )
  })
})
