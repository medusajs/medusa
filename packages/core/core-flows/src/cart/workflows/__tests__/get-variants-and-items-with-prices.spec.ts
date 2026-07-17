import { MedusaError } from "@medusajs/framework/utils"
import {
  StepResponse,
  WorkflowResponse,
  createStep,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { prepareVariantsAndItemsWithPricesStep } from "../get-variants-and-items-with-prices"

describe("prepareVariantsAndItemsWithPricesStep", function () {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should throw a MedusaError (INVALID_DATA) when a variant has no calculated price set instead of a TypeError", async () => {
    const cart = {
      id: "cart_123",
      region_id: "region_123",
      currency_code: "usd",
    }

    const items = [
      {
        variant_id: "variant_456",
        quantity: 1,
      },
    ]

    const variantsData = [
      {
        id: "variant_456",
        title: "Test Variant",
        product: {
          id: "product_789",
          status: "published",
          title: "Test Product",
        },
      },
    ]

    const calculatedPriceSets = {} // No prices found — the bug scenario

    const workflow = createWorkflow(
      "test-variant-no-price",
      function (input: {
        cart: any
        items: any[]
        variantsData: any[]
        calculatedPriceSets: Record<string, any>
      }) {
        const result = prepareVariantsAndItemsWithPricesStep(input)
        return new WorkflowResponse(result)
      }
    )

    const { errors } = await workflow().run({
      input: {
        cart,
        items,
        variantsData,
        calculatedPriceSets,
      },
      throwOnError: false,
    })

    expect(errors).toHaveLength(1)
    expect(MedusaError.isMedusaError(errors[0].error)).toBe(true)
    expect(errors[0].error.type).toEqual(MedusaError.Types.INVALID_DATA)
    expect(errors[0].error.message).toContain("do not have a price")
  })

  it("should succeed when a variant has a valid calculated price set", async () => {
    const cart = {
      id: "cart_123",
      region_id: "region_123",
      currency_code: "usd",
    }

    const items = [
      {
        id: "item_1",
        variant_id: "variant_456",
        quantity: 1,
      },
    ]

    const variantsData = [
      {
        id: "variant_456",
        title: "Test Variant",
        product: {
          id: "product_789",
          status: "published",
          title: "Test Product",
        },
      },
    ]

    const calculatedPriceSets = {
      item_1: {
        calculated_amount: 1000,
        is_calculated_price_tax_inclusive: false,
        original_amount: 1000,
        calculated_price: {
          price_list_type: "sale",
        },
      },
    }

    const workflow = createWorkflow(
      "test-variant-with-price",
      function (input: {
        cart: any
        items: any[]
        variantsData: any[]
        calculatedPriceSets: Record<string, any>
      }) {
        const result = prepareVariantsAndItemsWithPricesStep(input)
        return new WorkflowResponse(result)
      }
    )

    const { result, errors } = await workflow().run({
      input: {
        cart,
        items,
        variantsData,
        calculatedPriceSets,
      },
      throwOnError: false,
    })

    expect(errors).toHaveLength(0)
    expect(result).toBeDefined()
  })
})
