import DiscountService from "../discount"
import { DiscountModelMock, discounts } from "../../models/__mocks__/discount"
import { IdMap } from "medusa-test-utils"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"
import { carts } from "../__mocks__/cart"
import { TotalsServiceMock } from "../__mocks__/totals"

describe("AuthService", () => {
  describe("create", () => {
    const discountService = new DiscountService({
      discountModel: DiscountModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls model layer create and normalizes code", async () => {
      await discountService.create({
        code: "test",
        discount_rule: {
          type: "percentage",
          allocation: "total",
          value: 20,
          regions: [IdMap.getId("fr-cart")],
        },
      })
      expect(DiscountModelMock.create).toHaveBeenCalledTimes(1)
      expect(DiscountModelMock.create).toHaveBeenCalledWith({
        code: "TEST",
        discount_rule: {
          type: "percentage",
          allocation: "total",
          value: 20,
          regions: [IdMap.getId("fr-cart")],
        },
      })
    })
  })

  describe("retrieve", () => {
    let res
    const discountService = new DiscountService({
      discountModel: DiscountModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls model layer findOne", async () => {
      res = await discountService.retrieve(IdMap.getId("total10"))
      expect(DiscountModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(DiscountModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("total10"),
      })
    })

    it("successfully returns cart", () => {
      expect(res).toEqual(discounts.total10Percent)
    })
  })

  describe("update", () => {
    const discountService = new DiscountService({
      discountModel: DiscountModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls model layer updateOne", async () => {
      await discountService.update(IdMap.getId("total10"), {
        code: "test",
      })
      expect(DiscountModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(DiscountModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("total10") },
        {
          $set: { code: "test" },
        },
        { runValidators: true }
      )
    })

    it("fails if discount rule update are attempted", async () => {
      try {
        await discountService.update(IdMap.getId("total10"), {
          discount_rule: { type: "fixed", value: 10, allocation: "total" },
        })
      } catch (error) {
        expect(error.message).toEqual(
          "Use updateDiscountRule to update the discount rule"
        )
      }
    })
  })

  describe("calculateItemDiscounts", () => {
    let res
    const discountService = new DiscountService({
      discountModel: DiscountModelMock,
      productVariantService: ProductVariantServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calculates item with percentage discount", async () => {
      res = await discountService.calculateItemDiscounts(
        discounts.item10Percent,
        carts.frCart
      )

      expect(res).toEqual([
        {
          lineItem: IdMap.getId("line"),
          variant: IdMap.getId("eur-8-us-10"),
          amount: 0.8,
        },
        {
          lineItem: IdMap.getId("line"),
          variant: IdMap.getId("eur-10-us-12"),
          amount: 1,
        },
        {
          lineItem: IdMap.getId("existingLine"),
          variant: IdMap.getId("eur-10-us-12"),
          amount: 1,
        },
      ])
    })

    it("calculates item with fixed discount", async () => {
      res = await discountService.calculateItemDiscounts(
        discounts.item9Fixed,
        carts.frCart
      )

      expect(res).toEqual([
        {
          lineItem: IdMap.getId("line"),
          variant: IdMap.getId("eur-8-us-10"),
          amount: 8,
        },
        {
          lineItem: IdMap.getId("line"),
          variant: IdMap.getId("eur-10-us-12"),
          amount: 9,
        },
        {
          lineItem: IdMap.getId("existingLine"),
          variant: IdMap.getId("eur-10-us-12"),
          amount: 9,
        },
      ])
    })

    it("does not apply discount if no valid variants are provided", async () => {
      res = await discountService.calculateItemDiscounts(
        discounts.item10FixedNoVariants,
        carts.frCart
      )

      expect(res).toEqual([])
    })
  })

  describe("calculateDiscountTotal", () => {
    let res
    const discountService = new DiscountService({
      discountModel: DiscountModelMock,
      productVariantService: ProductVariantServiceMock,
      totalsService: TotalsServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
      carts.discountCart.discounts = []
    })

    it("calculate total precentage discount", async () => {
      carts.discountCart.discounts.push(IdMap.getId("total10"))
      res = await discountService.calculateDiscountTotal(carts.discountCart)

      expect(res).toEqual(252)
    })

    it("calculate item fixed discount", async () => {
      carts.discountCart.discounts.push(IdMap.getId("item2Fixed"))
      res = await discountService.calculateDiscountTotal(carts.discountCart)

      expect(res).toEqual(274)
    })

    it("calculate item percentage discount", async () => {
      carts.discountCart.discounts.push(IdMap.getId("item10Percent"))
      res = await discountService.calculateDiscountTotal(carts.discountCart)

      expect(res).toEqual(277.2)
    })

    it("calculate total fixed discount", async () => {
      carts.discountCart.discounts.push(IdMap.getId("total10Fixed"))
      res = await discountService.calculateDiscountTotal(carts.discountCart)

      expect(res).toEqual(270)
    })

    it("ignores discount if expired", async () => {
      carts.discountCart.discounts.push(IdMap.getId("expired"))
      res = await discountService.calculateDiscountTotal(carts.discountCart)

      expect(res).toEqual(280)
    })

    it("returns cart subtotal if no discounts are applied", async () => {
      res = await discountService.calculateDiscountTotal(carts.discountCart)

      expect(res).toEqual(280)
    })

    it("returns 0 if no items are in cart", async () => {
      res = await discountService.calculateDiscountTotal(carts.regionCart)

      expect(res).toEqual(0)
    })
  })
})
