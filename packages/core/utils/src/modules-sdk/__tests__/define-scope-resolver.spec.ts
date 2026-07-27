import {
  defineScopeResolver,
  getScopeResolver,
  ScopeResolverHolder,
} from "../define-scope-resolver"

describe("defineScopeResolver", function () {
  beforeEach(function () {
    delete ScopeResolverHolder.resolver
  })

  it("should return undefined when no resolver is registered", function () {
    expect(getScopeResolver()).toBeUndefined()
  })

  it("should register and return the resolver", function () {
    const resolver = () => ({ type: "organization", id: "org_1" })

    defineScopeResolver(resolver)

    expect(getScopeResolver()).toBe(resolver)
  })

  it("should throw when a different resolver is already registered", function () {
    defineScopeResolver(() => undefined)

    expect(() => defineScopeResolver(() => undefined)).toThrow(
      "already registered"
    )
  })

  it("should allow re-registering the same resolver reference", function () {
    const resolver = () => undefined

    defineScopeResolver(resolver)

    expect(() => defineScopeResolver(resolver)).not.toThrow()
    expect(getScopeResolver()).toBe(resolver)
  })

  it("should throw when the resolver is not a function", function () {
    expect(() => defineScopeResolver(undefined as any)).toThrow(
      "must be a function"
    )
  })
})
