import { MedusaError } from "@medusajs/framework/utils"
import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import { validateCartItemsStep } from "../validate-cart-items"

describe("validateCartItemsStep", () => {
  const testWorkflow = createWorkflow(
    "test-validate-cart-items",
    (input: WorkflowData<{ cart: any }>) => {
      validateCartItemsStep({ cart: input.cart })
      return new WorkflowResponse(void 0)
    }
  )

  it("should throw INVALID_DATA when cart has empty items array", async () => {
    const { errors } = await testWorkflow({} as any).run({
      input: { cart: { items: [] } },
      throwOnError: false,
    })

    expect(errors).toHaveLength(1)
    expect(errors[0].error.message).toEqual(
      "Cannot complete a cart with no items"
    )
  })

  it("should throw when cart.items is undefined", async () => {
    const { errors } = await testWorkflow({} as any).run({
      input: { cart: {} },
      throwOnError: false,
    })

    expect(errors).toHaveLength(1)
    expect(errors[0].error.message).toEqual(
      "Cannot complete a cart with no items"
    )
  })

  it("should not throw when cart has items", async () => {
    const { errors } = await testWorkflow({} as any).run({
      input: {
        cart: {
          items: [{ id: "item_1", variant_id: "var_1", quantity: 1 }],
        },
      },
      throwOnError: false,
    })

    expect(errors).toHaveLength(0)
  })
})
