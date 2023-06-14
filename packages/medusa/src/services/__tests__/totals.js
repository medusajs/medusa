import { IdMap } from "medusa-test-utils"
import TotalsService from "../totals"
import { FlagRouter } from "../../utils/flag-router"

import TaxInclusivePricingFeatureFlag from "../../loaders/feature-flags/tax-inclusive-pricing"
import { calculatePriceTaxAmount } from "../../utils"

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
      // TODO: Add conditions relation
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
      // TODO: Add conditions relation
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
      // TODO: Add conditions relation
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
      // TODO: Add conditions relation
    },
    regions: [{ id: "fr" }],
  },
}

const applyDiscount = (cart, discount) => {
  let newCart = { ...cart }
  if (newCart.items) {
    newCart.items = cart.items.map((item) => {
      return {
        ...item,
        adjustments: [
          {
            item_id: item.id,
            amount: calculateAdjustment(newCart, item, discount),
            description: "discount",
            discount_id: discount.id,
          },
        ],
      }
    })
  }

  return newCart
}

const calculateAdjustment = (cart, lineItem, discount) => {
  let amount = discount.rule.value * lineItem.quantity

  const taxAmountIncludedInPrice = !lineItem.includes_tax
    ? 0
    : Math.round(
        calculatePriceTaxAmount({
          price: lineItem.unit_price,
          taxRate: cart.tax_rate / 100,
          includesTax: lineItem.includes_tax,
        })
      )
  let price = lineItem.unit_price - taxAmountIncludedInPrice
  const lineItemPrice = price * lineItem.quantity

  if (discount.rule.type === "fixed" && discount.rule.allocation === "total") {
    let subtotal = cart.items.reduce(
      (total, item) => total + price * item.quantity,
      0
    )
    const nominator = Math.min(discount.rule.value, subtotal)
    amount = Math.round((lineItemPrice / subtotal) * nominator)
  } else if (discount.rule.type === "percentage") {
    amount = Math.round((lineItemPrice * discount.rule.value) / 100)
  }
  return amount > lineItemPrice ? lineItemPrice : amount
}

