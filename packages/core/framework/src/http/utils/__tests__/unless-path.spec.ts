import { MedusaNextFunction, MedusaRequest, MedusaResponse } from "../../types"
import { unlessPath } from "../unless-path"

describe("unlessPath", () => {
  let middleware: jest.Mock
  let next: jest.Mock
  let res: MedusaResponse

  const request = (path: string) => ({ path }) as MedusaRequest

  const run = (
    handler: (
      req: MedusaRequest,
      res: MedusaResponse,
      next: MedusaNextFunction
    ) => unknown,
    path: string
  ) => handler(request(path), res, next as unknown as MedusaNextFunction)

  beforeEach(() => {
    middleware = jest.fn()
    next = jest.fn()
    res = {} as MedusaResponse
  })

  it("skips the middleware on a matching path", () => {
    const handler = unlessPath(/^\/health/, middleware)

    run(handler, "/health")

    expect(next).toHaveBeenCalledTimes(1)
    expect(middleware).not.toHaveBeenCalled()
  })

  it("runs the middleware on a path that does not match", () => {
    const handler = unlessPath(/^\/health/, middleware)

    run(handler, "/admin/orders")

    expect(middleware).toHaveBeenCalledTimes(1)
    expect(next).not.toHaveBeenCalled()
  })

  it("keeps skipping the middleware across requests when the regex is global", () => {
    const handler = unlessPath(/^\/health/g, middleware)

    run(handler, "/health")
    run(handler, "/health")
    run(handler, "/health")

    expect(next).toHaveBeenCalledTimes(3)
    expect(middleware).not.toHaveBeenCalled()
  })

  it("keeps skipping the middleware across requests when the regex is sticky", () => {
    const handler = unlessPath(/^\/health/y, middleware)

    run(handler, "/health")
    run(handler, "/health")
    run(handler, "/health")

    expect(next).toHaveBeenCalledTimes(3)
    expect(middleware).not.toHaveBeenCalled()
  })

  it("keeps running the middleware across requests on a path that does not match", () => {
    const handler = unlessPath(/^\/health/g, middleware)

    run(handler, "/admin/orders")
    run(handler, "/admin/orders")

    expect(middleware).toHaveBeenCalledTimes(2)
    expect(next).not.toHaveBeenCalled()
  })

  it("leaves the caller's regex untouched", () => {
    const onPath = /^\/health/g
    const handler = unlessPath(onPath, middleware)

    run(handler, "/health")

    expect(onPath.lastIndex).toBe(0)
  })

  it("passes the request, response and next through to the middleware", () => {
    const handler = unlessPath(/^\/health/, middleware)
    const req = request("/admin/orders")

    handler(req, res, next as unknown as MedusaNextFunction)

    expect(middleware).toHaveBeenCalledWith(req, res, next)
  })
})
