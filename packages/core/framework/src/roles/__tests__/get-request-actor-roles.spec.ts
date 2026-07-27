import { ScopeResolverHolder } from "@medusajs/utils"
import { resolveActorRolesCached } from "../resolve-actor-roles"
import {
  getRequestActorRoleIds,
  getRequestActorRoles,
} from "../get-request-actor-roles"

jest.mock("../resolve-actor-roles", () => ({
  resolveActorRolesCached: jest.fn(),
}))

const mockResolve = resolveActorRolesCached as jest.Mock

const unscopedRole = {
  role_id: "rol_global",
  source: { reference: "user", reference_id: "usr_1" },
}
const orgARole = {
  role_id: "rol_org_admin",
  source: { reference: "membership", reference_id: "mem_A" },
  scope: { type: "organization", id: "org_A" },
}
const orgBRole = {
  role_id: "rol_support",
  source: { reference: "membership", reference_id: "mem_B" },
  scope: { type: "organization", id: "org_B" },
}

describe("getRequestActorRoles", () => {
  const scope = {} as any

  beforeEach(() => {
    mockResolve.mockReset()
    delete ScopeResolverHolder.resolver
  })

  it("resolves via the cached resolver using the request's actor context", async () => {
    mockResolve.mockResolvedValue([unscopedRole])

    const req = {
      auth_context: { actor_type: "user", actor_id: "usr_1" },
      scope,
    }

    const roles = await getRequestActorRoles(req)

    expect(roles).toEqual([unscopedRole])
    expect(mockResolve).toHaveBeenCalledWith({
      actorType: "user",
      actorId: "usr_1",
      container: scope,
    })
  })

  it("narrows the memoized roles to the request's scope set", async () => {
    mockResolve.mockResolvedValue([unscopedRole, orgARole, orgBRole])

    const req = {
      auth_context: { actor_type: "end_user", actor_id: "eu_1" },
      scope,
      rbacScopes: [{ type: "organization", id: "org_A" }],
    }

    await expect(getRequestActorRoles(req)).resolves.toEqual([
      unscopedRole,
      orgARole,
    ])
  })

  it("keeps only unscoped roles when the request declares no scope", async () => {
    mockResolve.mockResolvedValue([unscopedRole, orgARole, orgBRole])

    const req = {
      auth_context: { actor_type: "end_user", actor_id: "eu_1" },
      scope,
    }

    await expect(getRequestActorRoles(req)).resolves.toEqual([unscopedRole])
  })

  it("memoizes on the request so multiple consumers resolve once", async () => {
    mockResolve.mockResolvedValue([unscopedRole])

    const req = {
      auth_context: { actor_type: "user", actor_id: "usr_1" },
      scope,
    }

    const first = getRequestActorRoles(req)
    const second = getRequestActorRoles(req)

    expect(first).toBe(second)
    await Promise.all([first, second])
    expect(mockResolve).toHaveBeenCalledTimes(1)
  })

  it("resolves to no roles when the actor context is missing (e.g. secret API keys)", async () => {
    const req = { auth_context: {}, scope }

    const roles = await getRequestActorRoles(req)

    expect(roles).toEqual([])
    expect(mockResolve).not.toHaveBeenCalled()
  })

  it("resolves to no roles when there is no auth context at all", async () => {
    const req = { scope }

    const roles = await getRequestActorRoles(req)

    expect(roles).toEqual([])
    expect(mockResolve).not.toHaveBeenCalled()
  })
})

describe("getRequestActorRoleIds", () => {
  const scope = {} as any

  const makeReq = () => ({
    auth_context: { actor_type: "end_user", actor_id: "eu_1" },
    scope,
  })

  beforeEach(() => {
    mockResolve.mockReset()
    mockResolve.mockResolvedValue([unscopedRole, orgARole, orgBRole])
    delete ScopeResolverHolder.resolver
  })

  it("applies only unscoped roles when the request declares no scope", async () => {
    const roleIds = await getRequestActorRoleIds(makeReq())

    expect(roleIds).toEqual(["rol_global"])
  })

  it("applies scoped roles whose scope is in the request's scope set", async () => {
    const req = {
      ...makeReq(),
      rbacScopes: [{ type: "organization", id: "org_A" }],
    }

    const roleIds = await getRequestActorRoleIds(req)

    expect(roleIds).toEqual(["rol_global", "rol_org_admin"])
  })

  it("excludes roles scoped to a different scope than the request's", async () => {
    const req = {
      ...makeReq(),
      rbacScopes: [{ type: "organization", id: "org_B" }],
    }

    const roleIds = await getRequestActorRoleIds(req)

    expect(roleIds).toEqual(["rol_global", "rol_support"])
    expect(roleIds).not.toContain("rol_org_admin")
  })

  it("matches on both scope type and id", async () => {
    const req = {
      ...makeReq(),
      rbacScopes: [{ type: "team", id: "org_A" }],
    }

    const roleIds = await getRequestActorRoleIds(req)

    expect(roleIds).toEqual(["rol_global"])
  })

  it("applies roles across a multi-scope request set (hierarchy chain)", async () => {
    const req = {
      ...makeReq(),
      rbacScopes: [
        { type: "organization", id: "org_A" },
        { type: "organization", id: "org_B" },
      ],
    }

    const roleIds = await getRequestActorRoleIds(req)

    expect(roleIds).toEqual(["rol_global", "rol_org_admin", "rol_support"])
  })

  it("derives the scope set from the registered scope resolver", async () => {
    ScopeResolverHolder.resolver = ({ req }: { req: any }) => {
      return req.params?.org_id
        ? { type: "organization", id: req.params.org_id }
        : undefined
    }

    const req = { ...makeReq(), params: { org_id: "org_A" } }

    const roleIds = await getRequestActorRoleIds(req)

    expect(roleIds).toEqual(["rol_global", "rol_org_admin"])
  })

  it("dedupes role ids granted through multiple applicable scopes", async () => {
    mockResolve.mockResolvedValue([
      { ...orgARole },
      { ...orgARole, scope: { type: "organization", id: "org_B" } },
    ])

    const req = {
      ...makeReq(),
      rbacScopes: [
        { type: "organization", id: "org_A" },
        { type: "organization", id: "org_B" },
      ],
    }

    const roleIds = await getRequestActorRoleIds(req)

    expect(roleIds).toEqual(["rol_org_admin"])
  })
})
