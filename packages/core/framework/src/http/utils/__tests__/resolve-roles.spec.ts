import { Modules } from "@medusajs/utils"
import { MedusaContainer } from "@medusajs/types"
import { resolveRoles } from "../resolve-roles"

const buildAuthzContextMock = jest.fn()

jest.mock("../build-authz-context", () => ({
  buildAuthzContext: (...args: unknown[]) => buildAuthzContextMock(...args),
}))

const authContext = { actor_id: "usr_1", actor_type: "user" }

const createContainer = ({
  authzConfig = { grantees: [{ entity: "user", path: "id" }] },
  assignments = [],
}: {
  /**
   * Pass null for an actor type with no authz config. Passing undefined would
   * fall back to the default above, which is the opposite of what the test
   * intends.
   */
  authzConfig?: unknown | null
  assignments?: { role_id: string }[]
} = {}) => {
  const listRbacRoleAssignments = jest.fn().mockResolvedValue(assignments)

  const container = {
    resolve: jest.fn((key: string) => {
      if (key === Modules.RBAC) {
        return {
          retrieveActorAutzContextConfig: jest
            .fn()
            .mockResolvedValue(authzConfig),
          listRbacRoleAssignments,
        }
      }

      return undefined
    }),
  } as unknown as MedusaContainer

  return { container, listRbacRoleAssignments }
}

const scopeFilterOf = (listRbacRoleAssignments: jest.Mock) =>
  listRbacRoleAssignments.mock.calls[0][0].$and[1]

describe("resolveRoles", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    buildAuthzContextMock.mockResolvedValue({
      grantees: [{ type: "user", id: "usr_1" }],
    })
  })

  it("returns no roles when the actor type has no authz config", async () => {
    const { container, listRbacRoleAssignments } = createContainer({
      authzConfig: null,
    })

    await expect(resolveRoles({ authContext, container })).resolves.toEqual([])
    expect(listRbacRoleAssignments).not.toHaveBeenCalled()
  })

  it("returns no roles when the actor has no grantees", async () => {
    buildAuthzContextMock.mockResolvedValue({ grantees: [] })
    const { container, listRbacRoleAssignments } = createContainer()

    await expect(resolveRoles({ authContext, container })).resolves.toEqual([])
    expect(listRbacRoleAssignments).not.toHaveBeenCalled()
  })

  it("matches only unscoped assignments when no scope is resolved", async () => {
    const { container, listRbacRoleAssignments } = createContainer()

    await resolveRoles({ authContext, container })

    expect(scopeFilterOf(listRbacRoleAssignments)).toEqual({
      $or: [{ scope: null, scope_id: null }],
    })
  })

  it("matches the resolved scope and unscoped assignments when a scope is resolved", async () => {
    const { container, listRbacRoleAssignments } = createContainer()

    await resolveRoles({
      authContext,
      container,
      scope: { type: "organization", id: "org_1" },
    })

    expect(scopeFilterOf(listRbacRoleAssignments)).toEqual({
      $or: [
        { scope: null, scope_id: null },
        { scope: "organization", scope_id: "org_1" },
      ],
    })
  })

  it("deduplicates the roles of the matched assignments", async () => {
    const { container } = createContainer({
      assignments: [
        { role_id: "role_1" },
        { role_id: "role_2" },
        { role_id: "role_1" },
      ],
    })

    await expect(resolveRoles({ authContext, container })).resolves.toEqual([
      "role_1",
      "role_2",
    ])
  })
})
