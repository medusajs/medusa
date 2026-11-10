import {
  ContainerRegistrationKeys,
  Modules,
  RBAC_CACHE_TAGS,
} from "@medusajs/utils"
import { MedusaContainer } from "@medusajs/types"
import { RBAC_CACHE_TTL } from "../../../policies/has-permission"
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
  const graph = jest.fn().mockResolvedValue({ data: assignments })

  const container = {
    resolve: jest.fn((key: string) => {
      if (key === Modules.RBAC) {
        return {
          retrieveActorAuthzContextConfig: jest
            .fn()
            .mockResolvedValue(authzConfig),
        }
      }

      if (key === ContainerRegistrationKeys.QUERY) {
        return { graph }
      }

      return undefined
    }),
  } as unknown as MedusaContainer

  return { container, graph }
}

const scopeFilterOf = (graph: jest.Mock) =>
  graph.mock.calls[0][0].filters.$and[1]

describe("resolveRoles", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    buildAuthzContextMock.mockResolvedValue({
      grantees: [{ type: "user", id: "usr_1" }],
    })
  })

  it("returns no roles when the actor type has no authz config", async () => {
    const { container, graph } = createContainer({ authzConfig: null })

    await expect(resolveRoles({ authContext, container })).resolves.toEqual([])
    expect(graph).not.toHaveBeenCalled()
  })

  it("returns no roles when the actor has no grantees", async () => {
    buildAuthzContextMock.mockResolvedValue({ grantees: [] })
    const { container, graph } = createContainer()

    await expect(resolveRoles({ authContext, container })).resolves.toEqual([])
    expect(graph).not.toHaveBeenCalled()
  })

  it("matches only unscoped assignments when no scope is resolved", async () => {
    const { container, graph } = createContainer()

    await resolveRoles({ authContext, container })

    expect(scopeFilterOf(graph)).toEqual({
      $or: [{ scope: null, scope_id: null }],
    })
  })

  it("matches the resolved scope and unscoped assignments when a scope is resolved", async () => {
    const { container, graph } = createContainer()

    await resolveRoles({
      authContext,
      container,
      scope: { type: "organization", id: "org_1" },
    })

    expect(scopeFilterOf(graph)).toEqual({
      $or: [
        { scope: null, scope_id: null },
        { scope: "organization", scope_id: "org_1" },
      ],
    })
  })

  it("caches the assignments under the assignment list tag", async () => {
    const { container, graph } = createContainer()

    await resolveRoles({ authContext, container })

    expect(graph.mock.calls[0][1]).toEqual({
      cache: {
        enable: true,
        ttl: RBAC_CACHE_TTL,
        tags: [RBAC_CACHE_TAGS.ROLE_ASSIGNMENT_LIST],
      },
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
