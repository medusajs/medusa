import {
  prepareShippingMethod,
  prepareShippingMethodUpdate,
} from "../prepare-shipping-method"

describe("prepareShippingMethod", () => {
  const baseData = {
    orderChange: { version: 1 },
    relatedEntity: { order_id: "order_123" },
    input: {},
  }

  it("uses the calculated amount when the shipping option has a price", () => {
    const result = prepareShippingMethod()({
      ...baseData,
      customPrice: undefined,
      shippingOptions: [
        {
          id: "so_1",
          name: "Standard",
          calculated_price: {
            calculated_amount: 10,
            is_calculated_price_tax_inclusive: false,
          },
        },
      ],
    })

    expect(result).toEqual(
      expect.objectContaining({
        shipping_option_id: "so_1",
        amount: 10,
        is_custom_amount: false,
      })
    )
  })

  it("uses the custom price for a calculated option without a price", () => {
    const result = prepareShippingMethod()({
      ...baseData,
      customPrice: 25,
      shippingOptions: [{ id: "so_1", name: "Calculated" }],
    })

    expect(result).toEqual(
      expect.objectContaining({
        shipping_option_id: "so_1",
        amount: 25,
        is_custom_amount: true,
      })
    )
  })

  it("throws an INVALID_DATA error instead of crashing when a calculated option has no price and no custom amount", () => {
    expect(() =>
      prepareShippingMethod()({
        ...baseData,
        customPrice: undefined,
        shippingOptions: [{ id: "so_1", name: "Calculated" }],
      })
    ).toThrow(
      'Shipping option "Calculated" does not have a price for the provided context. Calculated shipping options must be added with a custom amount.'
    )
  })
})

describe("prepareShippingMethodUpdate", () => {
  const baseInput = {
    action_id: "action_1",
    data: {},
  }
  const orderChange = {
    actions: [{ id: "action_1", reference_id: "sm_1" }],
  }

  it("uses the calculated amount when the shipping option has a price", () => {
    const { action, shippingMethod } = prepareShippingMethodUpdate({
      input: baseInput,
      orderChange,
      shippingOptions: [
        { id: "so_1", name: "Standard", calculated_price: { calculated_amount: 10 } },
      ],
    })

    expect(action.amount).toEqual(10)
    expect(shippingMethod.amount).toEqual(10)
    expect(shippingMethod.is_custom_amount).toBe(false)
  })

  it("uses the custom amount when no shipping options are provided", () => {
    const { action, shippingMethod } = prepareShippingMethodUpdate({
      input: { ...baseInput, data: { custom_amount: 15 } },
      orderChange,
      shippingOptions: undefined,
    })

    expect(action.amount).toEqual(15)
    expect(shippingMethod.amount).toEqual(15)
    expect(shippingMethod.is_custom_amount).toBe(true)
  })

  it("throws an INVALID_DATA error instead of crashing when a calculated option has no price", () => {
    expect(() =>
      prepareShippingMethodUpdate({
        input: baseInput,
        orderChange,
        shippingOptions: [{ id: "so_1", name: "Calculated" }],
      })
    ).toThrow(
      'Shipping option "Calculated" does not have a price for the provided context. Calculated shipping options must be added with a custom amount.'
    )
  })
})
