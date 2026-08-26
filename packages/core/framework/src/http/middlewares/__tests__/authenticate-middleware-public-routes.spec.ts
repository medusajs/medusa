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
  })
})
