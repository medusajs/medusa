import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import { sign } from "jsonwebtoken"
import { NextFunction } from "express"
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

describe("authenticate middleware", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const authTypes: AuthType[] = ["session", "bearer"]

  describe("public routes (allowUnauthenticated)", () => {
    it("continues as a guest when no credentials are presented at all", async () => {
      const req = createRequest({})
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate(["customer"], authTypes, {
        allowUnauthenticated: true,
      })(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
    })

    it("rejects an expired bearer token with 401 instead of continuing as guest", async () => {
      const token = sign(
        { actor_id: "cus_1", actor_type: "customer" },
        "test-secret",
        {
          expiresIn: -10,
        }
      )
      const req = createRequest({ authorization: `Bearer ${token}` })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate(["customer"], authTypes, {
        allowUnauthenticated: true,
      })(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it("rejects a bearer token signed with the wrong secret with 401 instead of continuing as guest", async () => {
      const token = sign(
        { actor_id: "cus_1", actor_type: "customer" },
        "other-secret"
      )
      const req = createRequest(
        { authorization: `Bearer ${token}` },
        // request resolves a config with a different secret than the one
        // used to sign the token above
        { jwtSecret: "test-secret" }
      )
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate(["customer"], authTypes, {
        allowUnauthenticated: true,
      })(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it("rejects a malformed bearer token with 401 instead of continuing as guest", async () => {
      const req = createRequest({ authorization: "Bearer not.a.jwt" })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate(["customer"], authTypes, {
        allowUnauthenticated: true,
      })(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it("continues as a guest when the route does not accept bearer auth, even if a bearer header is present", async () => {
      const req = createRequest({ authorization: "Bearer not.a.jwt" })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate(["customer"], ["session"], {
        allowUnauthenticated: true,
      })(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
    })

    it("continues as a guest when a valid token for a different actor type is presented", async () => {
      const token = sign(
        { actor_id: "usr_1", actor_type: "user", auth_identity_id: "auth_1" },
        "test-secret"
      )
      const req = createRequest({ authorization: `Bearer ${token}` })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate(["customer"], authTypes, {
        allowUnauthenticated: true,
      })(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect((req as any).auth_context).toBeUndefined()
    })

    it("authenticates when a valid token for the matching actor type is presented on a public route", async () => {
      const token = sign(
        {
          actor_id: "cus_1",
          actor_type: "customer",
          auth_identity_id: "auth_1",
        },
        "test-secret"
      )
      const req = createRequest({ authorization: `Bearer ${token}` })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate(["customer"], authTypes, {
        allowUnauthenticated: true,
      })(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect((req as any).auth_context).toEqual(
        expect.objectContaining({
          actor_id: "cus_1",
          actor_type: "customer",
          auth_identity_id: "auth_1",
        })
      )
    })

    it("preserves session-over-JWT priority when both credentials are present", async () => {
      const sessionToken = sign(
        {
          actor_id: "cus_session",
          actor_type: "customer",
          auth_identity_id: "auth_session",
          mfa_enabled: true,
        },
        "test-secret"
      )
      const bearerToken = sign(
        {
          actor_id: "cus_bearer",
          actor_type: "customer",
          auth_identity_id: "auth_bearer",
        },
        "test-secret"
      )
      const req = createRequest({
        authorization: `Bearer ${bearerToken}`,
        session: {
          auth_context: {
            actor_id: "cus_session",
            actor_type: "customer",
            auth_identity_id: "auth_session",
            app_metadata: {},
            user_metadata: {},
            mfa_enabled: true,
          },
        },
      })
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate(["customer"], authTypes, {
        allowUnauthenticated: true,
      })(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      // Session-derived auth context wins, NOT the bearer-derived one.
      expect((req as any).auth_context).toEqual(
        expect.objectContaining({
          actor_id: "cus_session",
          auth_identity_id: "auth_session",
        })
      )
      expect((req as any).auth_context.actor_id).not.toBe("cus_bearer")
    })

    it("does not accept an API key on a non-admin (session-only) public route", async () => {
      // The second API key branch must be gated on isExclusivelyUser
      // (actor_type === "user"); on a customer route, a valid admin API key
      // sent as Basic auth must not silently authenticate the request.
      const req = createRequest(
        { authorization: "Basic c2tfdGVzdA==" },
        {
          apiKeyModule: {
            authenticate: jest.fn().mockResolvedValue({
              id: "apk_1",
              token: "sk_test",
            }),
          },
        }
      )
      const res = createResponse()
      const next = jest.fn() as NextFunction

      await authenticate(["customer"], ["session", "api-key"], {
        allowUnauthenticated: true,
      })(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect((req as any).auth_context).toBeUndefined()
    })
  })
})
