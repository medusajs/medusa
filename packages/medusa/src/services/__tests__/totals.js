import TotalsService from "../totals"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"
import { discounts } from "../../models/__mocks__/discount"
import { carts } from "../__mocks__/cart"
import { orders } from "../../models/__mocks__/order"
import { IdMap } from "medusa-test-utils"
import { RegionServiceMock } from "../__mocks__/region"

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
          lineItem: {
            _id: IdMap.getId("existingLine"),
            title: "merge line",
            description: "This is a new line",
            thumbnail: "test-img-yeah.com/thumb",
            content: {
              unit_price: 10,
              variant: {
                _id: IdMap.getId("eur-10-us-12"),
              },
              product: {
                _id: IdMap.getId("product"),
              },
              quantity: 1,
            },
            quantity: 10,
          },
          variant: IdMap.getId("eur-10-us-12"),
          amount: 10,
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
          lineItem: {
            _id: IdMap.getId("existingLine"),
            title: "merge line",
            description: "This is a new line",
            thumbnail: "test-img-yeah.com/thumb",
            content: {
              unit_price: 10,
              variant: {
                _id: IdMap.getId("eur-10-us-12"),
              },
              product: {
                _id: IdMap.getId("product"),
              },
              quantity: 1,
            },
            quantity: 10,
          },
          variant: IdMap.getId("eur-10-us-12"),
          amount: 90,
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

      expect(res).toEqual(28)
    })

    it("calculate item fixed discount", async () => {
      carts.discountCart.discounts.push(discounts.item2Fixed)
      res = await totalsService.getDiscountTotal(carts.discountCart)

      expect(res).toEqual(20)
    })

    it("calculate item percentage discount", async () => {
      carts.discountCart.discounts.push(discounts.item10Percent)
      res = await totalsService.getDiscountTotal(carts.discountCart)

      expect(res).toEqual(10)
    })

    it("calculate total fixed discount", async () => {
      carts.discountCart.discounts.push(discounts.total10Fixed)
      res = await totalsService.getDiscountTotal(carts.discountCart)

      expect(res).toEqual(10)
    })

    it("ignores discount if expired", async () => {
      carts.discountCart.discounts.push(discounts.expiredDiscount)
      res = await totalsService.getDiscountTotal(carts.discountCart)

      expect(res).toEqual(0)
    })

    it("returns 0 if no discounts are applied", async () => {
      res = await totalsService.getDiscountTotal(carts.discountCart)

      expect(res).toEqual(0)
    })

    it("returns 0 if no items are in cart", async () => {
      res = await totalsService.getDiscountTotal(carts.regionCart)

      expect(res).toEqual(0)
    })
  })

  describe("getRefundTotal", () => {
    let res
    const totalsService = new TotalsService({
      productVariantService: ProductVariantServiceMock,
      regionService: RegionServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
      orders.orderToRefund.discounts = []
    })

    it("calculates refund", async () => {
      res = await totalsService.getRefundTotal(orders.orderToRefund, [
        {
          _id: IdMap.getId("existingLine"),
          title: "merge line",
          description: "This is a new line",
          thumbnail: "test-img-yeah.com/thumb",
          content: {
            unit_price: 123,
            variant: {
              _id: IdMap.getId("can-cover"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
          quantity: 10,
        },
      ])

      expect(res).toEqual(1537.5)
    })

    it("calculates refund with total precentage discount", async () => {
      orders.orderToRefund.discounts.push(discounts.total10Percent)
      res = await totalsService.getRefundTotal(orders.orderToRefund, [
        {
          _id: IdMap.getId("existingLine"),
          title: "merge line",
          description: "This is a new line",
          thumbnail: "test-img-yeah.com/thumb",
          content: {
            unit_price: 100,
            variant: {
              _id: IdMap.getId("can-cover"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
          quantity: 10,
        },
      ])

      expect(res).toEqual(1125)
    })

    it("calculates refund with total fixed discount", async () => {
      orders.orderToRefund.discounts.push(discounts.total10Fixed)
      res = await totalsService.getRefundTotal(orders.orderToRefund, [
        {
          _id: IdMap.getId("existingLine"),
          title: "merge line",
          description: "This is a new line",
          thumbnail: "test-img-yeah.com/thumb",
          content: {
            unit_price: 100,
            variant: {
              _id: IdMap.getId("can-cover"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
          quantity: 3,
        },
      ])

      expect(res).toEqual(373.125)
    })

    it("calculates refund with item fixed discount", async () => {
      orders.orderToRefund.discounts.push(discounts.item2Fixed)
      res = await totalsService.getRefundTotal(orders.orderToRefund, [
        {
          _id: IdMap.getId("existingLine"),
          title: "merge line",
          description: "This is a new line",
          thumbnail: "test-img-yeah.com/thumb",
          content: {
            unit_price: 100,
            variant: {
              _id: IdMap.getId("eur-8-us-10"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
          quantity: 3,
        },
      ])

      expect(res).toEqual(367.5)
    })

    it("calculates refund with item percentage discount", async () => {
      orders.orderToRefund.discounts.push(discounts.item10Percent)
      res = await totalsService.getRefundTotal(orders.orderToRefund, [
        {
          _id: IdMap.getId("existingLine"),
          title: "merge line",
          description: "This is a new line",
          thumbnail: "test-img-yeah.com/thumb",
          content: {
            unit_price: 100,
            variant: {
              _id: IdMap.getId("eur-8-us-10"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
          quantity: 3,
        },
      ])

      expect(res).toEqual(337.5)
    })

    it("throws if line items to return is not in order", async () => {
      try {
        await totalsService.getRefundTotal(orders.orderToRefund, [
          {
            _id: IdMap.getId("notInOrder"),
            title: "merge line",
            description: "This is a new line",
            thumbnail: "test-img-yeah.com/thumb",
            content: {
              unit_price: 123,
              variant: {
                _id: IdMap.getId("eur-8-us-10"),
              },
              product: {
                _id: IdMap.getId("product"),
              },
              quantity: 1,
            },
            quantity: 3,
          },
        ])
      } catch (error) {
        expect(error.message).toEqual("Line items does not exist on order")
      }
    })
  })
  describe("getShippingTotal", () => {
    let res
    const totalsService = new TotalsService({
      productVariantService: ProductVariantServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calculates shipping", async () => {
      res = await totalsService.getShippingTotal(orders.testOrder)

      expect(res).toEqual(110)
    })
  })
  describe("getTaxTotal", () => {
    let res
    const totalsService = new TotalsService({
      productVariantService: ProductVariantServiceMock,
      regionService: RegionServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
      orders.orderToRefund.discounts = []
    })

    it("calculates tax", async () => {
      res = await totalsService.getTaxTotal(orders.testOrder)

      expect(res).toEqual(335)
    })
  })

  describe("getTotal", () => {
    let res
    const totalsService = new TotalsService({
      productVariantService: ProductVariantServiceMock,
      regionService: RegionServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calculates total", async () => {
      res = await totalsService.getTotal(orders.testOrder)

      expect(res).toEqual(1230 + 335 + 110)
    })
  })
})
