import { z } from "@medusajs/deps/zod"
import { MedusaRequest, MedusaResponse } from "../../types"
import { validateAndTransformQuery } from "../validate-query"

const schema = z.object({
  fields: z.string().optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
})

const run = async (
  queryConfig: Parameters<typeof validateAndTransformQuery>[1],
  req: Partial<MedusaRequest>
) => {
  const middleware = validateAndTransformQuery(schema, queryConfig)
  const request = { query: {}, ...req } as MedusaRequest
  const next = jest.fn()

  await middleware(request, {} as MedusaResponse, next)

  expect(next).toHaveBeenCalledWith()

  return request
}

describe("validateAndTransformQuery", () => {
  describe("disallowed fields", () => {
    it("should enforce the configured disallowed fields", async () => {
      const req = await run(
        { entity: "region", disallowed: ["orders"], isList: true },
        { query: { fields: "id,orders.total" } }
      )

      expect(req.queryConfig.fields).toEqual(["id"])
    })

    it("should replace the configured disallowed fields with the ones set on the request", async () => {
      const req = await run(
        { entity: "region", disallowed: ["orders", "carts"], isList: true },
        {
          query: { fields: "id,orders.total,carts.total" },
          disallowed: ["carts"],
        }
      )

      expect(req.queryConfig.fields).toEqual(["id", "orders.total"])
    })

    it("should lift a disallowed pattern left out of the request fields", async () => {
      const req = await run(
        {
          entity: "product",
          disallowed: ["orders", /_link$/],
          isList: true,
        },
        {
          query: { fields: "id,brand_link.name,orders.total" },
          disallowed: ["orders"],
        }
      )

      expect(req.queryConfig.fields).toEqual(["id", "brand_link.name"])
    })

    it("should remove the boundary when an empty array is set on the request", async () => {
      const req = await run(
        { entity: "region", disallowed: ["orders"], isList: true },
        { query: { fields: "id,orders.total" }, disallowed: [] }
      )

      expect(req.queryConfig.fields).toEqual(["id", "orders.total"])
    })

    it("should not leak the override to another request", async () => {
      const queryConfig = {
        entity: "region",
        disallowed: ["orders"],
        isList: true,
      }

      const req = await run(queryConfig, {
        query: { fields: "id,orders.total" },
        disallowed: [],
      })

      expect(req.queryConfig.fields).toEqual(["id", "orders.total"])
      expect(req.disallowed).toBeUndefined()

      const secondReq = await run(queryConfig, {
        query: { fields: "id,orders.total" },
      })

      expect(secondReq.queryConfig.fields).toEqual(["id"])
    })
  })
})
