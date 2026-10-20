import { MedusaContainer } from "@medusajs/framework"
import { asValue, createContainer } from "@medusajs/framework/awilix"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { registerWorkflowEngine } from "../../../common/steps/__fixtures__/workflow-engine"
import { listShippingOptionsForCartWithPricingWorkflow } from "../list-shipping-options-for-cart-with-pricing"

const stockLocation = {
  id: "sloc_1",
  name: "Warehouse",
  address: { id: "laddr_1", address_1: "Street 1", country_code: "us" },
  fulfillment_sets: [{ id: "fuset_1" }, { id: "fuset_2" }, { id: "fuset_3" }],
}

const expectedLocation = {
  id: stockLocation.id,
  name: stockLocation.name,
  address: stockLocation.address,
}

describe("listShippingOptionsForCartWithPricingWorkflow", () => {
  let container!: MedusaContainer
  let calculateShippingOptionsPrices: jest.Mock

  beforeEach(async () => {
    calculateShippingOptionsPrices = jest.fn(async (data: any[]) =>
      data.map(() => ({
        calculated_amount: 20,
        is_calculated_price_tax_inclusive: false,
      }))
    )

    const graph = jest.fn(async ({ entity }) => {
      switch (entity) {
        case "cart":
          return {
            data: [
              {
                id: "cart_1",
                sales_channel_id: "sc_1",
                region_id: "reg_1",
                currency_code: "usd",
                items: [],
              },
            ],
          }
        case "sales_channels":
          return { data: [{ stock_locations: [stockLocation] }] }
        case "shipping_options":
          return {
            data: [
              { id: "so_flat", price_type: "flat" },
              { id: "so_calculated", price_type: "calculated" },
            ],
          }
        default:
          return { data: [] }
      }
    })

    const remoteQuery = jest.fn(async ({ variables }) => {
      if (variables.id.includes("so_flat")) {
        return [
          {
            id: "so_flat",
            price_type: "flat",
            service_zone: { fulfillment_set_id: "fuset_1" },
            calculated_price: { calculated_amount: 10 },
          },
        ]
      }

      if (variables.id.includes("so_calculated")) {
        return [
          {
            id: "so_calculated",
            price_type: "calculated",
            provider_id: "manual_manual",
            shipping_profile_id: "sp_1",
            data: {},
            service_zone: { fulfillment_set_id: "fuset_2" },
          },
        ]
      }

      return []
    })

    container = createContainer() as unknown as MedusaContainer
    container.register({
      [ContainerRegistrationKeys.QUERY]: asValue({ graph }),
      [ContainerRegistrationKeys.REMOTE_QUERY]: asValue(remoteQuery),
      [Modules.FULFILLMENT]: asValue({ calculateShippingOptionsPrices }),
    })
    await registerWorkflowEngine(
      container,
      listShippingOptionsForCartWithPricingWorkflow
    )
  })

  it("should map each fulfillment set to its stock location without the location's fulfillment sets", async () => {
    const { result } = await listShippingOptionsForCartWithPricingWorkflow(
      container
    ).run({ input: { cart_id: "cart_1" } })

    expect(result).toEqual([
      expect.objectContaining({
        id: "so_flat",
        amount: 10,
        stock_location: expectedLocation,
      }),
      expect.objectContaining({
        id: "so_calculated",
        amount: 20,
        stock_location: expectedLocation,
      }),
    ])

    expect(calculateShippingOptionsPrices).toHaveBeenCalledWith([
      expect.objectContaining({
        id: "so_calculated",
        context: expect.objectContaining({ from_location: expectedLocation }),
      }),
    ])
  })
})
