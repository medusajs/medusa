import { unlessPath } from "../unless-path"

describe("unlessPath", () => {
  const run = (handler: ReturnType<typeof unlessPath>, path: string) => {
    const next = jest.fn()
    handler({ path } as any, {} as any, next)
    return next
  }

  it("skips the middleware for a matching path", () => {
    const middleware = jest.fn()
    const handler = unlessPath(/^\/health/, middleware)

    const next = run(handler, "/health")

    expect(middleware).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it("runs the middleware for a non-matching path", () => {
    const middleware = jest.fn()
    const handler = unlessPath(/^\/health/, middleware)

    run(handler, "/admin/products")

    expect(middleware).toHaveBeenCalledTimes(1)
  })

  it.each([
    ["global", /^\/health/g],
    ["sticky", /^\/health/y],
  ])(
    "keeps skipping a matching path across requests with a %s expression",
    (_name, onPath) => {
      const middleware = jest.fn()
      const handler = unlessPath(onPath, middleware)

      run(handler, "/health")
      run(handler, "/health")
      run(handler, "/health")

      expect(middleware).not.toHaveBeenCalled()
    }
  )

  it("does not mutate the caller's expression", () => {
    const onPath = /^\/health/g
    const handler = unlessPath(onPath, jest.fn())

    run(handler, "/health")

    expect(onPath.lastIndex).toBe(0)
  })
})
