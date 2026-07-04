import { MedusaContainer } from "@medusajs/framework/types"
import { createContainer } from "@medusajs/framework/awilix"
import { MedusaError } from "@medusajs/framework/utils"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { prepareVariantsAndItemsWithPricesStep } from "../get-variants-and-items-with-prices"

describe("prepareVariantsAndItemsWithPricesStep", () => {
  let container: MedusaContainer

  beforeAll(() => {
    container = createContainer() as unknown as MedusaContainer
  })

  const runStep = (input: {
    cart: any
    items: any[]
    variantsData: any[]
    calculatedPriceSets: Record<string, any>
  }) => {
    const workflow = createWorkflow(
      "prepareVariantsAndItemsWithPricesStepTest",
      (workflowInput: typeof input) => {
        return new WorkflowResponse(
          prepareVariantsAndItemsWithPricesStep(workflowInput)
        )
      }
    )

    return workflow(container).run({ input })
  }

  const publishedVariant = {
    id: "variant_1",
    product: { status: "published" },
  }

  it("throws a MedusaError instead of a raw TypeError when a variant has no calculated price for the cart's region/currency", async () => {
    const input = {
      cart: { id: "cart_1" },
      items: [{ id: "item_1", variant_id: "variant_1", quantity: 1 }],
      variantsData: [publishedVariant],
      // the pricing module didn't return a calculated price set for "item_1" /
      // "variant_1", e.g. because the variant has no price in the cart's currency
      calculatedPriceSets: {},
    }

    let thrownError: any
    try {
      await runStep(input)
    } catch (e) {
      thrownError = e
    }

    expect(MedusaError.isMedusaError(thrownError)).toBe(true)
    expect(thrownError.message).toEqual(
      "Variants with IDs variant_1 do not have a price"
    )
  })

  it("prepares the line item using the calculated price when one is found", async () => {
    const input = {
      cart: { id: "cart_1" },
      items: [{ id: "item_1", variant_id: "variant_1", quantity: 1 }],
      variantsData: [publishedVariant],
      calculatedPriceSets: {
        item_1: {
          calculated_amount: 1000,
          is_calculated_price_tax_inclusive: false,
        },
      },
    }

    const { result } = await runStep(input)

    expect(result.lineItems[0].data.unit_price).toEqual(1000)
    expect(result.lineItems[0].data.is_tax_inclusive).toEqual(false)
  })
})
