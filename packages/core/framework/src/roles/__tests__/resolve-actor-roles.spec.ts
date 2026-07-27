import { MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  defineRoleSources,
  FeatureFlag,
  Modules,
} from "@medusajs/utils"
import {
  resolveActorRoleIds,
  resolveActorRoles,
  resolveActorRolesCached,
  resolveActorRolesWithReferences,
} from "../resolve-actor-roles"

type CachingModuleMock = {
  get: jest.Mock
  set: jest.Mock
  computeKey?: jest.Mock
}

type MockContainerArgs = {
  rbacEnabled?: boolean
  graphData?: unknown[]
  assignments?: { role_id: string; reference_id: string }[]
  cachingModule?: CachingModuleMock
}

const makeContainer = ({
  rbacEnabled = true,
  graphData = [],
  assignments = [],
  cachingModule,
}: MockContainerArgs) => {
  const graph = jest.fn().mockResolvedValue({ data: graphData })
  const listRbacRoleAssignments = jest.fn().mockResolvedValue(assignments)

  const container = {
    resolve: (key: string) => {
      if (key === ContainerRegistrationKeys.FEATURE_FLAG_ROUTER) {
        return { isFeatureEnabled: () => rbacEnabled }
      }
      if (key === ContainerRegistrationKeys.QUERY) {
        return { graph }
      }
      if (key === Modules.RBAC) {
        return { listRbacRoleAssignments }
      }
      if (key === Modules.CACHING) {
        return cachingModule
      }
      if (key === ContainerRegistrationKeys.LOGGER) {
        return console
      }
      throw new Error(`Unexpected container resolution: ${key}`)
    },
  } as unknown as MedusaContainer

  return { container, graph, listRbacRoleAssignments }
}

