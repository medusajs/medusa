import { MedusaError } from "@medusajs/framework/utils"
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { updateOrderValidationStep } from "../update-order"

const runValidationStep = async (order: any, input: any) => {
  const workflow = createWorkflow(
    `update-order-validation-test-${Math.random().toString(36).slice(2)}`,
    (wfInput: any) => {
      updateOrderValidationStep(wfInput)
      return new WorkflowResponse({})
    }
  )

  return workflow().run({ input: { order, input } })
}

describe("updateOrderValidationStep", () => {
  it("should not throw when adding shipping address to order with no existing shipping address", async () => {
    const order: any = {
      id: "order_1",
      shipping_address: undefined,
      billing_address: undefined,
    }

    const input: any = {
      id: "order_1",
      shipping_address: {
        address_1: "Main St 123",
        city: "Warsaw",
        postal_code: "00-001",
        country_code: "pl",
      },
    }

    await expect(
      runValidationStep(order, input)
    ).resolves.not.toThrow()
  })

  it("should throw when trying to change an existing country_code to a different country_code", async () => {
    const order: any = {
      id: "order_1",
      shipping_address: {
        country_code: "us",
      },
    }

    const input: any = {
      id: "order_1",
      shipping_address: {
        country_code: "ca",
      },
    }

    await expect(
      runValidationStep(order, input)
    ).rejects.toEqual(
      expect.objectContaining({
        type: MedusaError.Types.INVALID_DATA,
        message: "Country code cannot be changed",
      })
    )
  })

  it("should not throw when updating address without changing country_code", async () => {
    const order: any = {
      id: "order_1",
      shipping_address: {
        country_code: "us",
        city: "Old City",
      },
    }

    const input: any = {
      id: "order_1",
      shipping_address: {
        country_code: "us",
        city: "New City",
      },
    }

    await expect(
      runValidationStep(order, input)
    ).resolves.not.toThrow()
  })
})