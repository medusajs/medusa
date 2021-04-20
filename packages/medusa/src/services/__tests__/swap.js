import { IdMap, MockRepository, MockManager } from "medusa-test-utils"
import SwapService from "../swap"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function() {
    return this
  },
}

const generateOrder = (orderId, items, additional = {}) => {
  return {
    id: IdMap.getId(orderId),
    items: items.map(
      ({
        id,
        product_id,
        variant_id,
        fulfilled,
        returned,
        quantity,
        price,
      }) => ({
        id: IdMap.getId(id),
        variant_id: IdMap.getId(variant_id),
        variant: {
          id: IdMap.getId(variant_id),
          product: {
            id: IdMap.getId(product_id),
          },
        },
        unit_price: price,
        quantity,
        fulfilled_quantity: fulfilled || 0,
        returned_quantity: returned || 0,
      })
    ),
    ...additional,
  }
}

const testOrder = generateOrder(
  "test",
  [
    {
      id: "line",
      product_id: "product",
      variant_id: "variant",
      price: 100,
      quantity: 2,
      fulfilled: 1,
    },
  ],
  {
    fulfillment_status: "fulfilled",
    payment_status: "captured",
    currency_code: "dkk",
    region_id: IdMap.getId("region"),
    tax_rate: 0,
    shipping_address: {
      first_name: "test",
      last_name: "testson",
      address_1: "1800 test st",
      city: "testville",
      province: "test",
      country_code: "us",
      postal_code: "12345",
      phone: "+18001231234",
    },
  }
)

