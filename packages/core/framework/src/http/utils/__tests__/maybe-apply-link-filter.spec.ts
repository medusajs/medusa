import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from "../../types"
import { maybeApplyLinkFilter } from "../maybe-apply-link-filter"

describe("maybeApplyLinkFilter", () => {
  const createReq = (filterableFields: Record<string, unknown>) =>
    ({
      filterableFields,
      scope: {
        resolve: () => ({ graph: async () => ({ data: [] }) }),
      },
    }) as unknown as MedusaRequest

  it("does not pollute the object prototype through unsafe filter keys", async () => {
    const req = createReq({
      sales_channel_id: "sc_1",
      "constructor.prototype.polluted": "x",
      "__proto__.pwned": "x",
    })
    const next: MedusaNextFunction = jest.fn()

    await maybeApplyLinkFilter({
      entryPoint: "product_sales_channel",
      resourceId: "product_id",
      filterableField: "sales_channel_id",
    })(req, {} as MedusaResponse, next)

    expect(next).toHaveBeenCalledWith()
    expect(Object.prototype["polluted"]).toBeUndefined()
    expect(Object.prototype["pwned"]).toBeUndefined()
    expect((req.filterableFields as any).constructor).toBe(Object)
  })
})
