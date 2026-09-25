import { refetchEntities, refetchEntity } from "@medusajs/framework/http"
import { NextFunction } from "express"
import { setPricingContext } from "../set-pricing-context"

jest.mock("@medusajs/framework/http", () => ({
  refetchEntity: jest.fn(),
  refetchEntities: jest.fn(),
}))

const mockRefetchEntity = refetchEntity as jest.Mock
const mockRefetchEntities = refetchEntities as jest.Mock

describe("setPricingContext", () => {
  let req: any
  let res: any
  let next: NextFunction

  beforeEach(() => {
    jest.clearAllMocks()
    req = {
      queryConfig: { fields: ["variants.calculated_price"] },
      filterableFields: { region_id: "reg_1" },
      auth_context: { actor_id: "cus_1" },
      scope: {},
    }
    res = {}
    next = jest.fn()

    mockRefetchEntity.mockResolvedValue({
      id: "reg_1",
      currency_code: "usd",
    })
    mockRefetchEntities.mockResolvedValue({
      data: [{ id: "cusgroup_1" }, { id: "cusgroup_2" }],
    })
  })

  it("should expose customer group ids under the customer_group_id attribute", async () => {
    await setPricingContext()(req, res, next)

    // `customer_group_id` is the attribute price list rules are written
    // with (see the admin dashboard price list forms); the pricing
    // repository matches rule attributes verbatim against the flattened
    // context, so this key is what makes customer-group price lists apply.
    expect(req.pricingContext.customer_group_id).toEqual([
      "cusgroup_1",
      "cusgroup_2",
    ])
    expect(next).toHaveBeenCalled()
  })

  it("should keep populating the nested customer.groups shape", async () => {
    await setPricingContext()(req, res, next)

    expect(req.pricingContext.customer).toEqual({
      groups: [{ id: "cusgroup_1" }, { id: "cusgroup_2" }],
    })
  })

  it("should set an empty customer_group_id when the customer has no groups", async () => {
    mockRefetchEntities.mockResolvedValue({ data: [] })

    await setPricingContext()(req, res, next)

    expect(req.pricingContext.customer_group_id).toEqual([])
    expect(req.pricingContext.customer).toEqual({ groups: [] })
    expect(next).toHaveBeenCalled()
  })

  it("should not set customer group attributes for anonymous requests", async () => {
    delete req.auth_context

    await setPricingContext()(req, res, next)

    expect(req.pricingContext.customer).toBeUndefined()
    expect(req.pricingContext.customer_group_id).toBeUndefined()
    expect(mockRefetchEntities).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it("should skip entirely when no calculated price fields are requested", async () => {
    req.queryConfig = { fields: ["title"] }

    await setPricingContext()(req, res, next)

    expect(req.pricingContext).toBeUndefined()
    expect(mockRefetchEntity).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
