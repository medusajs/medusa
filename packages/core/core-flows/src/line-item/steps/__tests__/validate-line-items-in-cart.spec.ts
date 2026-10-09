import type { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { Modules } from "@medusajs/framework/utils"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { validateLineItemsInCartStep } from "../validate-line-items-in-cart"

const buildContainer = (
  listLineItemsMock: (filters: any) => Promise<any[]>
): { container: MedusaContainer; calls: Record<string, any[]> } => {
  const calls: Record<string, any[]> = {
    listLineItems: [],
  }
  const container = createContainer() as unknown as MedusaContainer
  container.register(
    Modules.CART,
    asFunction(() => ({
      listLineItems: async (filters: any) => {
        calls.listLineItems.push(filters)
        return listLineItemsMock(filters)
      },
    }))
  )
  return { container, calls }
}

const runStep = async (
  container: MedusaContainer,
  input: { cart_id: string; ids: string[] }
): Promise<any> => {
  const workflow = createWorkflow(
    `validate-line-items-in-cart-test-${Math.random().toString(36).slice(2)}`,
    () => {
      const out = validateLineItemsInCartStep(input)
      return new WorkflowResponse(out)
    }
  )
  return workflow(container).run({ input: {} })
}

describe("validateLineItemsInCartStep", () => {
  it("passes when every line item belongs to the cart", async () => {
    const { container, calls } = buildContainer(async () => [
      { id: "li_1" },
      { id: "li_2" },
    ])

    await runStep(container, { cart_id: "cart_1", ids: ["li_1", "li_2"] })

    expect(calls.listLineItems).toEqual([
      { id: ["li_1", "li_2"], cart_id: "cart_1" },
    ])
  })

  it("throws NOT_FOUND when a line item belongs to another cart", async () => {
    // line item from another cart is filtered out by the cart_id filter
    const { container } = buildContainer(async () => [])

    const error = await runStep(container, {
      cart_id: "cart_A",
      ids: ["li_B"],
    }).catch((e: any) => e)

    expect(error.type).toEqual("not_found")
    expect(error.message).toContain("li_B")
  })

  it("throws NOT_FOUND when only some line items belong to the cart", async () => {
    const { container } = buildContainer(async () => [{ id: "li_1" }])

    const error = await runStep(container, {
      cart_id: "cart_1",
      ids: ["li_1", "li_missing"],
    }).catch((e: any) => e)

    expect(error.type).toEqual("not_found")
    expect(error.message).toContain("li_missing")
  })

  it("passes when the same id is requested more than once", async () => {
    const { container, calls } = buildContainer(async () => [{ id: "li_1" }])

    await runStep(container, { cart_id: "cart_1", ids: ["li_1", "li_1"] })

    expect(calls.listLineItems).toEqual([{ id: ["li_1"], cart_id: "cart_1" }])
  })
})
