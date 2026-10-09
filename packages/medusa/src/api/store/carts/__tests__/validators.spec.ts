import {
  CreateCart,
  StoreAddCartLineItem,
  StoreUpdateCartLineItem,
} from "../validators"

describe("StoreAddCartLineItem", () => {
  it.each([0.1, 0.5, 1.2, 1.5, 2.7])(
    "rejects fractional quantity %s",
    (quantity) => {
      expect(
        StoreAddCartLineItem.safeParse({ variant_id: "variant_1", quantity })
          .success
      ).toBe(false)
    }
  )

  it.each([1, 2, 100])("accepts integer quantity %s", (quantity) => {
    expect(
      StoreAddCartLineItem.safeParse({ variant_id: "variant_1", quantity })
        .success
    ).toBe(true)
  })

  it.each([0, -1])("rejects non-positive quantity %s", (quantity) => {
    expect(
      StoreAddCartLineItem.safeParse({ variant_id: "variant_1", quantity })
        .success
    ).toBe(false)
  })

  it("rejects a non-numeric quantity", () => {
    expect(
      StoreAddCartLineItem.safeParse({
        variant_id: "variant_1",
        quantity: "3",
      }).success
    ).toBe(false)
  })
})

describe("StoreUpdateCartLineItem", () => {
  it("still allows 0 so the item can be removed", () => {
    expect(StoreUpdateCartLineItem.safeParse({ quantity: 0 }).success).toBe(
      true
    )
  })

  it.each([0.5, 1.5])("rejects fractional quantity %s", (quantity) => {
    expect(StoreUpdateCartLineItem.safeParse({ quantity }).success).toBe(false)
  })

  it.each([1, 3])("accepts integer quantity %s", (quantity) => {
    expect(StoreUpdateCartLineItem.safeParse({ quantity }).success).toBe(true)
  })
})

describe("CreateCart items", () => {
  it("rejects fractional item quantities", () => {
    expect(
      CreateCart.safeParse({
        items: [{ variant_id: "variant_1", quantity: 0.5 }],
      }).success
    ).toBe(false)
  })

  it("accepts integer item quantities", () => {
    expect(
      CreateCart.safeParse({
        items: [{ variant_id: "variant_1", quantity: 2 }],
      }).success
    ).toBe(true)
  })
})
