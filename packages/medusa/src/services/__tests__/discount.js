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
        },
        regions: [IdMap.getId("fr-cart")],
      })

      expect(DiscountModelMock.create).toHaveBeenCalledTimes(1)
      expect(DiscountModelMock.create).toHaveBeenCalledWith({
        code: "TEST",
        discount_rule: {
          type: "percentage",
          allocation: "total",
          value: 20,
        },
        regions: [IdMap.getId("fr-cart")],
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
})
