import { resolveActorRolesCached } from "../resolve-actor-roles"
import { getRequestActorRoles } from "../get-request-actor-roles"

jest.mock("../resolve-actor-roles", () => ({
  resolveActorRolesCached: jest.fn(),
}))

const mockResolve = resolveActorRolesCached as jest.Mock

describe("getRequestActorRoles", () => {
  const scope = {} as any

  beforeEach(() => {
    mockResolve.mockReset()
  })

  it("resolves via the cached resolver using the request's actor context", async () => {
    mockResolve.mockResolvedValue(["rol_1", "rol_2"])

    const req = {
      auth_context: { actor_type: "user", actor_id: "usr_1" },
      scope,
    }

    const roles = await getRequestActorRoles(req)

    expect(roles).toEqual(["rol_1", "rol_2"])
    expect(mockResolve).toHaveBeenCalledWith({
      actorType: "user",
      actorId: "usr_1",
      container: scope,
    })
  })

  it("memoizes on the request so multiple consumers resolve once", async () => {
    mockResolve.mockResolvedValue(["rol_1"])

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
