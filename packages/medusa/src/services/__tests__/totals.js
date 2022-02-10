import TotalsService from "../totals"
import { IdMap } from "medusa-test-utils"

const discounts = {
  total10Percent: {
    id: "total10",
    code: "10%OFF",
    rule: {
      type: "percentage",
      allocation: "total",
      value: 10,
    },
    regions: [{ id: "fr" }],
  },
  item2Fixed: {
    id: "item2Fixed",
    code: "MEDUSA",
    rule: {
      type: "fixed",
      allocation: "item",
      value: 2,
      valid_for: [{ id: "testp2" }],
    },
    regions: [{ id: "fr" }],
  },
  item10Percent: {
    id: "item10Percent",
    code: "MEDUSA",
    rule: {
      type: "percentage",
      allocation: "item",
      value: 10,
      valid_for: [{ id: "testp2" }],
    },
    regions: [{ id: "fr" }],
  },
  total10Fixed: {
    id: "total10Fixed",
    code: "MEDUSA",
    rule: {
      type: "fixed",
      allocation: "total",
      value: 10,
      valid_for: [],
    },
    regions: [{ id: "fr" }],
  },
  expiredDiscount: {
    id: "expired",
    code: "MEDUSA",
    ends_at: new Date("December 17, 1995 03:24:00"),
    rule: {
      type: "fixed",
      allocation: "item",
      value: 10,
      valid_for: [],
    },
    regions: [{ id: "fr" }],
  },
}

