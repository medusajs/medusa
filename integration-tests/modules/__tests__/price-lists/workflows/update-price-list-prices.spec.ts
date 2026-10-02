import { updatePriceListPricesWorkflow } from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  IPricingModuleService,
  IProductModuleService,
  MedusaContainer,
} from "@medusajs/types"
import { Modules, PriceListStatus, PriceListType } from "@medusajs/utils"
import { createVariantPriceSet } from "../../../helpers/create-variant-price-set"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ getContainer }) => {
    describe("update price list prices workflow", () => {
      let container: MedusaContainer
      let pricingModule: IPricingModuleService
      let productModule: IProductModuleService

      beforeAll(() => {
        container = getContainer()
        pricingModule = container.resolve(Modules.PRICING)
        productModule = container.resolve(Modules.PRODUCT)
      })

      it("should restore the updated prices when a later step fails", async () => {
        const [product] = await productModule.createProducts([
          {
            title: "test product",
            variants: [{ title: "test product variant" }],
          },
        ])
        const variant = product.variants[0]

        const priceSet = await createVariantPriceSet({
          container,
          variantId: variant.id,
        })

        const [priceList] = await pricingModule.createPriceLists([
          {
            title: "test price list",
            description: "test",
            status: PriceListStatus.ACTIVE,
            type: PriceListType.SALE,
            prices: [
              {
                amount: 380,
                currency_code: "usd",
                price_set_id: priceSet.id,
              },
            ],
          },
        ])

        const [price] = await pricingModule.listPrices({
          price_list_id: [priceList.id],
        })

        const workflow = updatePriceListPricesWorkflow(container)
        workflow.appendAction("throw", "update-price-list-prices", {
          invoke: async function failStep() {
            throw new Error("Failed to update price list prices")
          },
        })

        const { errors } = await workflow.run({
          input: {
            data: [
              {
                id: priceList.id,
                prices: [
                  {
                    id: price.id,
                    amount: 395,
                    currency_code: "usd",
                    variant_id: variant.id,
                  },
                ],
              },
            ],
          },
          throwOnError: false,
        })

        expect(errors).toEqual([
          expect.objectContaining({
            error: expect.objectContaining({
              message: "Failed to update price list prices",
            }),
          }),
        ])

        const [restoredPrice] = await pricingModule.listPrices({
          id: [price.id],
        })

        expect(restoredPrice).toEqual(
          expect.objectContaining({
            id: price.id,
            amount: 380,
            price_set_id: priceSet.id,
          })
        )
      })
    })
  },
})
