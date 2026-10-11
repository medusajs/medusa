import { MedusaContainer } from "@medusajs/framework"
import { asValue, createContainer } from "@medusajs/framework/awilix"
import { Modules } from "@medusajs/framework/utils"
import { createStep, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { updatePriceSetsStep } from "../update-price-sets"

const priceSet = {
  id: "pset_1",
  prices: [
    {
      id: "price_1",
      amount: 10,
      currency_code: "eur",
      price_set_id: "pset_1",
      price_rules: [],
    },
  ],
}

describe("updatePriceSetsStep", () => {
  let container!: MedusaContainer
  let listPriceSets: jest.Mock
  let upsertPriceSets: jest.Mock

  beforeEach(() => {
    listPriceSets = jest.fn(
      async (_filters: unknown, config?: { relations?: string[] }) => {
        const { prices, ...priceSetWithoutPrices } = priceSet

        return [
          config?.relations?.includes("prices")
            ? { ...priceSetWithoutPrices, prices }
            : priceSetWithoutPrices,
        ]
      }
    )
    upsertPriceSets = jest.fn(async (data: unknown) => data)

    container = createContainer() as unknown as MedusaContainer
    container.register(
      Modules.PRICING,
      asValue({ listPriceSets, upsertPriceSets })
    )
  })

  it("should restore the previous prices of the price sets when compensating", async () => {
    const failingStep = createStep("failing-step", async () => {
      throw new Error("fail")
    })

    const workflow = createWorkflow("updatePriceSetsStepTest", () => {
      updatePriceSetsStep({
        price_sets: [
          {
            id: "pset_1",
            prices: [{ amount: 99, currency_code: "eur" }],
          },
        ],
      })

      failingStep()
    })

    const { errors } = await workflow(container).run({
      throwOnError: false,
    })

    expect(errors).toHaveLength(1)
    expect(errors[0].error.message).toEqual("fail")

    expect(upsertPriceSets).toHaveBeenCalledTimes(2)
    expect(upsertPriceSets).toHaveBeenNthCalledWith(1, [
      {
        id: "pset_1",
        prices: [{ amount: 99, currency_code: "eur" }],
      },
    ])
    expect(upsertPriceSets).toHaveBeenNthCalledWith(2, [
      expect.objectContaining({
        id: "pset_1",
        prices: [
          expect.objectContaining({
            id: "price_1",
            amount: 10,
            currency_code: "eur",
          }),
        ],
      }),
    ])
  })
})