describe("resolveActorRoles", () => {
  it("returns [] when the rbac feature flag is disabled", async () => {
    const { container, graph, listRbacRoleAssignments } = makeContainer({
      rbacEnabled: false,
    })

    const roles = await resolveActorRoles({
      actorType: "user",
      actorId: "usr_1",
      container,
    })

    expect(roles).toEqual([])
    expect(graph).not.toHaveBeenCalled()
    expect(listRbacRoleAssignments).not.toHaveBeenCalled()
  })

  it("resolves the default direct source when nothing is registered", async () => {
    const { container, graph, listRbacRoleAssignments } = makeContainer({
      assignments: [{ role_id: "rol_1", reference_id: "usr_1" }],
    })

    const roles = await resolveActorRoles({
      actorType: "unregistered_actor",
      actorId: "usr_1",
      container,
    })

    // Direct source needs no graph query: the actor is the reference.
    expect(graph).not.toHaveBeenCalled()
    expect(listRbacRoleAssignments).toHaveBeenCalledWith(
      { reference: "unregistered_actor", reference_id: ["usr_1"] },
      { select: ["role_id", "reference_id"] }
    )
    expect(roles).toEqual([
      {
        role_id: "rol_1",
        source: { reference: "unregistered_actor", reference_id: "usr_1" },
        scope: undefined,
      },
    ])
  })

  it("resolves a path source traversing nested to-many relations", async () => {
    defineRoleSources("path_actor", [
      { reference: "membership", path: "organizations.memberships.id" },
    ])

    const { container, graph, listRbacRoleAssignments } = makeContainer({
      graphData: [
        {
          organizations: [
            { memberships: [{ id: "mem_1" }, { id: "mem_2" }] },
            { memberships: [{ id: "mem_3" }] },
          ],
        },
      ],
      assignments: [
        { role_id: "rol_a", reference_id: "mem_1" },
        { role_id: "rol_b", reference_id: "mem_3" },
      ],
    })

    const roles = await resolveActorRoles({
      actorType: "path_actor",
      actorId: "act_1",
      container,
    })

    expect(graph).toHaveBeenCalledWith({
      entity: "path_actor",
      fields: ["organizations.memberships.id"],
      filters: { id: "act_1" },
    })
    expect(listRbacRoleAssignments).toHaveBeenCalledWith(
      { reference: "membership", reference_id: ["mem_1", "mem_2", "mem_3"] },
      { select: ["role_id", "reference_id"] }
    )
    expect(roles).toEqual([
      {
        role_id: "rol_a",
        source: { reference: "membership", reference_id: "mem_1" },
        scope: undefined,
      },
      {
        role_id: "rol_b",
        source: { reference: "membership", reference_id: "mem_3" },
        scope: undefined,
      },
    ])
  })

  it("associates scope through the shared-prefix walk", async () => {
    defineRoleSources("scoped_actor", [
      {
        reference: "membership",
        path: "organizations.memberships.id",
        scope: { type: "organization", path: "organizations.id" },
      },
    ])

    const { container, graph, listRbacRoleAssignments } = makeContainer({
      graphData: [
        {
          organizations: [
            { id: "org_1", memberships: [{ id: "mem_1" }] },
            { id: "org_2", memberships: [{ id: "mem_2" }] },
          ],
        },
      ],
      assignments: [
        { role_id: "rol_a", reference_id: "mem_1" },
        { role_id: "rol_b", reference_id: "mem_2" },
      ],
    })

    const roles = await resolveActorRoles({
      actorType: "scoped_actor",
      actorId: "act_1",
      container,
    })

    expect(graph).toHaveBeenCalledWith({
      entity: "scoped_actor",
      fields: ["organizations.memberships.id", "organizations.id"],
      filters: { id: "act_1" },
    })
    expect(roles).toEqual([
      {
        role_id: "rol_a",
        source: { reference: "membership", reference_id: "mem_1" },
        scope: { type: "organization", id: "org_1" },
      },
      {
        role_id: "rol_b",
        source: { reference: "membership", reference_id: "mem_2" },
        scope: { type: "organization", id: "org_2" },
      },
    ])
    expect(listRbacRoleAssignments).toHaveBeenCalledTimes(1)
  })

  it("narrows to the roles applicable within input.scope", async () => {
    defineRoleSources("narrowed_actor", [
      {
        reference: "membership",
        path: "organizations.memberships.id",
        scope: { type: "organization", path: "organizations.id" },
      },
    ])

    const { container } = makeContainer({
      graphData: [
        {
          organizations: [
            { id: "org_1", memberships: [{ id: "mem_1" }] },
            { id: "org_2", memberships: [{ id: "mem_2" }] },
          ],
        },
      ],
      assignments: [
        { role_id: "rol_a", reference_id: "mem_1" },
        { role_id: "rol_b", reference_id: "mem_2" },
      ],
    })

    const roles = await resolveActorRoles({
      actorType: "narrowed_actor",
      actorId: "act_1",
      container,
      scope: { type: "organization", id: "org_1" },
    })

    expect(roles).toEqual([
      {
        role_id: "rol_a",
        source: { reference: "membership", reference_id: "mem_1" },
        scope: { type: "organization", id: "org_1" },
      },
    ])
  })

  it("emits one role per scope when a reference is reached through multiple scoped branches", async () => {
    defineRoleSources("multi_scope_actor", [
      {
        reference: "membership",
        path: "organizations.memberships.id",
        scope: { type: "organization", path: "organizations.id" },
      },
    ])

    const { container, listRbacRoleAssignments } = makeContainer({
      graphData: [
        {
          organizations: [
            { id: "org_1", memberships: [{ id: "mem_1" }] },
            { id: "org_2", memberships: [{ id: "mem_1" }] },
          ],
        },
      ],
      // A single assignment on the shared reference entity.
      assignments: [{ role_id: "rol_a", reference_id: "mem_1" }],
    })

    const roles = await resolveActorRoles({
      actorType: "multi_scope_actor",
      actorId: "act_1",
      container,
    })

    // The reference is deduped for the lookup, but the assignment fans out to
    // one ResolvedRole per distinct scope it was reached through.
    expect(listRbacRoleAssignments).toHaveBeenCalledWith(
      { reference: "membership", reference_id: ["mem_1"] },
      { select: ["role_id", "reference_id"] }
    )
    expect(roles).toEqual([
      {
        role_id: "rol_a",
        source: { reference: "membership", reference_id: "mem_1" },
        scope: { type: "organization", id: "org_1" },
      },
      {
        role_id: "rol_a",
        source: { reference: "membership", reference_id: "mem_1" },
        scope: { type: "organization", id: "org_2" },
      },
    ])
  })

  it("invokes a function source and concatenates its result", async () => {
    const resolve = jest.fn().mockResolvedValue([
      {
        role_id: "rol_fn",
        source: { reference: "custom", reference_id: "ref_1" },
      },
    ])
    defineRoleSources("fn_actor", { resolve })

    const { container, listRbacRoleAssignments } = makeContainer({})

    const roles = await resolveActorRoles({
      actorType: "fn_actor",
      actorId: "act_1",
      container,
    })

    expect(resolve).toHaveBeenCalledWith({
      actorType: "fn_actor",
      actorId: "act_1",
      container,
    })
    expect(listRbacRoleAssignments).not.toHaveBeenCalled()
    expect(roles).toEqual([
      {
        role_id: "rol_fn",
        source: { reference: "custom", reference_id: "ref_1" },
      },
    ])
  })

  it("skips the module call when no reference ids are collected", async () => {
    defineRoleSources("empty_actor", [
      { reference: "membership", path: "organizations.memberships.id" },
    ])

    const { container, listRbacRoleAssignments } = makeContainer({
      graphData: [{ organizations: [] }],
    })

    const roles = await resolveActorRoles({
      actorType: "empty_actor",
      actorId: "act_1",
      container,
    })

    expect(roles).toEqual([])
    expect(listRbacRoleAssignments).not.toHaveBeenCalled()
  })
})