describe("TotalsService", () => {
  const container = {
    taxProviderService: {},
    taxCalculationStrategy: {},
  }

  describe("getAllocationItemDiscounts", () => {
    let res

    const totalsService = new TotalsService(container)

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calculates item with percentage discount", async () => {
      const cart = {
        items: [
          {
            id: "test",
            allow_discounts: true,
            unit_price: 10,
            quantity: 10,
            variant: {
              id: "testv",
              product_id: "testp",
            },
          },
        ],
      }

      const discount = {
        rule: {
          type: "percentage",
          value: 10,
          valid_for: [{ id: "testp" }],
        },
      }

      res = totalsService.getAllocationItemDiscounts(discount, cart)

      expect(res).toEqual([
        {
          lineItem: {
            id: "test",
            allow_discounts: true,
            unit_price: 10,
            quantity: 10,
            variant: {
              id: "testv",
              product_id: "testp",
            },
          },
          variant: "testv",
          amount: 10,
        },
      ])
    })

    it("calculates item with fixed discount", async () => {
      const cart = {
        items: [
          {
            id: "exists",
            allow_discounts: true,
            unit_price: 10,
            variant: {
              id: "testv",
              product_id: "testp",
            },
            quantity: 10,
          },
        ],
      }

      const discount = {
        rule: {
          type: "fixed",
          value: 9,
          valid_for: [{ id: "testp" }],
        },
      }

      res = totalsService.getAllocationItemDiscounts(discount, cart)

      expect(res).toEqual([
        {
          lineItem: {
            id: "exists",
            allow_discounts: true,
            unit_price: 10,
            variant: {
              id: "testv",
              product_id: "testp",
            },
            quantity: 10,
          },
          variant: "testv",
          amount: 90,
        },
      ])
    })

    it("does not apply discount if no valid variants are provided", async () => {
      const cart = {
        items: [
          {
            id: "exists",
            allow_discounts: true,
            unit_price: 10,
            variant: {
              id: "testv",
              product_id: "testp",
            },
            quantity: 10,
          },
        ],
      }

      const discount = {
        rule: {
          type: "fixed",
          value: 9,
          valid_for: [],
        },
      }
      res = totalsService.getAllocationItemDiscounts(discount, cart)

      expect(res).toEqual([])
    })
  })

  describe("getDiscountTotal", () => {
    let res
    const totalsService = new TotalsService(container)

    const discountCart = {
      id: "discount_cart",
      discounts: [],
      region_id: "fr",
      items: [
        {
          id: "line",
          allow_discounts: true,
          unit_price: 18,
          variant: {
            id: "testv1",
            product_id: "testp1",
          },
          quantity: 10,
        },
        {
          id: "line2",
          allow_discounts: true,
          unit_price: 10,
          variant: {
            id: "testv2",
            product_id: "testp2",
          },
          quantity: 10,
        },
      ],
    }

    beforeEach(() => {
      jest.clearAllMocks()
      discountCart.discounts = []
    })

    it("calculate total precentage discount", async () => {
      discountCart.discounts.push(discounts.total10Percent)
      res = totalsService.getDiscountTotal(discountCart)

      expect(res).toEqual(28)
    })

    it("calculate item fixed discount", async () => {
      discountCart.discounts.push(discounts.item2Fixed)
      res = totalsService.getDiscountTotal(discountCart)

      expect(res).toEqual(20)
    })

    it("calculate item percentage discount", async () => {
      discountCart.discounts.push(discounts.item10Percent)
      res = totalsService.getDiscountTotal(discountCart)

      expect(res).toEqual(10)
    })

    it("calculate total fixed discount", async () => {
      discountCart.discounts.push(discounts.total10Fixed)
      res = totalsService.getDiscountTotal(discountCart)

      expect(res).toEqual(10)
    })

    it("ignores discount if expired", async () => {
      discountCart.discounts.push(discounts.expiredDiscount)
      res = totalsService.getDiscountTotal(discountCart)

      expect(res).toEqual(0)
    })

    it("returns 0 if no discounts are applied", async () => {
      res = totalsService.getDiscountTotal(discountCart)

      expect(res).toEqual(0)
    })

    it("returns 0 if no items are in cart", async () => {
      res = totalsService.getDiscountTotal({
        items: [],
        discounts: [discounts.total10Fixed],
      })

      expect(res).toEqual(0)
    })
  })

  describe("getRefundTotal", () => {
    let res
    const totalsService = new TotalsService(container)
    const orderToRefund = {
      id: "refund-order",
      tax_rate: 25,
      items: [
        {
          id: "line",
          unit_price: 100,
          allow_discounts: true,
          variant: {
            id: "variant",
            product_id: "testp1",
          },
          quantity: 10,
          returned_quantity: 0,
        },
        {
          id: "line2",
          unit_price: 100,
          allow_discounts: true,
          variant: {
            id: "variant",
            product_id: "testp2",
          },
          quantity: 10,
          returned_quantity: 0,
          metadata: {},
        },
        {
          id: "non-discount",
          unit_price: 100,
          allow_discounts: false,
          variant: {
            id: "variant",
            product_id: "testp2",
          },
          quantity: 1,
          returned_quantity: 0,
          metadata: {},
        },
      ],
      region_id: "fr",
      discounts: [],
    }

    beforeEach(() => {
      jest.clearAllMocks()
      orderToRefund.discounts = []
    })

    it("calculates refund", async () => {
      res = totalsService.getRefundTotal(orderToRefund, [
        {
          id: "line2",
          unit_price: 100,
          allow_discounts: true,
          variant: {
            id: "variant",
            product_id: "product2",
          },
          quantity: 10,
          returned_quantity: 0,
          metadata: {},
        },
      ])

      expect(res).toEqual(1250)
    })

    it("calculates refund with total precentage discount", async () => {
      orderToRefund.discounts.push(discounts.total10Percent)
      res = totalsService.getRefundTotal(orderToRefund, [
        {
          id: "line2",
          unit_price: 100,
          allow_discounts: true,
          variant: {
            id: "variant",
            product_id: "product2",
          },
          returned_quantity: 0,
          metadata: {},
          quantity: 10,
        },
      ])

      expect(res).toEqual(1125)
    })

    it("calculates refund with total fixed discount", async () => {
      orderToRefund.discounts.push(discounts.total10Fixed)
      res = totalsService.getRefundTotal(orderToRefund, [
        {
          id: "line",
          unit_price: 100,
          allow_discounts: true,
          variant: {
            id: "variant",
            product_id: "product",
          },
          quantity: 10,
          returned_quantity: 0,
        },
      ])

      expect(res).toEqual(1244)
    })

    it("calculates refund with item fixed discount", async () => {
      orderToRefund.discounts.push(discounts.item2Fixed)
      res = totalsService.getRefundTotal(orderToRefund, [
        {
          id: "line2",
          unit_price: 100,
          allow_discounts: true,
          variant: {
            id: "variant",
            product_id: "testp2",
          },
          quantity: 10,
          returned_quantity: 0,
        },
      ])

      expect(res).toEqual(1225)
    })

    it("calculates refund with item percentage discount", async () => {
      orderToRefund.discounts.push(discounts.item10Percent)
      res = totalsService.getRefundTotal(orderToRefund, [
        {
          id: "line2",
          unit_price: 100,
          allow_discounts: true,
          variant: {
            id: "variant",
            product_id: "testp2",
          },
          quantity: 10,
          returned_quantity: 0,
        },
      ])

      expect(res).toEqual(1125)
    })

    it("throws if line items to return is not in order", async () => {
      const work = () =>
        totalsService.getRefundTotal(orderToRefund, [
          {
            id: "notInOrder",
            unit_price: 123,
            allow_discounts: true,
            variant: {
              id: "variant",
              product_id: "pid",
            },
            quantity: 1,
          },
        ])

      expect(work).toThrow("Line item does not exist on order")
    })
  })
  describe("getShippingTotal", () => {
    let res
    const totalsService = new TotalsService(container)

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calculates shipping", async () => {
      const order = {
        shipping_methods: [
          {
            _id: IdMap.getId("expensiveShipping"),
            name: "Expensive Shipping",
            price: 100,
            provider_id: "default_provider",
            profile_id: IdMap.getId("default"),
            data: {
              extra: "hi",
            },
          },
        ],
      }
      res = totalsService.getShippingTotal(order)

      expect(res).toEqual(100)
    })
  })
  describe("getTaxTotal", () => {
    let res
    let totalsService

    const getTaxLinesMock = jest.fn(() => Promise.resolve([{ id: "line1" }]))
    const calculateMock = jest.fn(() => Promise.resolve(20.3))
    const getAllocationMapMock = jest.fn(() => ({}))

    const cradle = {
      taxProviderService: {
        getTaxLines: getTaxLinesMock,
      },
      taxCalculationStrategy: {
        calculate: calculateMock,
      },
    }

    beforeEach(() => {
      jest.clearAllMocks()

      totalsService = new TotalsService(cradle)
      totalsService.getAllocationMap = getAllocationMapMock
    })

    it("uses order tax lines", async () => {
      const order = {
        object: "order",
        tax_rate: null,
        region: {
          tax_rate: 25,
        },
        customer: {
          test: "test",
        },
        shipping_address: {
          test: "test",
        },
        items: [
          {
            unit_price: 20,
            quantity: 2,
            tax_lines: [{ id: "orderline1" }],
          },
        ],
        shipping_methods: [
          {
            id: IdMap.getId("expensiveShipping"),
            name: "Expensive Shipping",
            price: 100,
            provider_id: "default_provider",
            profile_id: IdMap.getId("default"),
            tax_lines: [],
            data: {
              extra: "hi",
            },
          },
        ],
      }

      res = await totalsService.getTaxTotal(order)

      expect(res).toEqual(20)

      expect(getAllocationMapMock).toHaveBeenCalledTimes(1)
      expect(getAllocationMapMock).toHaveBeenCalledWith(order, {})

      expect(getTaxLinesMock).toHaveBeenCalledTimes(0)

      expect(calculateMock).toHaveBeenCalledTimes(1)
      expect(calculateMock).toHaveBeenCalledWith(
        order.items,
        [{ id: "orderline1" }],
        {
          shipping_address: order.shipping_address,
          shipping_methods: order.shipping_methods,
          is_return: false,
          customer: order.customer,
          region: order.region,
          allocation_map: {},
        }
      )
    })

    it("calculates tax", async () => {
      const order = {
        region: {
          tax_rate: 25,
        },
        customer: {
          test: "test",
        },
        shipping_address: {
          test: "test",
        },
        items: [
          {
            unit_price: 20,
            quantity: 2,
          },
        ],
        shipping_methods: [
          {
            id: IdMap.getId("expensiveShipping"),
            name: "Expensive Shipping",
            price: 100,
            provider_id: "default_provider",
            profile_id: IdMap.getId("default"),
            data: {
              extra: "hi",
            },
          },
        ],
      }

      res = await totalsService.getTaxTotal(order)

      expect(res).toEqual(20)

      expect(getAllocationMapMock).toHaveBeenCalledTimes(1)
      expect(getAllocationMapMock).toHaveBeenCalledWith(order, {})

      expect(getTaxLinesMock).toHaveBeenCalledTimes(1)
      expect(getTaxLinesMock).toHaveBeenCalledWith(
        [{ quantity: 2, unit_price: 20 }],
        {
          shipping_address: order.shipping_address,
          shipping_methods: order.shipping_methods,
          is_return: false,
          customer: order.customer,
          region: order.region,
          allocation_map: {},
        }
      )

      expect(calculateMock).toHaveBeenCalledTimes(1)
      expect(calculateMock).toHaveBeenCalledWith(
        order.items,
        [{ id: "line1" }],
        {
          shipping_address: order.shipping_address,
          shipping_methods: order.shipping_methods,
          is_return: false,
          customer: order.customer,
          region: order.region,
          allocation_map: {},
        }
      )
    })
  })

  describe("getTotal", () => {
    let res
    const totalsService = new TotalsService(container)

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calculates total", async () => {
      const order = {
        region: {
          tax_rate: 25,
        },
        items: [
          {
            unit_price: 20,
            quantity: 2,
          },
        ],
        shipping_methods: [
          {
            _id: IdMap.getId("expensiveShipping"),
            name: "Expensive Shipping",
            price: 100,
            provider_id: "default_provider",
            profile_id: IdMap.getId("default"),
            data: {
              extra: "hi",
            },
          },
        ],
      }
      const getTaxTotalMock = jest.fn(() => Promise.resolve(35))
      totalsService.getTaxTotal = getTaxTotalMock
      res = await totalsService.getTotal(order)

      expect(getTaxTotalMock).toHaveBeenCalledTimes(1)
      expect(getTaxTotalMock).toHaveBeenCalledWith(order, undefined)

      expect(res).toEqual(175)
    })
  })
})
