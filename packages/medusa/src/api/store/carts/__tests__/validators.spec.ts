import {
  CreateCart,
  StoreAddCartLineItem,
  StoreUpdateCartLineItem,
} from "../validators"

describe("cart line item quantity validators", () => {
  it.each([
    [
      "create cart items",
      (quantity: number) =>
        CreateCart.safeParse({
          items: [{ variant_id: "variant_1", quantity }],
        }),
    ],
    [
      "add line item",
      (quantity: number) =>
        StoreAddCartLineItem.safeParse({ variant_id: "variant_1", quantity }),
    ],
    [
      "update line item",
      (quantity: number) => StoreUpdateCartLineItem.safeParse({ quantity }),
    ],
  ])("rejects fractional quantities for %s", (_name, parse) => {
    expect(parse(0.1).success).toBe(false)
    expect(parse(1.5).success).toBe(false)
  })

  it.each([0, 1, 2])("accepts integer quantity %s", (quantity) => {
    expect(
      StoreAddCartLineItem.safeParse({ variant_id: "variant_1", quantity })
        .success
    ).toBe(quantity > 0)
    expect(StoreUpdateCartLineItem.safeParse({ quantity }).success).toBe(true)
  })
})
