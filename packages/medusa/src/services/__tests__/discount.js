import DiscountService from "../discount"
import { DiscountModelMock, discounts } from "../../models/__mocks__/discount"
import { IdMap } from "medusa-test-utils"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"
import { RegionServiceMock } from "../__mocks__/region"

describe("DiscountService", () => {
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

    it("successfully calls model layer with discount_rule", async () => {
      await discountService.update(IdMap.getId("total10"), {
        discount_rule: { type: "fixed", value: 10, allocation: "total" },
      })
      expect(DiscountModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(DiscountModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("total10"),
        },
        {
          $set: {
            discount_rule: { type: "fixed", value: 10, allocation: "total" },
          },
        },
        { runValidators: true }
      )
    })

    it("throws if metadata update is attempted", async () => {
      try {
        await discountService.update(IdMap.getId("total10"), {
          metadata: { test: "test" },
        })
      } catch (error) {
        expect(error.message).toEqual(
          "Use setMetadata to update discount metadata"
        )
      }
    })
  })

  describe("addValidVariant", () => {
    const discountService = new DiscountService({
      discountModel: DiscountModelMock,
      productVariantService: ProductVariantServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls model layer updateOne", async () => {
      await discountService.addValidVariant(
        IdMap.getId("total10"),
        IdMap.getId("testVariant")
      )

      expect(DiscountModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(DiscountModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("total10"),
        },
        {
          $push: { discount_rule: { valid_for: IdMap.getId("testVariant") } },
        },
        { runValidators: true }
      )
    })
  })

  describe("removeValidVariant", () => {
    const discountService = new DiscountService({
      discountModel: DiscountModelMock,
      productVariantService: ProductVariantServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls model layer updateOne", async () => {
      await discountService.removeValidVariant(
        IdMap.getId("total10"),
        IdMap.getId("testVariant")
      )

      expect(DiscountModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(DiscountModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("total10"),
        },
        {
          $pull: { discount_rule: { valid_for: IdMap.getId("testVariant") } },
        },
        { runValidators: true }
      )
    })
  })

  describe("addRegion", () => {
    const discountService = new DiscountService({
      discountModel: DiscountModelMock,
      regionService: RegionServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls model layer updateOne", async () => {
      await discountService.addRegion(
        IdMap.getId("total10"),
        IdMap.getId("testRegion")
      )

      expect(DiscountModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(DiscountModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("total10"),
        },
        {
          $push: { regions: IdMap.getId("testRegion") },
        },
        { runValidators: true }
      )
    })
  })

  describe("removeRegion", () => {
    const discountService = new DiscountService({
      discountModel: DiscountModelMock,
      regionService: RegionServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls model layer updateOne", async () => {
      await discountService.removeRegion(
        IdMap.getId("total10"),
        IdMap.getId("testRegion")
      )

      expect(DiscountModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(DiscountModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("total10"),
        },
        {
          $pull: { regions: IdMap.getId("testRegion") },
        },
        { runValidators: true }
      )
    })
  })
})
