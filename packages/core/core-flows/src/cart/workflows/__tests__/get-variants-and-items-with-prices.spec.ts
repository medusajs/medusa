import { createContainer } from "@medusajs/framework/awilix"
import { MedusaError, ProductStatus } from "@medusajs/framework/utils"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { prepareVariantsAndItemsWithPricesStep } from "../get-variants-and-items-with-prices"

describe("prepareVariantsAndItemsWithPricesStep", () => {
  it("throws an invalid data error when a variant does not have a price", async () => {
    const workflow = createWorkflow(
      "test-prepare-variant-without-price",
      () => {
        const result = prepareVariantsAndItemsWithPricesStep({
          cart: { id: "cart_1" },
          items: [{ variant_id: "variant_1", quantity: 1 }],
          variantsData: [
            {
              id: "variant_1",
              product: {
                id: "product_1",
                status: ProductStatus.PUBLISHED,
              },
              inventory_items: [],
            },
          ],
          calculatedPriceSets: {},
        })

        return new WorkflowResponse(result)
      }
    )

    const execution = workflow(createContainer()).run()

    await expect(execution).rejects.toMatchObject({
      type: MedusaError.Types.INVALID_DATA,
      message: "Variants with IDs variant_1 do not have a price",
    })
  })
})
