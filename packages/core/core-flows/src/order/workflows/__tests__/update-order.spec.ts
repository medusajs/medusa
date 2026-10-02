import { MedusaContainer } from "@medusajs/framework"
import { createContainer } from "@medusajs/framework/awilix"
import { OrderDTO, OrderWorkflow } from "@medusajs/framework/types"
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"
import { updateOrderValidationStep } from "../update-order"

const runValidation = async (
  order: Partial<OrderDTO>,
  input: Partial<OrderWorkflow.UpdateOrderWorkflowInput>
): Promise<Error | undefined> => {
  const container = createContainer() as unknown as MedusaContainer

  const workflow = createWorkflow(
    `update-order-validation-test-${Math.random().toString(36).slice(2)}`,
    () => {
      const out = updateOrderValidationStep({ order, input } as any)
      return new WorkflowResponse(out)
    }
  )

  try {
    await workflow(container).run({ input: {} })
    return undefined
  } catch (error: any) {
    return error
  }
}

describe("updateOrderValidationStep", () => {
  it("throws when the shipping address country code is changed", async () => {
    const order = {
      status: "pending",
      shipping_address: { country_code: "us" },
    } as Partial<OrderDTO>
    const input = {
      shipping_address: { country_code: "ca" },
    } as Partial<OrderWorkflow.UpdateOrderWorkflowInput>

    const error = await runValidation(order, input)
    expect(error?.message).toBe("Country code cannot be changed")
  })

  it("throws when the billing address country code is changed", async () => {
    const order = {
      status: "pending",
      billing_address: { country_code: "us" },
    } as Partial<OrderDTO>
    const input = {
      billing_address: { country_code: "ca" },
    } as Partial<OrderWorkflow.UpdateOrderWorkflowInput>

    const error = await runValidation(order, input)
    expect(error?.message).toBe("Country code cannot be changed")
  })

  it("does not throw when adding a shipping address to an order that has none", async () => {
    const order = {
      status: "pending",
      shipping_address: undefined,
    } as Partial<OrderDTO>
    const input = {
      shipping_address: { country_code: "ca" },
    } as Partial<OrderWorkflow.UpdateOrderWorkflowInput>

    const error = await runValidation(order, input)
    expect(error).toBeUndefined()
  })

  it("does not throw when adding a billing address to an order that has none", async () => {
    const order = {
      status: "pending",
      billing_address: undefined,
    } as Partial<OrderDTO>
    const input = {
      billing_address: { country_code: "ca" },
    } as Partial<OrderWorkflow.UpdateOrderWorkflowInput>

    const error = await runValidation(order, input)
    expect(error).toBeUndefined()
  })
})
