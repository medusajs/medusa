import { MedusaRequest, MedusaResponse } from "../../types"
import { allowFields } from "../allow-fields-middleware"

const run = (middleware: any, req: Partial<MedusaRequest>) => {
  const next = jest.fn()
  middleware(req as MedusaRequest, {} as MedusaResponse, next)
  return next
}

describe("allowFields", () => {
  it("pushes the given fields onto req.allowed", () => {
    const req = { allowed: [] } as Partial<MedusaRequest>

    const next = run(allowFields("brand", "brand.*"), req)

    expect(req.allowed).toEqual(["brand", "brand.*"])
    expect(next).toHaveBeenCalled()
  })

  it("accepts arrays of fields", () => {
    const req = { allowed: [] } as Partial<MedusaRequest>

    run(allowFields(["brand", "brand.*"], "supplier"), req)

    expect(req.allowed).toEqual(["brand", "brand.*", "supplier"])
  })

  it("keeps fields added by other middlewares", () => {
    const req = { allowed: ["company"] } as Partial<MedusaRequest>

    run(allowFields("brand"), req)
    run(allowFields("supplier"), req)

    expect(req.allowed).toEqual(["company", "brand", "supplier"])
  })
})
