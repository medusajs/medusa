import { z } from "@medusajs/deps/zod"
import { QueryConfig } from "@medusajs/types"

import { MedusaRequest, MedusaResponse } from "../../types"
import { validateAndTransformQuery } from "../validate-query"

const schema = z.object({
  fields: z.string().optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
})

const queryConfig: QueryConfig<any> = {
  defaults: ["id"],
  allowed: ["id"],
  disallowed: ["secret"],
  isList: false,
}

const createRequest = (query: Record<string, any> = {}) => {
  const req = { query } as unknown as MedusaRequest
  req.allowed = []
  return req
}

const run = async (
  queryConfig: Parameters<typeof validateAndTransformQuery>[1],
  req: Partial<MedusaRequest>
) => {
  const middleware = validateAndTransformQuery(schema, queryConfig)
  const request = req as MedusaRequest
  request.query ??= {}
  request.allowed ??= []
  const next = jest.fn()

  await middleware(request, {} as MedusaResponse, next)

  expect(next).toHaveBeenCalledWith()

  return request
}

describe("validateAndTransformQuery", () => {
  it("merges req.allowed into the configured allowed fields", async () => {
    const req = createRequest({ fields: "id,company" })
    req.allowed.push("company")

    await run(queryConfig, req)

    expect(req.queryConfig.fields).toEqual(
      expect.arrayContaining(["id", "company"])
    )
  })

  describe("accumulating fields", () => {
    it("keeps the fields added by an earlier middleware when a later one adds", async () => {
      const req = createRequest({ fields: "id,company,phone" })
      req.allowed.push("company")
      req.allowed.push("phone")

      await run(queryConfig, req)

      expect(req.queryConfig.fields).toEqual(
        expect.arrayContaining(["id", "company", "phone"])
      )
    })

    it("resolves a field contributed twice only once", async () => {
      const req = createRequest({ fields: "id,company" })
      req.allowed.push("company")
      req.allowed.push("company")

      await run(queryConfig, req)

      expect(
        req.queryConfig.fields.filter((field) => field === "company")
      ).toHaveLength(1)
    })

    it("still honours a whole array assigned to req.allowed", async () => {
      const req = createRequest({ fields: "id,company" })
      req.allowed = ["company"]

      await run(queryConfig, req)

      expect(req.queryConfig.fields).toEqual(
        expect.arrayContaining(["id", "company"])
      )
    })

    it("lets disallowed take back a field granted through req.allowed", async () => {
      const req = createRequest({ fields: "id,company" })
      req.allowed.push("company")
      req.disallowed = ["company"]

      await run(queryConfig, req)

      expect(req.queryConfig.fields).not.toContain("company")
    })

    it("does not leak the added fields into another request", async () => {
      const first = createRequest({ fields: "id,company" })
      first.allowed.push("company")

      await run(queryConfig, first)

      expect(first.queryConfig.fields).toEqual(
        expect.arrayContaining(["id", "company"])
      )

      const second = createRequest({ fields: "id,company" })

      await run(queryConfig, second)

      expect(second.allowed).toEqual([])
      expect(second.queryConfig.fields).not.toContain("company")
    })

    it("does not mutate the route's configured allowed list", async () => {
      const routeConfig: QueryConfig<any> = {
        defaults: ["id"],
        allowed: ["id"],
        isList: false,
      }
      const req = createRequest({ fields: "id,company" })
      req.allowed.push("company")

      await run(routeConfig, req)

      expect(routeConfig.allowed).toEqual(["id"])
    })

    it("clears the accumulated fields so they never reach the handler", async () => {
      const req = createRequest({ fields: "id,company" })
      req.allowed.push("company")

      await run(queryConfig, req)

      expect(req.allowed).toEqual([])
    })
  })

  it("does not leak req.allowed to the route handler", async () => {
    const req = createRequest({ fields: "id,company" })
    req.allowed.push("company")

    await run(queryConfig, req)

    expect(req.allowed).toEqual([])
  })

  it("keeps the merged req.allowed when invoked twice on the same request", async () => {
    const req = createRequest({ fields: "id,company" })
    req.allowed.push("company")

    await run(queryConfig, req)
    await run(queryConfig, req)

    expect(req.queryConfig.fields).toEqual(
      expect.arrayContaining(["id", "company"])
    )
    expect(req.allowed).toEqual([])
  })

  it("never re-opens a disallowed field through req.allowed", async () => {
    const req = createRequest({ fields: "id,secret" })
    req.allowed.push("secret")

    await run(queryConfig, req)
    await run(queryConfig, req)

    expect(req.queryConfig.fields).not.toContain("secret")
  })

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
