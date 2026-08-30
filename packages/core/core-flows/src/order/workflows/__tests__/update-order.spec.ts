import { MedusaContainer } from "@medusajs/framework"
import { createContainer } from "@medusajs/framework/awilix"
import { MedusaError } from "@medusajs/framework/utils"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { updateOrderValidationStep } from "../update-order"

const runStep = async (
  container: MedusaContainer,
  input: any
): Promise<any> => {
  const workflow = createWorkflow(
    `update-order-val-test-${Math.random().toString(36).slice(2)}`,
    (wfInput: any) => {
      const out = updateOrderValidationStep(wfInput)
      return new WorkflowResponse(out)
    }
  )
  return workflow(container).run({ input })
}

describe("updateOrderValidationStep", () => {
  const container = createContainer() as unknown as MedusaContainer

  const baseOrder = {
    id: "order_1",
    status: "pending",
  } as any

  it("should allow adding a shipping address when order has none", async () => {
    const order = {
      ...baseOrder,
      shipping_address: undefined,
    }

    const input = {
      id: "order_1",
      user_id: "user_1",
      shipping_address: {
        address_1: "Example 1",
        city: "Warszawa",
        postal_code: "00-001",
        country_code: "pl",
      },
    }

    await expect(runStep(container, { order, input })).resolves.not.toThrow()
  })

  it("should allow adding a billing address when order has none", async () => {
    const order = {
      ...baseOrder,
      billing_address: undefined,
    }

    const input = {
      id: "order_1",
      user_id: "user_1",
      billing_address: {
        address_1: "Example 1",
        city: "Warszawa",
        postal_code: "00-001",
        country_code: "pl",
      },
    }

    await expect(runStep(container, { order, input })).resolves.not.toThrow()
  })

  it("should allow updating shipping address with the same country code", async () => {
    const order = {
      ...baseOrder,
      shipping_address: {
        id: "addr_1",
        country_code: "us",
      },
    }

    const input = {
      id: "order_1",
      user_id: "user_1",
      shipping_address: {
        address_1: "New street",
        country_code: "us",
      },
    }

    await expect(runStep(container, { order, input })).resolves.not.toThrow()
  })

  it("should throw when attempting to change shipping address country code", async () => {
    const order = {
      ...baseOrder,
      shipping_address: {
        id: "addr_1",
        country_code: "us",
      },
    }

    const input = {
      id: "order_1",
      user_id: "user_1",
      shipping_address: {
        country_code: "de",
      },
    }

    let error: any
    try {
      await runStep(container, { order, input })
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
    expect(error.message).toContain("Country code cannot be changed")
  })

  it("should throw when attempting to change billing address country code", async () => {
    const order = {
      ...baseOrder,
      billing_address: {
        id: "addr_2",
        country_code: "us",
      },
    }

    const input = {
      id: "order_1",
      user_id: "user_1",
      billing_address: {
        country_code: "de",
      },
    }

    let error: any
    try {
      await runStep(container, { order, input })
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
    expect(error.message).toContain("Country code cannot be changed")
  })
})
