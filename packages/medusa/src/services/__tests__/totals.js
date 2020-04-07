import TotalsService from "../totals"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"
import { discounts } from "../../models/__mocks__/discount"
import { carts } from "../__mocks__/cart"
import { IdMap } from "medusa-test-utils"

describe("TotalsService", () => {
  describe("getAllocationItemDiscounts", () => {
    let res
    const totalsService = new TotalsService({
      productVariantService: ProductVariantServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calculates item with percentage discount", async () => {
      res = await totalsService.getAllocationItemDiscounts(
        discounts.item10Percent,
        carts.frCart
      )

      expect(res).toEqual([
        {
          lineItem: IdMap.getId("existingLine"),
          variant: IdMap.getId("eur-10-us-12"),
          amount: 1,
        },
      ])
    })

    it("calculates item with fixed discount", async () => {
      res = await totalsService.getAllocationItemDiscounts(
        discounts.item9Fixed,
        carts.frCart
      )

      expect(res).toEqual([
        {
          lineItem: IdMap.getId("existingLine"),
          variant: IdMap.getId("eur-10-us-12"),
          amount: 9,
        },
      ])
    })

    it("does not apply discount if no valid variants are provided", async () => {
      res = await totalsService.getAllocationItemDiscounts(
        discounts.item10FixedNoVariants,
        carts.frCart
      )

      expect(res).toEqual([])
    })
  })

  describe("getDiscountTotal", () => {
    let res
    const totalsService = new TotalsService({
      productVariantService: ProductVariantServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
      carts.discountCart.discounts = []
    })

    it("calculate total precentage discount", async () => {
      carts.discountCart.discounts.push(discounts.total10Percent)
      res = await totalsService.getDiscountTotal(carts.discountCart)

      expect(res).toEqual(252)
    })

    it("calculate item fixed discount", async () => {
      carts.discountCart.discounts.push(discounts.item2Fixed)
      res = await totalsService.getDiscountTotal(carts.discountCart)

      expect(res).toEqual(278)
    })

    it("calculate item percentage discount", async () => {
      carts.discountCart.discounts.push(discounts.item10Percent)
      res = await totalsService.getDiscountTotal(carts.discountCart)

      expect(res).toEqual(279)
    })

    it("calculate total fixed discount", async () => {
      carts.discountCart.discounts.push(discounts.total10Fixed)
      res = await totalsService.getDiscountTotal(carts.discountCart)

      expect(res).toEqual(270)
    })

    it("ignores discount if expired", async () => {
      carts.discountCart.discounts.push(discounts.expiredDiscount)
      res = await totalsService.getDiscountTotal(carts.discountCart)

      expect(res).toEqual(280)
    })

    it("returns cart subtotal if no discounts are applied", async () => {
      res = await totalsService.getDiscountTotal(carts.discountCart)

      expect(res).toEqual(280)
    })

    it("returns 0 if no items are in cart", async () => {
      res = await totalsService.getDiscountTotal(carts.regionCart)

      expect(res).toEqual(0)
    })
  })
})