describe("TotalsService", () => {
  const getTaxLinesMock = jest.fn((items) => {
    const taxLines = items.some((item) => item.id === "line1")
      ? [{ id: "line1" }]
      : []
    return Promise.resolve(taxLines)
  })
  const featureFlagRouter = new FlagRouter({
    [TaxInclusivePricingFeatureFlag.key]: false,
  })
  const container = {
    taxProviderService: {
      withTransaction: function () {
        return this
      },
      getTaxLines: getTaxLinesMock,
    },
    newTotalsService: {
      getGiftCardTotals: jest.fn(() => {
        return {
          total: 0,
          tax_total: 0,
        }
      }),
    },
    taxCalculationStrategy: {},
    featureFlagRouter,
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
            adjustments: [{ amount: 10 }],
          },
        ],
      }

      const discount = {
        rule: {
          type: "percentage",
          value: 10,
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
            adjustments: [{ amount: 10 }],
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
            adjustments: [{ amount: 90 }],
          },
        ],
      }

      const discount = {
        rule: {
          type: "fixed",
          value: 9,
          // TODO: Add conditions relation
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
            adjustments: [{ amount: 90 }],
          },
          variant: "testv",
          amount: 90,
        },
      ])
    })

    // not relevant anymore
    // it("does not apply discount if no valid variants are provided", async () => {
    //   const cart = {
    //     items: [
    //       {
    //         id: "exists",
    //         allow_discounts: true,
    //         unit_price: 10,
    //         variant: {
    //           id: "testv",
    //           product_id: "testp",
    //         },
    //         quantity: 10,
    //       },
    //     ],
    //   }

    //   const discount = {
    //     rule: {
    //       type: "fixed",
    //       value: 9,
    //       // TODO: Add conditions relation
    //     },
    //   }
    //   res = totalsService.getAllocationItemDiscounts(discount, cart)

    //   expect(res).toEqual([])
    // })
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

    it("calculate total percentage discount", async () => {
      discountCart.discounts.push(discounts.total10Percent)
      let cart = applyDiscount(discountCart, discounts.total10Percent)
      res = await totalsService.getDiscountTotal(cart)

      expect(res).toEqual(28)
    })

    // TODO: Redo tests to include new line item adjustments

    it("calculate item fixed discount", async () => {
      discountCart.discounts.push(discounts.item2Fixed)
      let cart = applyDiscount(discountCart, discounts.item2Fixed)
      res = await totalsService.getDiscountTotal(cart)

      expect(res).toEqual(40)
    })

    it("calculate item percentage discount", async () => {
      discountCart.discounts.push(discounts.item10Percent)
      let cart = applyDiscount(discountCart, discounts.item10Percent)
      res = await totalsService.getDiscountTotal(cart)

      expect(res).toEqual(28)
    })

    it("calculate total fixed discount", async () => {
      discountCart.discounts.push(discounts.total10Fixed)
      let cart = applyDiscount(discountCart, discounts.total10Fixed)
      res = await totalsService.getDiscountTotal(cart)

      expect(res).toEqual(10)
    })

    it("ignores discount if expired", async () => {
      discountCart.discounts.push(discounts.expiredDiscount)
      res = await totalsService.getDiscountTotal(discountCart)

      expect(res).toEqual(0)
    })

    it("returns 0 if no discounts are applied", async () => {
      res = await totalsService.getDiscountTotal(discountCart)

      expect(res).toEqual(0)
    })

    it("returns 0 if no items are in cart", async () => {
      res = await totalsService.getDiscountTotal({
        items: [],
        discounts: [discounts.total10Fixed],
      })

      expect(res).toEqual(0)
    })
  })

  describe("getLineDiscounts", () => {
    let res
    const totalsService = new TotalsService(container)

    const mockCart = {
      swaps: [],
      claims: [],
      items: [],
    }
    let cart

    beforeEach(() => {
      jest.clearAllMocks()
      cart = { ...mockCart }
    })

    it("returns [] if items is empty in cart", async () => {
      res = totalsService.getLineDiscounts(cart, discounts.total10Fixed)

      expect(res).toEqual([])
    })

    it("returns [] if items is undefined in cart", async () => {
      cart.items = undefined
      res = totalsService.getLineDiscounts(cart, discounts.total10Fixed)

      expect(res).toEqual([])
    })

    it("returns flat list of discount amounts for a cart with multiple items, swaps, claims for a given discount", async () => {
      const discountId = discounts.total10Fixed.id
      const discountValue = discounts.total10Fixed.rule.value
      const item1 = {
        allow_discounts: true,
        unit_price: 18,
        adjustments: [
          {
            discount_id: discountId,
            amount: discountValue,
          },
        ],
      }
      const item2 = { ...item1, unit_price: 19 }
      const item3 = { ...item1, unit_price: 20 }
      const item4 = { ...item1, unit_price: 21 }
      const item5 = { ...item1, unit_price: 22 }
      const item6 = { ...item1, unit_price: 23 }
      const item7 = { ...item1, unit_price: 24 }
      const item8 = { ...item1, unit_price: 25 }

      const swap1 = {
        additional_items: [item3, item4],
      }
      const swap2 = {
        additional_items: [item5],
      }
      const claim1 = {
        additional_items: [item6, item7],
      }
      const claim2 = {
        additional_items: [item8],
      }

      cart.items = [item1, item2]
      cart.swaps = [swap1, swap2]
      cart.claims = [claim1, claim2]

      res = totalsService.getLineDiscounts(cart, discounts.total10Fixed)

      expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: discountValue,
            item: item1,
          }),
          expect.objectContaining({
            amount: discountValue,
            item: item2,
          }),
          expect.objectContaining({
            amount: discountValue,
            item: item3,
          }),
          expect.objectContaining({
            amount: discountValue,
            item: item4,
          }),
          expect.objectContaining({
            amount: discountValue,
            item: item5,
          }),
          expect.objectContaining({
            amount: discountValue,
            item: item6,
          }),
          expect.objectContaining({
            amount: discountValue,
            item: item7,
          }),
          expect.objectContaining({
            amount: discountValue,
            item: item8,
          }),
        ])
      )
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
      res = await totalsService.getRefundTotal(orderToRefund, [
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

    // TODO: Redo tests to include new line item adjustments

    // it("calculates refund with total precentage discount", async () => {
    //   orderToRefund.discounts.push(discounts.total10Percent)
    //   res = totalsService.getRefundTotal(orderToRefund, [
    //     {
    //       id: "line2",
    //       unit_price: 100,
    //       allow_discounts: true,
    //       variant: {
    //         id: "variant",
    //         product_id: "product2",
    //       },
    //       returned_quantity: 0,
    //       metadata: {},
    //       quantity: 10,
    //     },
    //   ])

    //   expect(res).toEqual(1125)
    // })

    // it("calculates refund with total fixed discount", async () => {
    //   orderToRefund.discounts.push(discounts.total10Fixed)
    //   res = totalsService.getRefundTotal(orderToRefund, [
    //     {
    //       id: "line",
    //       unit_price: 100,
    //       allow_discounts: true,
    //       variant: {
    //         id: "variant",
    //         product_id: "product",
    //       },
    //       quantity: 10,
    //       returned_quantity: 0,
    //     },
    //   ])

    //   expect(res).toEqual(1244)
    // })

    it("calculates refund with item fixed discount", async () => {
      orderToRefund.discounts.push(discounts.item2Fixed)
      let order = applyDiscount(orderToRefund, discounts.item2Fixed)
      res = await totalsService.getRefundTotal(order, [
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
      let order = applyDiscount(orderToRefund, discounts.item10Percent)
      res = await totalsService.getRefundTotal(order, [
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
      let errMsg
      await totalsService
        .getRefundTotal(orderToRefund, [
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
        .catch((e) => (errMsg = e.message))

      expect(errMsg).toBe("Line item does not exist on order")
    })
  })

  describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] getRefundTotal", () => {
    let res
    const totalsService = new TotalsService({
      ...container,
      featureFlagRouter: new FlagRouter({
        [TaxInclusivePricingFeatureFlag.key]: true,
      }),
    })

    const orderToRefund = {
      id: "refund-order",
      tax_rate: 25,
      items: [
        {
          id: "line",
          unit_price: 125,
          includes_tax: true,
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
      res = await totalsService.getRefundTotal(orderToRefund, [
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

    it("calculates refund with line that includes tax", async () => {
      res = await totalsService.getRefundTotal(orderToRefund, [
        {
          id: "line",
          unit_price: 125,
          includes_tax: true,
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

    it("calculates refund with item fixed discount", async () => {
      orderToRefund.discounts.push(discounts.item2Fixed)
      let order = applyDiscount(orderToRefund, discounts.item2Fixed)
      res = await totalsService.getRefundTotal(order, [
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

    it("calculates refund with item fixed discount and a line that includes tax", async () => {
      orderToRefund.discounts.push(discounts.item2Fixed)
      let order = applyDiscount(orderToRefund, discounts.item2Fixed)
      res = await totalsService.getRefundTotal(order, [
        {
          id: "line",
          unit_price: 125,
          includes_tax: true,
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
      let order = applyDiscount(orderToRefund, discounts.item10Percent)
      res = await totalsService.getRefundTotal(order, [
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

    it("calculates refund with item percentage discount and a line that includes tax", async () => {
      orderToRefund.discounts.push(discounts.item10Percent)
      let order = applyDiscount(orderToRefund, discounts.item10Percent)
      res = await totalsService.getRefundTotal(order, [
        {
          id: "line",
          unit_price: 125,
          includes_tax: true,
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
  })

  describe("getShippingTotal", () => {
    const getTaxLinesMock = jest.fn(() =>
      Promise.resolve([
        { shipping_method_id: IdMap.getId("expensiveShipping") },
      ])
    )
    const calculateMock = jest.fn(() => Promise.resolve(20))

    const totalsService = new TotalsService({
      ...container,
      taxProviderService: {
        withTransaction: function () {
          return this
        },
        getTaxLines: getTaxLinesMock,
      },
      taxCalculationStrategy: {
        calculate: calculateMock,
      },
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calculates shipping", async () => {
      const order = {
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
      const total = await totalsService.getShippingTotal(order)

      expect(total).toEqual(100)
    })
  })

  describe("getTaxTotal", () => {
    let res
    let totalsService

    const getTaxLinesMock = jest.fn((items) => {
      const taxLines = items.some((item) => item.id === "line1")
        ? [{ id: "line1" }]
        : []
      return Promise.resolve(taxLines)
    })
    const calculateMock = jest.fn(() => Promise.resolve(20.3))
    const getAllocationMapMock = jest.fn(() => ({}))

    const cradle = {
      taxProviderService: {
        withTransaction: function () {
          return this
        },
        getTaxLines: getTaxLinesMock,
      },
      taxCalculationStrategy: {
        calculate: calculateMock,
      },
      newTotalsService: {
        getGiftCardTotals: jest.fn(() => {
          return {
            total: 0,
            tax_total: 0,
          }
        }),
      },
      featureFlagRouter,
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

      expect(getAllocationMapMock).toHaveBeenCalledTimes(2)
      expect(getAllocationMapMock).toHaveBeenNthCalledWith(1, order, {})

      expect(getTaxLinesMock).toHaveBeenCalledTimes(0)

      expect(calculateMock).toHaveBeenCalledTimes(3)
      expect(calculateMock).toHaveBeenNthCalledWith(
        3,
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
            id: "line1",
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

      expect(getAllocationMapMock).toHaveBeenCalledTimes(2)
      expect(getAllocationMapMock).toHaveBeenNthCalledWith(2, order, {
        exclude_discounts: undefined,
        exclude_gift_cards: true,
      })

      expect(getTaxLinesMock).toHaveBeenCalledTimes(2)
      expect(getTaxLinesMock).toHaveBeenNthCalledWith(
        2,
        [{ id: "line1", quantity: 2, unit_price: 20 }],
        {
          shipping_address: order.shipping_address,
          shipping_methods: order.shipping_methods,
          is_return: false,
          customer: order.customer,
          region: order.region,
          allocation_map: {},
        }
      )

      expect(calculateMock).toHaveBeenCalledTimes(3)
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

  describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] getTotal", () => {
    let res
    const totalsService = new TotalsService({
      ...container,
      featureFlagRouter: new FlagRouter({
        [TaxInclusivePricingFeatureFlag.key]: true,
      }),
    })

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
          {
            unit_price: 25,
            quantity: 2,
            includes_tax: true,
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
      const getTaxTotalMock = jest.fn(() => Promise.resolve(45))
      totalsService.getTaxTotal = getTaxTotalMock
      res = await totalsService.getTotal(order)

      expect(getTaxTotalMock).toHaveBeenCalledTimes(1)
      expect(getTaxTotalMock).toHaveBeenCalledWith(order, undefined)

      expect(res).toEqual(185)
    })
  })

  describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] getShippingTotal ", () => {
    const shippingMethodData = {
      id: IdMap.getId("expensiveShipping"),
      name: "Expensive Shipping",
      price: 120,
      tax_lines: [{ shipping_method_id: IdMap.getId("expensiveShipping") }],
      provider_id: "default_provider",
      profile_id: IdMap.getId("default"),
      data: {
        extra: "hi",
      },
    }
    const calculateMock = jest.fn(() => Promise.resolve(20))
    const totalsService = new TotalsService({
      ...container,
      taxCalculationStrategy: {
        calculate: calculateMock,
      },
      featureFlagRouter: new FlagRouter({
        [TaxInclusivePricingFeatureFlag.key]: true,
      }),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calculates total with tax lines and being tax inclusive", async () => {
      const order = {
        object: "order",
        shipping_methods: [
          {
            ...shippingMethodData,
            includes_tax: true,
          },
        ],
      }

      const total = await totalsService.getShippingTotal(order)

      expect(total).toEqual(100)
    })

    it("calculates total with tax lines and not being tax inclusive", async () => {
      const order = {
        object: "order",
        shipping_methods: [
          {
            ...shippingMethodData,
            price: 100,
            includes_tax: false,
          },
        ],
      }

      const total = await totalsService.getShippingTotal(order)

      expect(total).toEqual(100)
    })

    it("calculates total with the old system and not being tax inclusive", async () => {
      const order = {
        object: "order",
        tax_rate: 20,
        shipping_methods: [
          {
            ...shippingMethodData,
            price: 100,
            includes_tax: false,
            tax_lines: [],
          },
        ],
      }

      const total = await totalsService.getShippingTotal(order)

      expect(total).toEqual(100)
    })
  })
})
