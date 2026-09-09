import { z } from "@medusajs/deps/zod"
import { QueryConfig } from "@medusajs/types"

import { MedusaRequest, MedusaResponse } from "../../types"
import { validateAndTransformQuery } from "../validate-query"

const schema = z.object({
  fields: z.string().optional(),
})

const queryConfig: QueryConfig<any> = {
  defaults: ["id"],
  allowed: ["id"],
  disallowed: ["secret"],
  isList: false,
}

const createRequest = (query: Record<string, any> = {}) =>
  ({
    query,
  }) as unknown as MedusaRequest

const run = async (req: MedusaRequest) => {
  const middleware = validateAndTransformQuery(schema, queryConfig)

  await new Promise<void>((resolve, reject) => {
    middleware(req, {} as MedusaResponse, (err?: any) =>
      err ? reject(err) : resolve()
    )
  })
}

describe("validateAndTransformQuery", () => {
  it("merges req.allowed into the configured allowed fields", async () => {
    const req = createRequest({ fields: "id,company" })
    req.allowed = ["company"]

    await run(req)

    expect(req.queryConfig.fields).toEqual(
      expect.arrayContaining(["id", "company"])
    )
  })

  it("does not leak req.allowed to the route handler", async () => {
    const req = createRequest({ fields: "id,company" })
    req.allowed = ["company"]

    await run(req)

    expect(req.allowed).toBeUndefined()
  })

  it("keeps the merged req.allowed when invoked twice on the same request", async () => {
    const req = createRequest({ fields: "id,company" })
    req.allowed = ["company"]

    await run(req)
    await run(req)

    expect(req.queryConfig.fields).toEqual(
      expect.arrayContaining(["id", "company"])
    )
    expect(req.allowed).toBeUndefined()
  })

  it("never re-opens a disallowed field through req.allowed", async () => {
    const req = createRequest({ fields: "id,secret" })
    req.allowed = ["secret"]

    await run(req)
    await run(req)

    expect(req.queryConfig.fields).not.toContain("secret")
  })
})