describe("resolveActorRoleIds", () => {
  it("returns the unique set of role ids", async () => {
    const { container } = makeContainer({
      assignments: [
        { role_id: "rol_1", reference_id: "usr_1" },
        { role_id: "rol_2", reference_id: "usr_1" },
        { role_id: "rol_1", reference_id: "usr_1" },
      ],
    })

    const roleIds = await resolveActorRoleIds({
      actorType: "dedup_actor",
      actorId: "usr_1",
      container,
    })

    expect(roleIds).toEqual(["rol_1", "rol_2"])
  })
})

describe("resolveActorRolesWithReferences", () => {
  it("returns empty roles and references when rbac is disabled", async () => {
    const { container } = makeContainer({ rbacEnabled: false })

    const result = await resolveActorRolesWithReferences({
      actorType: "user",
      actorId: "usr_1",
      container,
    })

    expect(result).toEqual({ roles: [], references: [] })
  })

  it("includes a consulted reference that has zero assignments", async () => {
    // Direct source, but no assignment rows exist for the actor: the reference
    // must still be reported so its cache tag can invalidate a future first
    // assignment.
    const { container } = makeContainer({
      assignments: [],
    })

    const result = await resolveActorRolesWithReferences({
      actorType: "zero_assignment_actor",
      actorId: "usr_zero",
      container,
    })

    expect(result.roles).toEqual([])
    expect(result.references).toEqual([
      { reference: "zero_assignment_actor", reference_id: "usr_zero" },
    ])
  })

  it("dedupes references collected across a path source", async () => {
    defineRoleSources("refs_path_actor", [
      { reference: "membership", path: "organizations.memberships.id" },
    ])

    const { container } = makeContainer({
      graphData: [
        {
          organizations: [
            { memberships: [{ id: "mem_1" }, { id: "mem_2" }] },
            { memberships: [{ id: "mem_2" }] },
          ],
        },
      ],
      assignments: [{ role_id: "rol_a", reference_id: "mem_1" }],
    })

    const result = await resolveActorRolesWithReferences({
      actorType: "refs_path_actor",
      actorId: "act_1",
      container,
    })

    expect(result.roles).toEqual([
      {
        role_id: "rol_a",
        source: { reference: "membership", reference_id: "mem_1" },
      },
    ])
    expect(result.references).toEqual([
      { reference: "membership", reference_id: "mem_1" },
      { reference: "membership", reference_id: "mem_2" },
    ])
  })

  it("derives references from a function source's returned roles", async () => {
    defineRoleSources("refs_fn_actor", {
      resolve: async () => [
        {
          role_id: "rol_fn",
          source: { reference: "custom", reference_id: "ref_1" },
        },
        {
          role_id: "rol_fn2",
          source: { reference: "custom", reference_id: "ref_1" },
        },
      ],
    })

    const { container } = makeContainer({})

    const result = await resolveActorRolesWithReferences({
      actorType: "refs_fn_actor",
      actorId: "act_1",
      container,
    })

    expect(result.references).toEqual([
      { reference: "custom", reference_id: "ref_1" },
    ])
  })
})

