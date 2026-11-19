import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { canActorGrantRoles } from "../can-actor-grant-roles"

const getActorPermissionsMock = jest.fn()

jest.mock("@medusajs/framework", () => ({
  ...jest.requireActual("@medusajs/framework"),
  getActorPermissions: (...args: unknown[]) => getActorPermissionsMock(...args),
}))

const roles = [
  { id: "role_reader", policies: [{ resource: "product", operation: "read" }] },
  {
    id: "role_editor",
    policies: [
      { resource: "product", operation: "read" },
      { resource: "product", operation: "update" },
    ],
  },
  { id: "role_empty", policies: [] },
]

const graphMock = jest.fn()
const container = {
  resolve: (key: string) =>
    key === ContainerRegistrationKeys.QUERY ? { graph: graphMock } : undefined,
} as unknown as MedusaContainer

const org1 = { type: "organization", id: "org_1" }
const org2 = { type: "organization", id: "org_2" }

describe("canActorGrantRoles", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    graphMock.mockImplementation(async ({ filters }) => ({
      data: roles.filter((role) => filters.id.includes(role.id)),
    }))
    // Unscoped: product:read. Within org_1: product:read + product:update.
    getActorPermissionsMock.mockImplementation(async ({ scope }) =>
      scope?.id === "org_1"
        ? new Set(["product:read", "product:update"])
        : new Set(["product:read"])
    )
  })

  it("returns no verdicts and runs no queries without assignments", async () => {
    const verdicts = await canActorGrantRoles({
      container,
      actor_id: "usr_1",
      assignments: [],
    })

    expect(verdicts).toEqual([])
    expect(graphMock).not.toHaveBeenCalled()
    expect(getActorPermissionsMock).not.toHaveBeenCalled()
  })

  it("checks unscoped assignments against the actor's unscoped privileges only", async () => {
    const verdicts = await canActorGrantRoles({
      container,
      actor_id: "usr_1",
      granting_scope: org1,
      assignments: [{ role_id: "role_reader" }, { role_id: "role_editor" }],
    })

    expect(verdicts).toEqual([true, false])
    expect(getActorPermissionsMock).toHaveBeenCalledTimes(1)
    expect(getActorPermissionsMock).toHaveBeenCalledWith({
      authContext: { actor_id: "usr_1", actor_type: "user" },
      container,
      scope: undefined,
    })
  })

  it("counts scoped privileges only for assignments targeting the granting scope", async () => {
    const verdicts = await canActorGrantRoles({
      container,
      actor_id: "usr_1",
      actor: "api-key",
      granting_scope: org1,
      assignments: [
        { role_id: "role_editor", scope: org1 },
        { role_id: "role_editor", scope: org2 },
        { role_id: "role_editor" },
      ],
    })

    expect(verdicts).toEqual([true, false, false])
    // One permission set per scope context: org_1 and unscoped.
    expect(getActorPermissionsMock).toHaveBeenCalledTimes(2)
    expect(getActorPermissionsMock).toHaveBeenCalledWith({
      authContext: { actor_id: "usr_1", actor_type: "api-key" },
      container,
      scope: org1,
    })
  })

  it("ignores scoped privileges without a granting scope", async () => {
    const verdicts = await canActorGrantRoles({
      container,
      actor_id: "usr_1",
      assignments: [{ role_id: "role_editor", scope: org1 }],
    })

    expect(verdicts).toEqual([false])
    expect(getActorPermissionsMock).toHaveBeenCalledWith(
      expect.objectContaining({ scope: undefined })
    )
  })

  it("treats roles without policies as grantable without resolving permissions", async () => {
    const verdicts = await canActorGrantRoles({
      container,
      actor_id: "usr_1",
      assignments: [{ role_id: "role_empty" }, { role_id: "role_unknown" }],
    })

    expect(verdicts).toEqual([true, true])
    expect(getActorPermissionsMock).not.toHaveBeenCalled()
  })

  it("fetches the policies of each role once", async () => {
    await canActorGrantRoles({
      container,
      actor_id: "usr_1",
      assignments: [
        { role_id: "role_reader" },
        { role_id: "role_reader", scope: org1 },
      ],
    })

    expect(graphMock).toHaveBeenCalledTimes(1)
    expect(graphMock).toHaveBeenCalledWith(
      expect.objectContaining({
        entity: "rbac_role",
        filters: { id: ["role_reader"] },
      })
    )
  })
})
