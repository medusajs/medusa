import { MedusaContainer } from "@medusajs/framework"
import { createContainer } from "@medusajs/framework/awilix"
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"
import { updateOrderValidationStep } from "../update-order"

const container = createContainer() as unknown as MedusaContainer

const runValidation = async (input: any) => {
  const workflow = createWorkflow(
    `update-order-validation-test-${Math.random().toString(36).slice(2)}`,
    (workflowInput: any) => {
      const result = updateOrderValidationStep(workflowInput)
      return new WorkflowResponse(result)
    }
  )

  return workflow(container).run({ input, throwOnError: false })
}

describe("updateOrderValidationStep", () => {
  it.each(["shipping_address", "billing_address"])(
    "allows adding a country code when the order has no %s",
    async (addressField) => {
      const result = await runValidation({
        order: {
          id: "order_123",
          status: "pending",
          [addressField]: null,
        },
        input: {
          id: "order_123",
          user_id: "user_123",
          [addressField]: { country_code: "pl" },
        },
      })

      expect(result.errors).toHaveLength(0)
    }
  )

  it.each(["shipping_address", "billing_address"])(
    "rejects changing the country code on an existing %s",
    async (addressField) => {
      const result = await runValidation({
        order: {
          id: "order_123",
          status: "pending",
          [addressField]: { country_code: "us" },
        },
        input: {
          id: "order_123",
          user_id: "user_123",
          [addressField]: { country_code: "pl" },
        },
      })

      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].error.message).toBe(
        "Country code cannot be changed"
      )
    }
  )
})