describe("resolveActorRolesCached", () => {
  const originalTtl = process.env.MEDUSA_RBAC_ACTOR_ROLES_CACHE_TTL

  const makeCachingModule = (): CachingModuleMock => ({
    get: jest.fn().mockResolvedValue(undefined),
    set: jest.fn().mockResolvedValue(undefined),
  })

  beforeEach(() => {
    FeatureFlag.setFlag("caching", true)
  })

  afterEach(() => {
    FeatureFlag.setFlag("caching", false)
    if (originalTtl === undefined) {
      delete process.env.MEDUSA_RBAC_ACTOR_ROLES_CACHE_TTL
    } else {
      process.env.MEDUSA_RBAC_ACTOR_ROLES_CACHE_TTL = originalTtl
    }
  })

  it("caches under a tag per consulted reference (incl. zero-assignment) and returns the resolved roles", async () => {
    defineRoleSources("cached_actor", [
      { reference: "cached_actor" },
      { reference: "membership", path: "organizations.memberships.id" },
    ])

    const cachingModule = makeCachingModule()
    const { container, listRbacRoleAssignments } = makeContainer({
      graphData: [
        {
          organizations: [{ memberships: [{ id: "mem_1" }, { id: "mem_2" }] }],
        },
      ],
      cachingModule,
    })

    // mem_2 and the membership-source usr_1 lookup have no assignments; honor
    // the reference_id filter so each source only sees its own rows.
    const allAssignments = [
      { role_id: "rol_a", reference_id: "usr_1" },
      { role_id: "rol_b", reference_id: "mem_1" },
      { role_id: "rol_a", reference_id: "mem_1" },
    ]
    listRbacRoleAssignments.mockImplementation(
      async (filters: { reference: string; reference_id: string[] }) =>
        allAssignments.filter(
          (assignment) =>
            filters.reference_id.includes(assignment.reference_id) &&
            (filters.reference === "cached_actor"
              ? assignment.reference_id === "usr_1"
              : assignment.reference_id !== "usr_1")
        )
    )

    const roles = await resolveActorRolesCached({
      actorType: "cached_actor",
      actorId: "usr_1",
      container,
    })

    const expectedRoles = [
      {
        role_id: "rol_a",
        source: { reference: "cached_actor", reference_id: "usr_1" },
      },
      {
        role_id: "rol_b",
        source: { reference: "membership", reference_id: "mem_1" },
      },
      {
        role_id: "rol_a",
        source: { reference: "membership", reference_id: "mem_1" },
      },
    ]

    expect(roles).toEqual(expectedRoles)

    expect(cachingModule.get).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "rbac:actor_roles:cached_actor:usr_1",
        tags: expect.any(Array),
      })
    )

    expect(cachingModule.set).toHaveBeenCalledTimes(1)
    const setArgs = cachingModule.set.mock.calls[0][0]
    expect(setArgs.key).toBe("rbac:actor_roles:cached_actor:usr_1")
    expect(setArgs.data).toEqual(expectedRoles)
    expect(new Set(setArgs.tags)).toEqual(
      new Set([
        "rbac_assignments:cached_actor:usr_1",
        "rbac_assignments:membership:mem_1",
        "rbac_assignments:membership:mem_2",
      ])
    )
  })

  it("returns the cached value on a hit without resolving again", async () => {
    const cachedRoles = [
      {
        role_id: "rol_cached",
        source: { reference: "user", reference_id: "usr_1" },
      },
    ]
    const cachingModule = makeCachingModule()
    cachingModule.get.mockResolvedValue(cachedRoles)

    const { container, listRbacRoleAssignments } = makeContainer({
      cachingModule,
    })

    const roles = await resolveActorRolesCached({
      actorType: "hit_actor",
      actorId: "usr_1",
      container,
    })

    expect(roles).toEqual(cachedRoles)
    expect(listRbacRoleAssignments).not.toHaveBeenCalled()
    expect(cachingModule.set).not.toHaveBeenCalled()
  })

  it("applies input.scope after the cache, storing the unfiltered roles", async () => {
    defineRoleSources("cached_scoped_actor", [
      {
        reference: "membership",
        path: "organizations.memberships.id",
        scope: { type: "organization", path: "organizations.id" },
      },
    ])

    const cachingModule = makeCachingModule()
    const { container } = makeContainer({
      graphData: [
        {
          organizations: [
            { id: "org_1", memberships: [{ id: "mem_1" }] },
            { id: "org_2", memberships: [{ id: "mem_2" }] },
          ],
        },
      ],
      assignments: [
        { role_id: "rol_a", reference_id: "mem_1" },
        { role_id: "rol_b", reference_id: "mem_2" },
      ],
      cachingModule,
    })

    const roles = await resolveActorRolesCached({
      actorType: "cached_scoped_actor",
      actorId: "usr_1",
      container,
      scope: { type: "organization", id: "org_2" },
    })

    // Only the org_2 role is returned...
    expect(roles).toEqual([
      {
        role_id: "rol_b",
        source: { reference: "membership", reference_id: "mem_2" },
        scope: { type: "organization", id: "org_2" },
      },
    ])

    // ...while the cache entry keeps every resolved role, so a later call with
    // a different scope is not poisoned by this one.
    expect(cachingModule.set.mock.calls[0][0].data).toHaveLength(2)
  })

  it("uses the default ttl when the env override is missing or invalid", async () => {
    delete process.env.MEDUSA_RBAC_ACTOR_ROLES_CACHE_TTL

    const cachingModule = makeCachingModule()
    const { container } = makeContainer({
      assignments: [{ role_id: "rol_a", reference_id: "usr_1" }],
      cachingModule,
    })

    await resolveActorRolesCached({
      actorType: "ttl_default_actor",
      actorId: "usr_1",
      container,
    })

    expect(cachingModule.set.mock.calls[0][0].ttl).toBe(60 * 5)

    process.env.MEDUSA_RBAC_ACTOR_ROLES_CACHE_TTL = "not-a-number"
    cachingModule.set.mockClear()

    await resolveActorRolesCached({
      actorType: "ttl_invalid_actor",
      actorId: "usr_1",
      container,
    })

    expect(cachingModule.set.mock.calls[0][0].ttl).toBe(60 * 5)
  })

  it("parses the ttl env override as an integer number of seconds", async () => {
    process.env.MEDUSA_RBAC_ACTOR_ROLES_CACHE_TTL = "42"

    const cachingModule = makeCachingModule()
    const { container } = makeContainer({
      assignments: [{ role_id: "rol_a", reference_id: "usr_1" }],
      cachingModule,
    })

    await resolveActorRolesCached({
      actorType: "ttl_override_actor",
      actorId: "usr_1",
      container,
    })

    expect(cachingModule.set.mock.calls[0][0].ttl).toBe(42)
  })
})
