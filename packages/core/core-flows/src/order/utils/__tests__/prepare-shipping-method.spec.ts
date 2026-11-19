import { prepareShippingMethod } from "../prepare-shipping-method"

describe("prepareShippingMethod", () => {
  const baseData = {
    shippingOptions: [
      {
        id: "so_123",
        name: "Standard",
        data: {},
        calculated_price: {
          calculated_amount: 10,
          is_calculated_price_tax_inclusive: false,
        },
      },
    ],
    orderChange: { version: 2 },
    relatedEntity: { order_id: "order_123" },
  }

  it("should include the input metadata and description in the shipping method", () => {
    const result = prepareShippingMethod()({
      ...baseData,
      input: {
        shipping_option_id: "so_123",
        description: "Leave at the door",
        metadata: { delivery_option: "pickup" },
      },
    })

    expect(result).toEqual(
      expect.objectContaining({
        shipping_option_id: "so_123",
        amount: 10,
        description: "Leave at the door",
        metadata: { delivery_option: "pickup" },
      })
    )
  })

  it("should include the input metadata and description for a related entity", () => {
    const result = prepareShippingMethod("return_id")({
      ...baseData,
      relatedEntity: { id: "return_123", order_id: "order_123" },
      input: {
        return_id: "return_123",
        shipping_option_id: "so_123",
        description: "Return label",
        metadata: { carrier: "ups" },
      },
    })

    expect(result).toEqual(
      expect.objectContaining({
        return_id: "return_123",
        description: "Return label",
        metadata: { carrier: "ups" },
      })
    )
  })
})
