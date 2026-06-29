import { ContainerRegistrationKeys, FeatureFlag, Modules } from "@medusajs/utils"
import { MedusaContainer } from "@medusajs/types"
import { authenticate } from "../middlewares/authenticate-middleware"
import { MedusaRequest, MedusaResponse } from "../types"

describe("authenticate middleware - secret API key + RBAC", () => {
  const SECRET_KEY = "sk_test_123"
  const CREATED_BY = "user_123"
  const ROLE_ID = "role_admin"

  let req: Partial<MedusaRequest>
  let res: MedusaResponse
  let next: jest.Mock
  let graph: jest.Mock

  const run = async ({
    apiKey,
    graphResult,
    graphError,
  }: {
    apiKey: { id: string; created_by: string | null }
    graphResult?: unknown
    graphError?: Error
  }) => {
    graph = jest.fn()
    if (graphError) {
      graph.mockRejectedValue(graphError)
    } else {
      graph.mockResolvedValue(graphResult)
    }

    const apiKeyModule = {
      authenticate: jest.fn().mockResolvedValue(apiKey),
    }

    req = {
      headers: { authorization: `Basic ${SECRET_KEY}` },
      session: {},
      scope: {
        resolve: jest.fn((key: string) => {
          if (key === Modules.API_KEY) {
            return apiKeyModule
          }
          if (key === ContainerRegistrationKeys.QUERY) {
            return { graph }
          }
          return {}
        }),
      } as unknown as MedusaContainer,
    } as Partial<MedusaRequest>

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as MedusaResponse
    next = jest.fn()

    const middleware = authenticate("user", ["api-key"]) as unknown as (
      req: Partial<MedusaRequest>,
      res: MedusaResponse,
      next: jest.Mock
    ) => Promise<void>

    await middleware(req, res, next)
  }

  afterEach(() => {
    FeatureFlag.setFlag("rbac", false)
    jest.clearAllMocks()
  })

  it("loads the creator's RBAC roles into app_metadata when rbac is enabled", async () => {
    FeatureFlag.setFlag("rbac", true)

    await run({
      apiKey: { id: "apk_1", created_by: CREATED_BY },
      graphResult: { data: [{ rbac_roles: [{ id: ROLE_ID }] }] },
    })

    expect(next).toHaveBeenCalledTimes(1)
    const authContext = (req as any).auth_context
    expect(authContext.actor_type).toBe("api-key")
    expect(authContext.actor_id).toBe("apk_1")
    expect(authContext.app_metadata).toEqual({ roles: [ROLE_ID] })
    // the roles are resolved for the user the key was created for
    expect(graph).toHaveBeenCalledWith(
      expect.objectContaining({
        entity: "user",
        fields: ["rbac_roles.id"],
        filters: { id: CREATED_BY },
      })
    )
  })

  it("does not load roles (empty app_metadata) when rbac is disabled", async () => {
    FeatureFlag.setFlag("rbac", false)

    await run({ apiKey: { id: "apk_1", created_by: CREATED_BY } })

    expect(next).toHaveBeenCalledTimes(1)
    expect((req as any).auth_context.app_metadata).toEqual({})
    expect(graph).not.toHaveBeenCalled()
  })

  it("falls back to empty app_metadata when the key has no creator", async () => {
    FeatureFlag.setFlag("rbac", true)

    await run({ apiKey: { id: "apk_1", created_by: null } })

    expect(next).toHaveBeenCalledTimes(1)
    expect((req as any).auth_context.app_metadata).toEqual({})
    expect(graph).not.toHaveBeenCalled()
  })

  it("falls back to empty app_metadata when the role lookup throws", async () => {
    FeatureFlag.setFlag("rbac", true)

    await run({
      apiKey: { id: "apk_1", created_by: CREATED_BY },
      graphError: new Error("query failed"),
    })

    expect(next).toHaveBeenCalledTimes(1)
    expect((req as any).auth_context.app_metadata).toEqual({})
  })
})
