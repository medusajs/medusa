import { MedusaNextFunction, MedusaRequest, MedusaResponse } from "../types"
import { unlessPath } from "../utils/unless-path"

describe("unlessPath", () => {
  it.each([
    ["global", /^\/health/g],
    ["sticky", /^\/health/y],
  ])(
    "should consistently skip middleware for a matching %s regex",
    (_, pathMatcher) => {
      const middleware = jest.fn()
      const handler = unlessPath(pathMatcher, middleware)
      const req = { path: "/health" } as MedusaRequest
      const res = {} as MedusaResponse
      const next: MedusaNextFunction = jest.fn()

      handler(req, res, next)
      handler(req, res, next)

      expect(next).toHaveBeenCalledTimes(2)
      expect(middleware).not.toHaveBeenCalled()
    }
  )
})
