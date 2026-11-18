import { MedusaContainer } from "@medusajs/framework/types"
import { canActorGrantPolicies } from "../can-actor-grant-policies"

const getActorPermissionsMock = jest.fn()

jest.mock("@medusajs/framework", () => ({
  ...jest.requireActual("@medusajs/framework"),
  getActorPermissions: (...args: unknown[]) => getActorPermissionsMock(...args),
}))

const container = {} as MedusaContainer

describe("canActorGrantPolicies", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getActorPermissionsMock.mockResolvedValue(
      new Set(["product:*", "customer:read"])
    )
  })

  it("grants nothing to check without resolving permissions", async () => {
    const allowed = await canActorGrantPolicies({
      container,
      actor_id: "usr_1",
      actions: [],
    })

    expect(allowed).toBe(true)
    expect(getActorPermissionsMock).not.toHaveBeenCalled()
  })

  it("grants actions the actor's permissions cover, wildcards included", async () => {
    const scope = { type: "organization", id: "org_1" }

    const allowed = await canActorGrantPolicies({
      container,
      actor_id: "usr_1",
      actions: [
        { resource: "product", operation: "update" },
        { resource: "customer", operation: "read" },
      ],
      scope,
    })

    expect(allowed).toBe(true)
    expect(getActorPermissionsMock).toHaveBeenCalledWith({
      authContext: { actor_id: "usr_1", actor_type: "user" },
      container,
      scope,
    })
  })

  it("denies when any action is not covered", async () => {
    const allowed = await canActorGrantPolicies({
      container,
      actor_id: "usr_1",
      actor: "api-key",
      actions: [
        { resource: "product", operation: "read" },
        { resource: "customer", operation: "update" },
      ],
    })

    expect(allowed).toBe(false)
    expect(getActorPermissionsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        authContext: { actor_id: "usr_1", actor_type: "api-key" },
      })
    )
  })
})
