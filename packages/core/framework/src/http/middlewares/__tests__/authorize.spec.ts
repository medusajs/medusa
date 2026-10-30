import { PolicyAction } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { NextFunction } from "express"
import { authorize } from "../authorize"
import { AuthenticatedMedusaRequest, MedusaResponse } from "../../types"

const mockRbac = { installed: true }
const resolveRolesMock = jest.fn()
const listRolePermissionsMock = jest.fn()

jest.mock("@medusajs/modules-sdk", () => ({
  MedusaModule: { isInstalled: () => mockRbac.installed },
}))

jest.mock("../../utils/resolve-roles", () => ({
  resolveRoles: (...args: unknown[]) => resolveRolesMock(...args),
}))

jest.mock("../../../policies/has-permission", () => ({
  isGranted: jest.requireActual("../../../policies/has-permission").isGranted,
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
  mockRbac.installed = rbacEnabled

  return {
    auth_context: authContext,
    rbac_context: rbacContext,
    scope: { resolve: jest.fn() },
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
    listRolePermissionsMock.mockResolvedValue(["product:read"])
  })

  it("exposes the policies it guards on the middleware", () => {
    expect(authorize(readPolicy).policies).toEqual([readPolicy])
    expect(authorize([readPolicy]).policies).toEqual([readPolicy])
  })

  it("calls next without checking anything when the rbac module is not installed", async () => {
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
      role_ids: ["role_1"],
      permissions: ["product:read", "product:update"],
    })
    expect(next).toHaveBeenCalledWith()
  })

  it("fetches the roles' permissions once per request", async () => {
    listRolePermissionsMock.mockResolvedValue([
      "product:read",
      "product:update",
    ])
    const req = createRequest()

    await run(
      authorize([
        readPolicy,
        { resource: "product", operation: ["read", "update"] } as PolicyAction,
      ]),
      req
    )

    expect(listRolePermissionsMock).toHaveBeenCalledTimes(1)
    expect(listRolePermissionsMock).toHaveBeenCalledWith({
      roles: ["role_1"],
      container: req.scope,
    })
  })

  it("grants the policies through wildcard permissions", async () => {
    listRolePermissionsMock.mockResolvedValue(["*:read", "product:*"])
    const req = createRequest()

    const next = await run(
      authorize([
        readPolicy,
        { resource: "product", operation: "delete" } as PolicyAction,
        { resource: "order", operation: "read" } as PolicyAction,
      ]),
      req
    )

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
    expect(listRolePermissionsMock).not.toHaveBeenCalled()
  })

  it("forbids the request when there is no authenticated actor", async () => {
    const req = createRequest({ authContext: null })

    const { error, next } = await runExpectingThrow(authorize(readPolicy), req)

    expect(error).toMatchObject({ type: MedusaError.Types.FORBIDDEN })
    expect(next).not.toHaveBeenCalled()
    expect(resolveRolesMock).not.toHaveBeenCalled()
  })

  it("forbids the request when the roles do not grant the policies", async () => {
    listRolePermissionsMock.mockResolvedValue(["product:read"])
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

  it("forbids the request when one of a policy's operations is not granted", async () => {
    listRolePermissionsMock.mockResolvedValue(["product:read"])
    const req = createRequest()

    const { error, next } = await runExpectingThrow(
      authorize({
        resource: "product",
        operation: ["read", "update"],
      } as PolicyAction),
      req
    )

    expect(error).toMatchObject({
      type: MedusaError.Types.FORBIDDEN,
      message:
        "Insufficient permissions. Required policies: product:read,update",
    })
    expect(next).not.toHaveBeenCalled()
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
