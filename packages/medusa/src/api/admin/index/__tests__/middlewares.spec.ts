import { MedusaError, Modules } from "@medusajs/framework/utils"
import { adminIndexRoutesMiddlewares } from "../middlewares"

const isIndexEnabledMiddleware = adminIndexRoutesMiddlewares[0]
  .middlewares![1] as Function

const buildReq = (indexService?: unknown) =>
  ({
    scope: {
      resolve: jest.fn((key: string) => {
        if (key === Modules.INDEX) {
          return indexService
        }
        return { warn: jest.fn() }
      }),
    },
  } as any)

const buildRes = () => {
  const res: any = {}
  res.status = jest.fn(() => res)
  res.json = jest.fn(() => res)
  return res
}

describe("isIndexEnabledMiddleware", () => {
  it.each(["/admin/index/details", "/admin/index/sync"])(
    "should use the same index guard for %s",
    (matcher) => {
      const route = adminIndexRoutesMiddlewares.find(
        (r) => r.matcher === matcher
      )

      expect(route?.middlewares).toContain(isIndexEnabledMiddleware)
    }
  )

  it.each([
    ["the index module is not registered", undefined],
    ["the index engine feature flag is disabled", {}],
  ])(
    "should end the request with a not found error when %s",
    (_, indexService) => {
      const res = buildRes()
      const next = jest.fn()

      isIndexEnabledMiddleware(buildReq(indexService), res, next)

      expect(next).toHaveBeenCalledTimes(1)
      const error = next.mock.calls[0][0]
      expect(error).toBeInstanceOf(MedusaError)
      expect(error.type).toEqual(MedusaError.Types.NOT_FOUND)
    }
  )
})
