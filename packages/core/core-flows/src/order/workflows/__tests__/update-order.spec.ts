import { updateOrderValidationStep } from "../update-order"

describe("updateOrderValidationStep - country code validation", () => {
  it("allows adding address with country code when order has no existing country code", async () => {
    const order: any = {
      id: "order_123",
      shipping_address: null,
      billing_address: undefined,
    }
    const input: any = {
      id: "order_123",
      shipping_address: { country_code: "us" },
      billing_address: { country_code: "ca" },
    }

    // Step should execute without throwing "Country code cannot be changed"
    await expect(
      (updateOrderValidationStep as any)._invoke({ order, input }, {})
    ).resolves.not.toThrow()
  })
})
