import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "../../types"
import { applyCrossModuleFilter } from "../apply-cross-module-filter"

describe("applyCrossModuleFilter", () => {
  const run = async (filterableFields: Record<string, unknown>) => {
    const req = { filterableFields } as unknown as MedusaRequest
    const next: MedusaNextFunction = jest.fn()

    await applyCrossModuleFilter({
      filterableField: "sales_channel_id",
      relationPath: "product.sales_channels.id",
    })(req, {} as MedusaResponse, next)

    expect(next).toHaveBeenCalledWith()

    return req.filterableFields
  }

  it("moves the filter into the nested relation path", async () => {
    const filters = await run({ id: "variant_1", sales_channel_id: ["sc_1"] })

    expect(filters).toEqual({
      id: "variant_1",
      product: { sales_channels: { id: ["sc_1"] } },
    })
  })

  it("merges into existing relation filters", async () => {
    const filters = await run({
      product: { status: "published" },
      sales_channel_id: "sc_1",
    })

    expect(filters).toEqual({
      product: { status: "published", sales_channels: { id: "sc_1" } },
    })
  })

  it("leaves the filters untouched when the field is not set", async () => {
    const filters = await run({ id: "variant_1", sales_channel_id: [] })

    expect(filters).toEqual({ id: "variant_1", sales_channel_id: [] })
  })
})