describe("SwapService", () => {
  describe("validateReturnItems_", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("fails if item is returned", async () => {
      const swapService = new SwapService({
        eventBusService,
      })
      const res = () =>
        swapService.validateReturnItems_(
          {
            items: [
              {
                id: IdMap.getId("line1"),
                quantity: 1,
                returned_quantity: 1,
              },
            ],
          },
          [{ item_id: IdMap.getId("line1"), quantity: 1 }]
        )

      expect(res).toThrow("Cannot return more items than have been ordered")
    })

    it("fails if item is returned", async () => {
      const swapService = new SwapService({})
      const res = () =>
        swapService.validateReturnItems_(
          {
            items: [
              {
                id: IdMap.getId("line1"),
                quantity: 1,
                returned_quantity: 1,
              },
            ],
          },
          [{ item_id: IdMap.getId("line2"), quantity: 1 }]
        )

      expect(res).toThrow("Item does not exist on order")
    })

    it("successfully resolves", async () => {
      const swapService = new SwapService({})
      const res = swapService.validateReturnItems_(
        {
          items: [
            {
              id: IdMap.getId("line1"),
              quantity: 1,
              returned_quantity: 0,
            },
          ],
        },
        [{ item_id: IdMap.getId("line1"), quantity: 1 }]
      )

      expect(res).toEqual([{ item_id: IdMap.getId("line1"), quantity: 1 }])
    })
  })

  describe("createCart", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("success", () => {
      const existing = {
        id: IdMap.getId("test-swap"),
        order_id: IdMap.getId("test"),
        order: testOrder,
        return_order: {
          id: IdMap.getId("return-swap"),
          test: "notreceived",
          refund_amount: 11,
          items: [{ item_id: IdMap.getId("line"), quantity: 1 }],
        },
        additional_items: [{ data: "lines", id: "test" }],
        other: "data",
      }

      const cartService = {
        create: jest.fn().mockReturnValue(Promise.resolve({ id: "cart" })),
        update: jest.fn().mockReturnValue(Promise.resolve()),
        withTransaction: function() {
          return this
        },
      }

      const swapRepo = MockRepository({
        findOne: () => Promise.resolve(existing),
      })

      const lineItemService = {
        create: jest.fn().mockImplementation(d => Promise.resolve(d)),
        update: jest.fn().mockImplementation(d => Promise.resolve(d)),
        withTransaction: function() {
          return this
        },
      }

      const swapService = new SwapService({
        manager: MockManager,
        eventBusService,
        swapRepository: swapRepo,
        cartService,
        lineItemService,
      })

      it("finds swap and calls return create cart", async () => {
        await swapService.createCart(IdMap.getId("swap-1"))

        expect(swapRepo.findOne).toHaveBeenCalledTimes(1)
        expect(swapRepo.findOne).toHaveBeenCalledWith({
          where: { id: IdMap.getId("swap-1") },
          relations: [
            "order",
            "order.items",
            "order.swaps",
            "order.swaps.additional_items",
            "order.discounts",
            "additional_items",
            "return_order",
            "return_order.items",
            "return_order.shipping_method",
          ],
        })

        expect(cartService.create).toHaveBeenCalledTimes(1)
        expect(cartService.create).toHaveBeenCalledWith({
          email: testOrder.email,
          discounts: testOrder.discounts,
          region_id: testOrder.region_id,
          customer_id: testOrder.customer_id,
          type: "swap",
          metadata: {
            swap_id: IdMap.getId("test-swap"),
            parent_order_id: IdMap.getId("test"),
          },
        })

        expect(cartService.create).toHaveBeenCalledTimes(1)
        // expect(cartService.update).toHaveBeenCalledTimes(1)

        expect(swapRepo.save).toHaveBeenCalledTimes(1)
        expect(swapRepo.save).toHaveBeenCalledWith({
          ...existing,
          cart_id: "cart",
        })
      })
    })

    describe("failure", () => {
      const existing = {
        return_order: {
          id: IdMap.getId("return-swap"),
          test: "notreceived",
          refund_amount: 11,
        },
        additional_items: [{ data: "lines" }],
        other: "data",
      }

      it("fails if cart already created", async () => {
        const swapRepo = MockRepository({
          findOne: () =>
            Promise.resolve({
              ...existing,
              order_id: IdMap.getId("test"),
              cart_id: IdMap.getId("swap-cart"),
            }),
        })
        const swapService = new SwapService({
          manager: MockManager,
          eventBusService,
          swapRepository: swapRepo,
        })
        const res = swapService.createCart(IdMap.getId("swap-1"))

        await expect(res).rejects.toThrow(
          "A cart has already been created for the swap"
        )
      })
    })
  })

  describe("create", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("success", () => {
      const lineItemService = {
        generate: jest
          .fn()
          .mockImplementation((variantId, regionId, quantity) => {
            return {
              unit_price: 100,
              variant_id: variantId,
              quantity,
            }
          }),
      }
      const swapRepo = MockRepository()
      const returnService = {
        create: jest.fn().mockReturnValue(Promise.resolve({ id: "ret" })),
        withTransaction: function() {
          return this
        },
      }

      const swapService = new SwapService({
        manager: MockManager,
        eventBusService,
        swapRepository: swapRepo,
        returnService,
        lineItemService,
      })

      it("generates lines items", async () => {
        await swapService.create(
          testOrder,
          [{ item_id: IdMap.getId("line"), quantity: 1 }],
          [{ variant_id: IdMap.getId("new-variant"), quantity: 1 }],
          {
            id: IdMap.getId("return-shipping"),
            price: 20,
          }
        )

        expect(lineItemService.generate).toHaveBeenCalledTimes(1)
        expect(lineItemService.generate).toHaveBeenCalledWith(
          IdMap.getId("new-variant"),
          IdMap.getId("region"),
          1
        )
      })

      it("creates swap", async () => {
        await swapService.create(
          testOrder,
          [{ item_id: IdMap.getId("line"), quantity: 1 }],
          [{ variant_id: IdMap.getId("new-variant"), quantity: 1 }],
          {
            id: IdMap.getId("return-shipping"),
            price: 20,
          }
        )

        expect(swapRepo.create).toHaveBeenCalledWith({
          order_id: IdMap.getId("test"),
          fulfillment_status: "not_fulfilled",
          payment_status: "not_paid",
          additional_items: [
            {
              unit_price: 100,
              variant_id: IdMap.getId("new-variant"),
              quantity: 1,
            },
          ],
        })

        expect(returnService.create).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe("receiveReturn", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("success", () => {
      const returnService = {
        receiveReturn: jest
          .fn()
          .mockReturnValue(Promise.resolve({ test: "received" })),
        withTransaction: function() {
          return this
        },
      }

      const existing = {
        order_id: IdMap.getId("test"),
        return_id: IdMap.getId("test"),
        return_order: {
          id: IdMap.getId("return-swap"),
          test: "notreceived",
          refund_amount: 11,
        },
        other: "data",
      }

      const swapRepo = MockRepository({
        findOne: () => Promise.resolve(existing),
      })
      const swapService = new SwapService({
        manager: MockManager,
        eventBusService,
        swapRepository: swapRepo,
        returnService,
      })

      it("calls register return and updates return value", async () => {
        await swapService.receiveReturn(IdMap.getId("swap"), [
          { item_id: IdMap.getId("1234"), quantity: 1 },
        ])

        expect(returnService.receiveReturn).toHaveBeenCalledTimes(1)
        expect(returnService.receiveReturn).toHaveBeenCalledWith(
          IdMap.getId("return-swap"),
          [{ item_id: IdMap.getId("1234"), quantity: 1 }],
          undefined,
          false
        )
      })
    })

    describe("failure", () => {
      const returnService = {
        receiveReturn: jest
          .fn()
          .mockReturnValue(Promise.resolve({ status: "requires_action" })),
        withTransaction: function() {
          return this
        },
      }

      const existing = {
        order_id: IdMap.getId("test"),
        return_id: IdMap.getId("return-swap"),
        return_order_id: IdMap.getId("return-swap"),
        return_order: { id: IdMap.getId("return-swap") },
        other: "data",
      }

      const swapRepo = MockRepository({
        findOne: q =>
          Promise.resolve(q.where.id === IdMap.getId("empty") ? {} : existing),
      })
      const swapService = new SwapService({
        manager: MockManager,
        eventBusService,
        swapRepository: swapRepo,
        returnService,
      })

      it("fails if swap has no return request", async () => {
        const res = swapService.receiveReturn(IdMap.getId("empty"), [])
        await expect(res).rejects.toThrow("Swap has no return request")
      })

      it("sets requires action if return fails", async () => {
        await swapService.receiveReturn(IdMap.getId("swap"), [
          { variant_id: IdMap.getId("1234"), quantity: 1 },
        ])

        expect(swapRepo.save).toHaveBeenCalledWith({
          ...existing,
          fulfillment_status: "requires_action",
        })

        expect(returnService.receiveReturn).toHaveBeenCalledTimes(1)
        expect(returnService.receiveReturn).toHaveBeenCalledWith(
          IdMap.getId("return-swap"),
          [{ variant_id: IdMap.getId("1234"), quantity: 1 }],
          undefined,
          false
        )
      })
    })
  })

  describe("createFulfillment", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("success", () => {
      const fulfillmentService = {
        createFulfillment: jest
          .fn()
          .mockReturnValue(
            Promise.resolve([
              { items: [{ item_id: "1234", quantity: 2 }], data: "new" },
            ])
          ),
        withTransaction: function() {
          return this
        },
      }

      const existing = {
        fulfillment_status: "not_fulfilled",
        order: testOrder,
        additional_items: [
          {
            id: "1234",
            quantity: 2,
          },
        ],
        shipping_methods: [{ method: "1" }],
        other: "data",
      }

      const lineItemService = {
        update: jest.fn(),
        withTransaction: function() {
          return this
        },
      }

      const swapRepo = MockRepository({
        findOne: () => Promise.resolve({ ...existing }),
      })
      const swapService = new SwapService({
        manager: MockManager,
        eventBusService,
        swapRepository: swapRepo,
        fulfillmentService,
        lineItemService,
      })

      it("creates a fulfillment", async () => {
        await swapService.createFulfillment(IdMap.getId("swap"))

        expect(lineItemService.update).toHaveBeenCalledTimes(1)
        expect(lineItemService.update).toHaveBeenCalledWith("1234", {
          fulfilled_quantity: 2,
        })

        expect(swapRepo.save).toHaveBeenCalledWith({
          ...existing,
          fulfillment_status: "fulfilled",
          fulfillments: [
            { items: [{ item_id: "1234", quantity: 2 }], data: "new" },
          ],
        })

        expect(fulfillmentService.createFulfillment).toHaveBeenCalledWith(
          {
            ...existing,
            email: testOrder.email,
            discounts: testOrder.discounts,
            currency_code: testOrder.currency_code,
            tax_rate: testOrder.tax_rate,
            region_id: testOrder.region_id,
            display_id: testOrder.display_id,
            is_swap: true,
            billing_address: testOrder.billing_address,
            items: existing.additional_items,
            shipping_methods: existing.shipping_methods,
          },
          [{ item_id: "1234", quantity: 2 }],
          { swap_id: IdMap.getId("swap"), metadata: {} }
        )
      })
    })

    describe("failure", () => {})
  })

  describe("createShipment", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("success", () => {
      const fulfillmentService = {
        createShipment: jest.fn().mockImplementation((o, f) => {
          return Promise.resolve({
            items: [
              {
                item_id: IdMap.getId("1234-1"),
                quantity: 2,
              },
            ],
            data: "new",
          })
        }),
        withTransaction: function() {
          return this
        },
      }

      const eventBusService = {
        emit: jest.fn().mockReturnValue(Promise.resolve()),
        withTransaction: function() {
          return this
        },
      }

      const existing = {
        fulfillment_status: "not_fulfilled",
        additional_items: [
          {
            id: IdMap.getId("1234-1"),
            quantity: 2,
            shipped_quantity: 0,
          },
        ],
        fulfillments: [
          {
            id: IdMap.getId("f1"),
            items: [
              {
                item_id: IdMap.getId("1234-1"),
                quantity: 2,
              },
            ],
          },
          {
            id: IdMap.getId("f2"),
            items: [
              {
                item_id: IdMap.getId("1234-2"),
                quantity: 2,
              },
            ],
          },
        ],
        shipping_methods: [{ method: "1" }],
        other: "data",
      }

      const lineItemService = {
        update: jest.fn(),
        withTransaction: function() {
          return this
        },
      }

      const swapRepo = MockRepository({
        findOne: () => Promise.resolve(existing),
      })

      const swapService = new SwapService({
        manager: MockManager,
        eventBusService,
        swapRepository: swapRepo,
        lineItemService,
        eventBusService,
        fulfillmentService,
      })

      it("creates a shipment", async () => {
        await swapService.createShipment(
          IdMap.getId("swap"),
          IdMap.getId("f1"),
          ["1234"],
          {}
        )

        expect(lineItemService.update).toHaveBeenCalledWith(
          IdMap.getId("1234-1"),
          {
            shipped_quantity: 2,
          }
        )

        expect(swapRepo.save).toHaveBeenCalledWith({
          ...existing,
          fulfillment_status: "shipped",
        })

        expect(fulfillmentService.createShipment).toHaveBeenCalledWith(
          IdMap.getId("f1"),
          ["1234"],
          {}
        )
      })
    })

    describe("failure", () => {})
  })

  describe("registerCartCompletion", () => {
    beforeEach(() => {
      jest.clearAllMocks()
      Date.now = jest.fn(() => 1572393600000)
    })

    describe("success", () => {
      const eventBusService = {
        emit: jest.fn().mockReturnValue(Promise.resolve()),
        withTransaction: function() {
          return this
        },
      }

      const totalsService = {
        getTotal: () => {
          return Promise.resolve(100)
        },
      }

      const shippingOptionService = {
        updateShippingMethod: () => {
          return Promise.resolve()
        },
        withTransaction: function() {
          return this
        },
      }

      const paymentProviderService = {
        getStatus: jest.fn(() => {
          return Promise.resolve("authorized")
        }),
        updatePayment: jest.fn(() => {
          return Promise.resolve()
        }),
        withTransaction: function() {
          return this
        },
      }

      const existing = {
        cart: {
          items: [{ id: "1" }],
          shipping_methods: [{ id: "method_1" }],
          payment: {
            good: "yes",
          },
          shipping_address_id: 1234,
        },
        other: "data",
      }

      const swapRepo = MockRepository({
        findOne: () => Promise.resolve(existing),
      })

      const swapService = new SwapService({
        manager: MockManager,
        eventBusService,
        swapRepository: swapRepo,
        totalsService,
        paymentProviderService,
        eventBusService,
        shippingOptionService,
      })

      it("creates a shipment", async () => {
        await swapService.registerCartCompletion(IdMap.getId("swap"))

        expect(paymentProviderService.getStatus).toHaveBeenCalledWith({
          good: "yes",
        })

        expect(swapRepo.save).toHaveBeenCalledWith({
          ...existing,
          difference_due: 100,
          shipping_address_id: 1234,
          confirmed_at: expect.anything(),
        })
      })
    })
  })

  describe("processDifference", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("success", () => {
      const eventBusService = {
        emit: jest.fn().mockReturnValue(Promise.resolve()),
        withTransaction: function() {
          return this
        },
      }

      const paymentProviderService = {
        capturePayment: jest.fn(g =>
          g.id === "good" ? Promise.resolve() : Promise.reject()
        ),
        refundPayment: jest.fn(g =>
          g[0].id === "good" ? Promise.resolve() : Promise.reject()
        ),
        withTransaction: function() {
          return this
        },
      }

      const existing = (dif, fail, conf = true) => ({
        confirmed_at: conf ? "1234" : null,
        difference_due: dif,
        payment: { id: fail ? "f" : "good" },
        order: {
          payments: [{ id: fail ? "f" : "good" }],
        },
      })

      const swapRepo = MockRepository({
        findOne: q => {
          switch (q.where.id) {
            case "refund":
              return Promise.resolve(existing(-1, false))
            case "refund_fail":
              return Promise.resolve(existing(-1, true))
            case "capture_fail":
              return Promise.resolve(existing(1, true))
            case "0":
              return Promise.resolve(existing(0, false))
            case "not_conf":
              return Promise.resolve(existing(1, false, false))
            default:
              return Promise.resolve(existing(1, false))
          }
        },
      })

      const swapService = new SwapService({
        manager: MockManager,
        eventBusService,
        swapRepository: swapRepo,
        paymentProviderService,
        eventBusService,
      })

      it("capture success", async () => {
        await swapService.processDifference(IdMap.getId("swap"))
        expect(paymentProviderService.capturePayment).toHaveBeenCalledWith({
          id: "good",
        })
        expect(swapRepo.save).toHaveBeenCalledWith({
          ...existing(1, false),
          payment_status: "captured",
        })
      })

      it("capture fail", async () => {
        await swapService.processDifference("capture_fail")
        expect(paymentProviderService.capturePayment).toHaveBeenCalledWith({
          id: "f",
        })
        expect(swapRepo.save).toHaveBeenCalledWith({
          ...existing(1, true),
          payment_status: "requires_action",
        })
      })

      it("refund success", async () => {
        await swapService.processDifference("refund")
        expect(paymentProviderService.refundPayment).toHaveBeenCalledWith(
          [
            {
              id: "good",
            },
          ],
          1,
          "swap"
        )
        expect(swapRepo.save).toHaveBeenCalledWith({
          ...existing(-1, false),
          payment_status: "difference_refunded",
        })
      })

      it("refund fail", async () => {
        await swapService.processDifference("refund_fail")

        expect(paymentProviderService.refundPayment).toHaveBeenCalledWith(
          [
            {
              id: "f",
            },
          ],
          1,
          "swap"
        )
        expect(swapRepo.save).toHaveBeenCalledWith({
          ...existing(-1, true),
          payment_status: "requires_action",
        })
      })

      it("zero", async () => {
        await swapService.processDifference("0")
        expect(swapRepo.save).toHaveBeenCalledWith({
          ...existing(0, false),
          payment_status: "difference_refunded",
        })
      })

      it("not confirmed", async () => {
        await expect(swapService.processDifference("not_conf")).rejects.toThrow(
          "Cannot process a swap that hasn't been confirmed by the customer"
        )
      })
    })

    describe("registerReceived", () => {
      beforeEach(async () => {
        jest.clearAllMocks()
      })

      const eventBusService = {
        emit: jest.fn().mockReturnValue(Promise.resolve()),
        withTransaction: function() {
          return this
        },
      }

      const swapRepo = MockRepository({
        findOne: q => {
          switch (q.where.id) {
            case "requested":
              return Promise.resolve({
                id: "requested",
                order_id: IdMap.getId("order"),
                return_order: { status: "requested" },
              })
            case "received":
              return Promise.resolve({
                id: "received",
                order_id: IdMap.getId("order"),
                return_order: { status: "received" },
              })
            default:
              return Promise.resolve()
          }
        },
      })

      const swapService = new SwapService({
        manager: MockManager,
        swapRepository: swapRepo,
        eventBusService,
      })

      it("fails if swap doesn't have status received", async () => {
        const res = swapService.registerReceived("requested")
        await expect(res).rejects.toThrow("Swap is not received")
      })

      it("registers a swap as received", async () => {
        await swapService.registerReceived("received")

        expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      })
    })
  })
})
