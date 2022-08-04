import { IdMap, MockManager } from "medusa-test-utils"
import { ITaxCalculationStrategy } from "../../interfaces"
import { AllocationType, DiscountRuleType } from "../../models"
import TaxProviderService from "../tax-provider"
import TotalsService from "../totals"

import {
  lineItemRepositoryMock,
  orderRepositoryMock,
  cartRepositoryMock,
  discountRepositoryMock,
} from "../../repositories/__mocks__"

const discounts = {
  total10Percent: discountRepositoryMock.create({
    code: "10%OFF",
    rule: {
      type: DiscountRuleType.PERCENTAGE,
      allocation: AllocationType.TOTAL,
      value: 10,
    },
    regions: [{ id: "fr" }],
  }),
  item2Fixed: discountRepositoryMock.create({
    code: "MEDUSA",
    rule: {
      type: DiscountRuleType.FIXED,
      allocation: AllocationType.ITEM,
      value: 2,
      // TODO: Add conditions relation
    },
    regions: [{ id: "fr" }],
  }),
  item10Percent: discountRepositoryMock.create({
    code: "MEDUSA",
    rule: {
      type: DiscountRuleType.PERCENTAGE,
      allocation: AllocationType.ITEM,
      value: 10,
      // TODO: Add conditions relation
    },
    regions: [{ id: "fr" }],
  }),
  total10Fixed: discountRepositoryMock.create({
    code: "MEDUSA",
    rule: {
      type: DiscountRuleType.FIXED,
      allocation: AllocationType.TOTAL,
      value: 10,
      // TODO: Add conditions relation
    },
    regions: [{ id: "fr" }],
  }),
  expiredDiscount: discountRepositoryMock.create({
    code: "MEDUSA",
    ends_at: new Date("December 17, 1995 03:24:00"),
    rule: {
      type: DiscountRuleType.FIXED,
      allocation: AllocationType.ITEM,
      value: 10,
      // TODO: Add conditions relation
    },
    regions: [{ id: "fr" }],
  }),
}

const applyDiscount = (cart, discount) => {
  const newCart = { ...cart }
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

  const lineItemPrice = lineItem.unit_price * lineItem.quantity

  if (discount.rule.type === "fixed" && discount.rule.allocation === "total") {
    const subtotal = cart.items.reduce(
      (total, item) => total + item.unit_price * item.quantity,
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
  const container = {
    taxProviderService: {
      withTransaction: function () {
        return this
      },
    } as unknown as TaxProviderService,
    taxCalculationStrategy: {} as ITaxCalculationStrategy,
    manager: MockManager,
  }

  describe("getAllocationItemDiscounts", () => {
    let res

    const totalsService = new TotalsService(container)

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calculates item with percentage discount", async () => {
      const cart = cartRepositoryMock.create({
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
      })

      const discount = discountRepositoryMock.create({
        rule: {
          type: DiscountRuleType.PERCENTAGE,
          value: 10,
        },
      })

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
      const cart = cartRepositoryMock.create({
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
      })

      const discount = discountRepositoryMock.create({
        rule: {
          type: DiscountRuleType.FIXED,
          value: 9,
          // TODO: Add conditions relation
        },
      })

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

    const discountCart = cartRepositoryMock.create({
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
    })

    beforeEach(() => {
      jest.clearAllMocks()
      discountCart.discounts = []
    })

    it("calculate total percentage discount", async () => {
      discountCart.discounts.push(discounts.total10Percent)
      const cart = applyDiscount(discountCart, discounts.total10Percent)
      res = totalsService.getDiscountTotal(cart)

      expect(res).toEqual(28)
    })

    // TODO: Redo tests to include new line item adjustments

    it("calculate item fixed discount", async () => {
      discountCart.discounts.push(discounts.item2Fixed)
      const cart = applyDiscount(discountCart, discounts.item2Fixed)
      res = totalsService.getDiscountTotal(cart)

      expect(res).toEqual(40)
    })

    it("calculate item percentage discount", async () => {
      discountCart.discounts.push(discounts.item10Percent)
      const cart = applyDiscount(discountCart, discounts.item10Percent)
      res = totalsService.getDiscountTotal(cart)

      expect(res).toEqual(28)
    })

    it("calculate total fixed discount", async () => {
      discountCart.discounts.push(discounts.total10Fixed)
      const cart = applyDiscount(discountCart, discounts.total10Fixed)
      res = totalsService.getDiscountTotal(cart)

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
      const emptyCart = cartRepositoryMock.create({
        items: [],
        discounts: [discounts.total10Fixed],
      })
      res = totalsService.getDiscountTotal(emptyCart)

      expect(res).toEqual(0)
    })
  })

  describe("getRefundTotal", () => {
    let res
    const totalsService = new TotalsService(container)
    const orderToRefund = orderRepositoryMock.create({
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
    })

    beforeEach(() => {
      jest.clearAllMocks()
      orderToRefund.discounts = []
    })

    it("calculates refund", async () => {
      res = totalsService.getRefundTotal(orderToRefund, [
        lineItemRepositoryMock.create({
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
        }),
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
      const order = applyDiscount(orderToRefund, discounts.item2Fixed)
      res = totalsService.getRefundTotal(order, [
        lineItemRepositoryMock.create({
          id: "line2",
          unit_price: 100,
          allow_discounts: true,
          variant: {
            id: "variant",
            product_id: "testp2",
          },
          quantity: 10,
          returned_quantity: 0,
        }),
      ])

      expect(res).toEqual(1225)
    })

    it("calculates refund with item percentage discount", async () => {
      orderToRefund.discounts.push(discounts.item10Percent)
      const order = applyDiscount(orderToRefund, discounts.item10Percent)
      res = totalsService.getRefundTotal(order, [
        lineItemRepositoryMock.create({
          id: "line2",
          unit_price: 100,
          allow_discounts: true,
          variant: {
            id: "variant",
            product_id: "testp2",
          },
          quantity: 10,
          returned_quantity: 0,
        }),
      ])

      expect(res).toEqual(1125)
    })

    it("throws if line items to return is not in order", async () => {
      const work = (): number =>
        totalsService.getRefundTotal(orderToRefund, [
          lineItemRepositoryMock.create({
            id: "notInOrder",
            unit_price: 123,
            allow_discounts: true,
            variant: {
              id: "variant",
              product_id: "pid",
            },
            quantity: 1,
          }),
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
      const order = cartRepositoryMock.create({
        shipping_methods: [
          {
            price: 100,
          },
        ],
      })
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
        withTransaction: function () {
          return this
        },
        getTaxLines: getTaxLinesMock,
      } as unknown as TaxProviderService,
      taxCalculationStrategy: {
        calculate: calculateMock,
      } as ITaxCalculationStrategy,
      manager: MockManager,
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
      const order = cartRepositoryMock.create({
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
            price: 100,
          },
        ],
      })
      const getTaxTotalMock = jest.fn(() => Promise.resolve(35))
      totalsService.getTaxTotal = getTaxTotalMock
      res = await totalsService.getTotal(order)

      expect(getTaxTotalMock).toHaveBeenCalledTimes(1)
      expect(getTaxTotalMock).toHaveBeenCalledWith(order, undefined)

      expect(res).toEqual(175)
    })
  })
})
