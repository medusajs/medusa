import { ScopeResolverHolder } from "@medusajs/utils"
import { getRequestScopes } from "../get-request-scopes"

describe("getRequestScopes", () => {
  beforeEach(() => {
    delete ScopeResolverHolder.resolver
  })

  it("resolves to no scopes when no resolver is registered", async () => {
    const req = {}

    await expect(getRequestScopes(req)).resolves.toEqual([])
  })

  it("normalizes a single scope returned by the resolver", async () => {
    ScopeResolverHolder.resolver = () => ({
      type: "organization",
      id: "org_1",
    })

    await expect(getRequestScopes({})).resolves.toEqual([
      { type: "organization", id: "org_1" },
    ])
  })

  it("returns the scope array as-is when the resolver returns several", async () => {
    const scopes = [
      { type: "repository", id: "repo_1" },
      { type: "organization", id: "org_1" },
    ]
    ScopeResolverHolder.resolver = () => scopes

    await expect(getRequestScopes({})).resolves.toEqual(scopes)
  })

  it("normalizes undefined (unscoped request) to an empty array", async () => {
    ScopeResolverHolder.resolver = () => undefined

    await expect(getRequestScopes({})).resolves.toEqual([])
  })

  it("supports async resolvers", async () => {
    ScopeResolverHolder.resolver = async () => ({
      type: "organization",
      id: "org_async",
    })

    await expect(getRequestScopes({})).resolves.toEqual([
      { type: "organization", id: "org_async" },
    ])
  })

  it("passes the request to the resolver", async () => {
    const resolver = jest.fn().mockReturnValue(undefined)
    ScopeResolverHolder.resolver = resolver
    const req = { params: { org_id: "org_1" } } as any

    await getRequestScopes(req)

    expect(resolver).toHaveBeenCalledWith({ req })
  })

  it("memoizes on the request so the resolver runs once", async () => {
    const resolver = jest
      .fn()
      .mockReturnValue({ type: "organization", id: "org_1" })
    ScopeResolverHolder.resolver = resolver
    const req = {}

    const first = getRequestScopes(req)
    const second = getRequestScopes(req)

    expect(first).toBe(second)
    await Promise.all([first, second])
    expect(resolver).toHaveBeenCalledTimes(1)
  })

  it("prefers scopes assigned directly on the request over the resolver", async () => {
    const resolver = jest
      .fn()
      .mockReturnValue({ type: "organization", id: "from_resolver" })
    ScopeResolverHolder.resolver = resolver

    const assigned = [{ type: "organization", id: "from_middleware" }]
    const req = { rbacScopes: assigned }

    await expect(getRequestScopes(req)).resolves.toEqual(assigned)
    expect(resolver).not.toHaveBeenCalled()
  })

  it("propagates resolver errors instead of degrading to unscoped", async () => {
    ScopeResolverHolder.resolver = () => {
      throw new Error("tenancy lookup failed")
    }

    await expect(getRequestScopes({})).rejects.toThrow("tenancy lookup failed")
  })
})
