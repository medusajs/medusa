import {
  CreateCart,
  StoreAddCartLineItem,
  StoreUpdateCartLineItem,
} from "../validators"

describe("store cart validators", () => {
  it.each([
    [
      "cart item",
      CreateCart,
      {
        items: [
          {
            variant_id: "variant_123",
            quantity: 0.1,
          },
        ],
      },
    ],
    [
      "line item add",
      StoreAddCartLineItem,
      {
        variant_id: "variant_123",
        quantity: 1.5,
      },
    ],
    [
      "line item update",
      StoreUpdateCartLineItem,
      {
        quantity: 2.7,
      },
    ],
  ])("rejects fractional quantity for %s", (_, validator, payload) => {
    expect(validator.safeParse(payload).success).toBe(false)
  })

  it("allows zero quantity when updating a line item", () => {
    expect(
      StoreUpdateCartLineItem.safeParse({
        quantity: 0,
      }).success
    ).toBe(true)
  })
})
