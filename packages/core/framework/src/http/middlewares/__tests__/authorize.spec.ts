import { PolicyAction } from "@medusajs/types"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils"
import { NextFunction } from "express"
import { authorize } from "../authorize"
import { AuthenticatedMedusaRequest, MedusaResponse } from "../../types"

const resolveRolesMock = jest.fn()
const hasPermissionMock = jest.fn()
const listRolePermissionsMock = jest.fn()

jest.mock("../../utils/resolve-roles", () => ({
  resolveRoles: (...args: unknown[]) => resolveRolesMock(...args),
}))

jest.mock("../../../policies/has-permission", () => ({
  hasPermission: (...args: unknown[]) => hasPermissionMock(...args),
  listRolePermissions: (...args: unknown[]) => listRolePermissionsMock(...args),
}))

const createRequest = ({
  rbacEnabled = true,
  authContext = { actor_id: "usr_1", actor_type: "user" },
  rbacContext,
}: {
  rbacEnabled?: boolean
  /**
   * Pass null for an unauthenticated request. Passing undefined would fall back
   * to the default above, which is the opposite of what the test intends.
   */
  authContext?: Record<string, unknown> | null
  rbacContext?: AuthenticatedMedusaRequest["rbac_context"]
} = {}): AuthenticatedMedusaRequest => {
  const resolve = jest.fn((key: string) => {
    if (key === ContainerRegistrationKeys.FEATURE_FLAG_ROUTER) {
      return { isFeatureEnabled: () => rbacEnabled }
    }

    return undefined
  })

  return {
    auth_context: authContext,
    rbac_context: rbacContext,
    scope: { resolve },
  } as unknown as AuthenticatedMedusaRequest
}

const run = async (
  middleware: ReturnType<typeof authorize>,
  req: AuthenticatedMedusaRequest
) => {
  const next = jest.fn() as unknown as NextFunction
  await middleware(req, {} as MedusaResponse, next)
  return next as unknown as jest.Mock
}

const runExpectingThrow = async (
  middleware: ReturnType<typeof authorize>,
  req: AuthenticatedMedusaRequest
) => {
  const next = jest.fn() as unknown as NextFunction
  const error = await middleware(req, {} as MedusaResponse, next).then(
    () => undefined,
    (err) => err
  )
  return { error, next: next as unknown as jest.Mock }
}

const readPolicy: PolicyAction = { resource: "product", operation: "read" }

describe("authorize", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resolveRolesMock.mockResolvedValue(["role_1"])
    hasPermissionMock.mockResolvedValue(true)
    listRolePermissionsMock.mockResolvedValue(["product:read"])
  })

  it("exposes the policies it guards on the middleware", () => {
    expect(authorize(readPolicy).policies).toEqual([readPolicy])
    expect(authorize([readPolicy]).policies).toEqual([readPolicy])
  })

  it("calls next without checking anything when rbac is disabled", async () => {
    const req = createRequest({ rbacEnabled: false })
    const next = await run(authorize(readPolicy), req)

    expect(next).toHaveBeenCalledWith()
    expect(resolveRolesMock).not.toHaveBeenCalled()
    expect(req.rbac_context).toBeUndefined()
  })

  it("records the guarding policies on the rbac context", async () => {
    const existingPolicy: PolicyAction = {
      resource: "order",
      operation: "read",
    }
    const req = createRequest({
      rbacContext: { policies: [existingPolicy] },
    })

    await run(authorize(readPolicy), req)

    expect(req.rbac_context?.policies).toEqual([existingPolicy, readPolicy])
  })

  it("resolves the roles for the scope on the rbac context", async () => {
    const scope = { type: "organization", id: "org_1" }
    const req = createRequest({ rbacContext: { scope } })

    await run(authorize(readPolicy), req)

    expect(resolveRolesMock).toHaveBeenCalledWith(
      expect.objectContaining({ scope })
    )
  })

  it("resolves the roles without a scope when the rbac context has none", async () => {
    const req = createRequest()

    await run(authorize(readPolicy), req)

    expect(resolveRolesMock).toHaveBeenCalledWith(
      expect.objectContaining({ scope: undefined })
    )
  })

  it("exposes the resolved permissions on the rbac context, preserving the scope", async () => {
    const scope = { type: "organization", id: "org_1" }
    const req = createRequest({ rbacContext: { scope } })
    listRolePermissionsMock.mockResolvedValue([
      "product:read",
      "product:update",
    ])

    const next = await run(authorize(readPolicy), req)

    expect(req.rbac_context).toEqual({
      scope,
      policies: [readPolicy],
      permissions: ["product:read", "product:update"],
    })
    expect(next).toHaveBeenCalledWith()
  })

  it("forbids the request when the actor has no roles", async () => {
    resolveRolesMock.mockResolvedValue([])
    const req = createRequest()

    const { error, next } = await runExpectingThrow(authorize(readPolicy), req)

    expect(error).toMatchObject({
      type: MedusaError.Types.FORBIDDEN,
      message: "Forbidden",
    })
    expect(next).not.toHaveBeenCalled()
    expect(hasPermissionMock).not.toHaveBeenCalled()
  })

  it("forbids the request when there is no authenticated actor", async () => {
    const req = createRequest({ authContext: null })

    const { error, next } = await runExpectingThrow(authorize(readPolicy), req)

    expect(error).toMatchObject({ type: MedusaError.Types.FORBIDDEN })
    expect(next).not.toHaveBeenCalled()
    expect(resolveRolesMock).not.toHaveBeenCalled()
  })

  it("forbids the request when the roles do not grant the policies", async () => {
    hasPermissionMock.mockResolvedValue(false)
    const req = createRequest()

    const { error, next } = await runExpectingThrow(
      authorize([
        readPolicy,
        { resource: "product", operation: "delete" } as PolicyAction,
      ]),
      req
    )

    expect(error).toMatchObject({
      type: MedusaError.Types.FORBIDDEN,
      message:
        "Insufficient permissions. Required policies: product:read, product:delete",
    })
    expect(next).not.toHaveBeenCalled()
    expect(req.rbac_context?.permissions).toBeUndefined()
  })

  it("lets an unexpected failure propagate without continuing the request", async () => {
    const failure = new Error("boom")
    resolveRolesMock.mockRejectedValue(failure)
    const req = createRequest()

    const { error, next } = await runExpectingThrow(authorize(readPolicy), req)

    expect(error).toBe(failure)
    expect(next).not.toHaveBeenCalled()
  })
})
