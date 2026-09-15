import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { Modules, PriceListStatus } from "@medusajs/framework/utils"
import { createWorkflow } from "@medusajs/workflows-sdk"
import { createPriceListsStep } from "../create-price-lists"
import { updatePriceListsStep } from "../update-price-lists"

describe("price list rule attributes", () => {
  let container!: MedusaContainer
  let createPriceLists!: jest.Mock
  let updatePriceLists!: jest.Mock

  beforeEach(() => {
    createPriceLists = jest.fn(async () => [{ id: "plist_1" }])
    updatePriceLists = jest.fn(async () => [{ id: "plist_1" }])

    container = createContainer() as unknown as MedusaContainer
    container.register(
      Modules.PRICING,
      asFunction(() => {
        return {
          createPriceLists,
          updatePriceLists,
          listPriceLists: async () => [],
        } as any
      })
    )
  })

  it("should create the customer group rule with the attribute the pricing context is flattened into", async () => {
    const workflow = createWorkflow("createPriceListsStepTest", () => {
      createPriceListsStep({
        data: [
          {
            title: "Wholesale",
            description: "Wholesale",
            status: PriceListStatus.ACTIVE,
            rules: { customer_group_id: ["cusgroup_1"] },
          },
        ],
        variant_price_map: {},
      })
    })

    await workflow(container).run()

    expect(createPriceLists).toHaveBeenCalledWith([
      expect.objectContaining({
        rules: { "customer.groups.id": ["cusgroup_1"] },
      }),
    ])
  })

  it("should update the customer group rule with the attribute the pricing context is flattened into", async () => {
    const workflow = createWorkflow("updatePriceListsStepTest", () => {
      updatePriceListsStep([
        {
          id: "plist_1",
          rules: { customer_group_id: ["cusgroup_1"] },
        },
      ])
    })

    await workflow(container).run()

    expect(updatePriceLists).toHaveBeenCalledWith([
      expect.objectContaining({
        rules: { "customer.groups.id": ["cusgroup_1"] },
      }),
    ])
  })

  it("should leave rules that already use current attributes untouched", async () => {
    const workflow = createWorkflow(
      "createPriceListsStepPassThroughTest",
      () => {
        createPriceListsStep({
          data: [
            {
              title: "Wholesale",
              description: "Wholesale",
              status: PriceListStatus.ACTIVE,
              rules: { "customer.groups.id": ["cusgroup_1"] },
            },
          ],
          variant_price_map: {},
        })
      }
    )

    await workflow(container).run()

    expect(createPriceLists).toHaveBeenCalledWith([
      expect.objectContaining({
        rules: { "customer.groups.id": ["cusgroup_1"] },
      }),
    ])
  })
})
