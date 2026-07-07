import { isProduction } from "../is-production"

describe("isProduction", function () {
  const originalNodeEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv
  })

  it("returns true when NODE_ENV is 'production'", function () {
    process.env.NODE_ENV = "production"
    expect(isProduction()).toBe(true)
  })

  it("returns true when NODE_ENV is 'prod'", function () {
    process.env.NODE_ENV = "prod"
    expect(isProduction()).toBe(true)
  })

  it("returns false when NODE_ENV is 'development'", function () {
    process.env.NODE_ENV = "development"
    expect(isProduction()).toBe(false)
  })

  it("returns false when NODE_ENV is 'test'", function () {
    process.env.NODE_ENV = "test"
    expect(isProduction()).toBe(false)
  })

  it("returns false when NODE_ENV is unset", function () {
    delete process.env.NODE_ENV
    expect(isProduction()).toBe(false)
  })

  it("returns false for unrelated values like 'productionish'", function () {
    process.env.NODE_ENV = "productionish"
    expect(isProduction()).toBe(false)
  })
})
