import { MedusaError } from "@medusajs/framework/utils"
import { updateOrderValidationStep } from "../update-order"

describe("updateOrderValidationStep", () => {
  it("should not throw when adding shipping address to order with no existing shipping address", async () => {
    const step = (updateOrderValidationStep as any).step
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
      (updateOrderValidationStep as any)({ order, input })
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
      (updateOrderValidationStep as any)({ order, input })
    ).rejects.toThrow(
      new MedusaError(MedusaError.Types.INVALID_DATA, "Country code cannot be changed")
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
      (updateOrderValidationStep as any)({ order, input })
    ).resolves.not.toThrow()
  })
})
