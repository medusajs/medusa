import {
  CreateCart,
  StoreAddCartLineItem,
  StoreUpdateCartLineItem,
} from "../validators"

const FRACTIONAL_QUANTITIES = [0.1, 0.5, 1.2, 1.5, 2.7]

describe("Store cart line item quantity validators", () => {
  describe("CreateCart items", () => {
    const parse = (quantity: number) =>
      CreateCart.safeParse({ items: [{ variant_id: "variant_1", quantity }] })

    it.each([1, 2])("accepts integer quantity %s", (quantity) => {
      expect(parse(quantity).success).toBe(true)
    })

    it.each([...FRACTIONAL_QUANTITIES, 0, -1])(
      "rejects quantity %s",
      (quantity) => {
        expect(parse(quantity).success).toBe(false)
      }
    )
  })

  describe("StoreAddCartLineItem", () => {
    const parse = (quantity: number) =>
      StoreAddCartLineItem.safeParse({ variant_id: "variant_1", quantity })

    it.each([1, 2])("accepts integer quantity %s", (quantity) => {
      expect(parse(quantity).success).toBe(true)
    })

    it.each([...FRACTIONAL_QUANTITIES, 0, -1])(
      "rejects quantity %s",
      (quantity) => {
        expect(parse(quantity).success).toBe(false)
      }
    )
  })

  describe("StoreUpdateCartLineItem", () => {
    const parse = (quantity: number) =>
      StoreUpdateCartLineItem.safeParse({ quantity })

    // 0 removes the item from the cart
    it.each([0, 1, 2])("accepts integer quantity %s", (quantity) => {
      expect(parse(quantity).success).toBe(true)
    })

    it.each([...FRACTIONAL_QUANTITIES, 0.4, -1])(
      "rejects quantity %s",
      (quantity) => {
        expect(parse(quantity).success).toBe(false)
      }
    )
  })
})
