import { unlessPath } from "../unless-path"

describe("unlessPath", () => {
  const makeReq = (path: string) => ({ path } as any)
  const res = {} as any

  it("skips the middleware and calls next when the path matches", () => {
    const middleware = jest.fn()
    const next = jest.fn()

    unlessPath(/^\/health/, middleware)(makeReq("/health"), res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(middleware).not.toHaveBeenCalled()
  })

  it("runs the middleware when the path does not match", () => {
    const middleware = jest.fn()
    const next = jest.fn()

    unlessPath(/^\/health/, middleware)(makeReq("/orders"), res, next)

    expect(middleware).toHaveBeenCalledTimes(1)
    expect(next).not.toHaveBeenCalled()
  })

  it("does not alternate for a global regex reused across requests", () => {
    const middleware = jest.fn()
    const handler = unlessPath(/^\/health/g, middleware)

    for (let i = 0; i < 4; i++) {
      const next = jest.fn()
      handler(makeReq("/health"), res, next)
      // A matching path must skip the middleware on every request, not every other one.
      expect(next).toHaveBeenCalledTimes(1)
    }

    expect(middleware).not.toHaveBeenCalled()
  })

  it("does not mutate the caller's regex lastIndex", () => {
    const onPath = /^\/health/g

    unlessPath(onPath, jest.fn())(makeReq("/health"), res, jest.fn())

    expect(onPath.lastIndex).toBe(0)
  })
})
