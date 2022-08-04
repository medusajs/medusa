import { IdMap, MockRepository, MockManager } from "medusa-test-utils"

import SwapService from "../swap"
import { InventoryServiceMock } from "../__mocks__/inventory"
import { LineItemAdjustmentServiceMock } from "../__mocks__/line-item-adjustment"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function () {
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
    no_notification: true,
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
        swapService.validateReturnItems(
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
        swapService.validateReturnItems(
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
      const res = swapService.validateReturnItems(
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
        retrieve: jest
          .fn()
          .mockReturnValue(
            Promise.resolve({ id: "cart", items: [{ id: "test-item" }] })
          ),
        update: jest.fn().mockReturnValue(Promise.resolve()),
        withTransaction: function () {
          return this
        },
      }

      const swapRepo = MockRepository({
        findOneWithRelations: () => Promise.resolve(existing),
      })

      const customShippingOptionService = {
        create: jest.fn().mockReturnValue(Promise.resolve({ id: "cso-test" })),
        update: jest.fn().mockReturnValue(Promise.resolve()),
        withTransaction: function () {
          return this
        },
      }

      const lineItemService = {
        create: jest.fn().mockImplementation((d) => Promise.resolve(d)),
        update: jest.fn().mockImplementation((d) => Promise.resolve(d)),
        retrieve: () => Promise.resolve({}),
        createReturnLines: jest.fn(() => Promise.resolve()),
        withTransaction: function () {
          return this
        },
      }

      const swapService = new SwapService({
        manager: MockManager,
        eventBusService,
        swapRepository: swapRepo,
        cartService,
        lineItemService,
        customShippingOptionService,
        lineItemAdjustmentService: LineItemAdjustmentServiceMock,
      })

      it("finds swap and calls return create cart", async () => {
        await swapService.createCart(IdMap.getId("swap-1"), [
          { option_id: "test-option", price: 10 },
        ])

        expect(swapRepo.findOneWithRelations).toHaveBeenCalledTimes(1)
        expect(swapRepo.findOneWithRelations).toHaveBeenCalledWith(
          [
            "order",
            "order.items",
            "order.swaps",
            "order.swaps.additional_items",
            "order.discounts",
            "order.discounts.rule",
            "order.claims",
            "order.claims.additional_items",
            "additional_items",
            "additional_items.variant",
            "return_order",
            "return_order.items",
            "return_order.shipping_method",
            "return_order.shipping_method.tax_lines",
          ],
          {
            where: { id: IdMap.getId("swap-1") },
          }
        )

        expect(lineItemService.createReturnLines).toHaveBeenCalledTimes(1)
        expect(lineItemService.createReturnLines).toHaveBeenCalledWith(
          expect.any(String),
          "cart"
        )

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

        expect(lineItemService.update).toHaveBeenCalledTimes(1)
        expect(lineItemService.update).toHaveBeenCalledWith("test", {
          cart_id: "cart",
        })

        expect(
          LineItemAdjustmentServiceMock.createAdjustmentForLineItem
        ).toHaveBeenCalledTimes(1)
        expect(
          LineItemAdjustmentServiceMock.createAdjustmentForLineItem
        ).toHaveBeenCalledWith(
          { id: "cart" },
          {
            id: "test",
            data: "lines",
          }
        )

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

      const swapRepo = MockRepository({
        findOneWithRelations: (_, query) => {
          switch (query.where.id) {
            case IdMap.getId("canceled"):
              return Promise.resolve({
                canceled_at: new Date(),
              })
            default:
              return Promise.resolve({
                ...existing,
                order_id: IdMap.getId("test"),
                cart_id: IdMap.getId("swap-cart"),
              })
          }
        },
      })

      const swapService = new SwapService({
        manager: MockManager,
        eventBusService,
        swapRepository: swapRepo,
      })

      it("fails if cart already created", async () => {
        const res = swapService.createCart(IdMap.getId("swap-1"))

        await expect(res).rejects.toThrow(
          "A cart has already been created for the swap"
        )
      })

      it("fails if swap is canceled", async () => {
        await expect(
          swapService.createCart(IdMap.getId("canceled"))
        ).rejects.toThrow("Canceled swap cannot be used to create a cart")
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
        retrieve: () => Promise.resolve({}),
      }
      const swapRepo = MockRepository()
      const returnService = {
        create: jest.fn().mockReturnValue(Promise.resolve({ id: "ret" })),
        withTransaction: function () {
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
          no_notification: true,
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

      it.each([
        [true, true],
        [false, false],
        [undefined, true],
      ])(
        "passes correct no_notification to eventBus with %s",
        async (input, expected) => {
          await swapService.create(
            testOrder,
            [{ item_id: IdMap.getId("line"), quantity: 1 }],
            [{ variant_id: IdMap.getId("new-variant"), quantity: 1 }],
            {
              id: IdMap.getId("return-shipping"),
              price: 20,
            },
            { no_notification: input }
          )

          expect(eventBusService.emit).toHaveBeenCalledWith(
            expect.any(String),
            { id: undefined, no_notification: expected }
          )
        }
      )
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
        withTransaction: function () {
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
        retrieve: () => Promise.resolve({}),
        withTransaction: function () {
          return this
        },
      }

      const swapRepo = MockRepository({
        findOneWithRelations: () => Promise.resolve({ ...existing }),
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

    describe("failure", () => {
      const swapRepo = MockRepository({
        findOneWithRelations: () =>
          Promise.resolve({
            canceled_at: new Date(),
          }),
      })
      const swapService = new SwapService({
        manager: MockManager,
        swapRepository: swapRepo,
      })

      it("fails when swap has been canceled", async () => {
        await expect(
          swapService.createFulfillment(IdMap.getId("swap"), {})
        ).rejects.toThrow("Canceled swap cannot be fulfilled")
      })
    })
  })

  describe("cancelFulfillment", () => {
    const swapRepo = MockRepository({
      findOneWithRelations: () => Promise.resolve({}),
      save: (f) => Promise.resolve(f),
    })

    const fulfillmentService = {
      cancelFulfillment: jest.fn().mockImplementation((f) => {
        switch (f) {
          case IdMap.getId("no-swap"):
            return Promise.resolve({})
          default:
            return Promise.resolve({
              swap_id: IdMap.getId("swap-id"),
            })
        }
      }),
      withTransaction: function () {
        return this
      },
    }

    const swapService = new SwapService({
      manager: MockManager,
      swapRepository: swapRepo,
      fulfillmentService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully cancels fulfillment and corrects swap status", async () => {
      await swapService.cancelFulfillment(IdMap.getId("swap"))

      expect(fulfillmentService.cancelFulfillment).toHaveBeenCalledTimes(1)
      expect(fulfillmentService.cancelFulfillment).toHaveBeenCalledWith(
        IdMap.getId("swap")
      )

      expect(swapRepo.save).toHaveBeenCalledTimes(1)
      expect(swapRepo.save).toHaveBeenCalledWith({
        fulfillment_status: "canceled",
      })
    })

    it("fails to cancel fulfillment when not related to a swap", async () => {
      await expect(
        swapService.cancelFulfillment(IdMap.getId("no-swap"))
      ).rejects.toThrow(`Fufillment not related to a swap`)
    })
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
        withTransaction: function () {
          return this
        },
      }

      const eventBusService = {
        emit: jest.fn().mockReturnValue(Promise.resolve()),
        withTransaction: function () {
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
        retrieve: () => Promise.resolve({}),
        withTransaction: function () {
          return this
        },
      }

      const cartService = {
        update: jest.fn(),
        retrieve: jest
          .fn()
          .mockReturnValue(
            Promise.resolve({ id: "cart", items: [{ id: "test-item" }] })
          ),
        withTransaction: function () {
          return this
        },
      }

      const swapRepo = MockRepository({
        findOneWithRelations: () => Promise.resolve(existing),
      })

      const swapService = new SwapService({
        manager: MockManager,
        eventBusService,
        swapRepository: swapRepo,
        lineItemService,
        fulfillmentService,
        cartService,
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

    describe("failure", () => {
      const swapRepo = MockRepository({
        findOneWithRelations: () =>
          Promise.resolve({ canceled_at: new Date() }),
      })

      const swapService = new SwapService({
        manager: MockManager,
        swapRepository: swapRepo,
      })

      it("fails when swap is canceled", async () => {
        await expect(
          swapService.createShipment(
            IdMap.getId("swap", IdMap.getId("fulfillment"), [], {})
          )
        ).rejects.toThrow("Canceled swap cannot be fulfilled as shipped")
      })
    })
  })

  describe("registerCartCompletion", () => {
    beforeEach(() => {
      jest.clearAllMocks()
      Date.now = jest.fn(() => 1572393600000)
    })

    const eventBusService = {
      emit: jest.fn().mockReturnValue(Promise.resolve()),
      withTransaction: function () {
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
      withTransaction: function () {
        return this
      },
    }

    const cartService = {
      retrieve: jest.fn().mockReturnValue(
        Promise.resolve({
          id: "cart",
          items: [{ id: "test-item", variant_id: "variant" }],
        })
      ),
      update: () => {
        return Promise.resolve()
      },
      withTransaction: function () {
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
      cancelPayment: jest.fn(() => {
        return Promise.resolve()
      }),
      withTransaction: function () {
        return this
      },
    }

    const inventoryService = {
      ...InventoryServiceMock,
      withTransaction: function () {
        return this
      },
    }

    describe("success", () => {
      const cart = {
        items: [{ id: "1", variant_id: "variant", quantity: 2 }],
        shipping_methods: [{ id: "method_1" }],
        payment: {
          good: "yes",
        },
        shipping_address_id: 1234,
        total: 1,
      }
      const existing = {
        other: "data",
      }

      cartService.retrieve = () => cart

      const swapRepo = MockRepository({
        findOneWithRelations: () => Promise.resolve(existing),
      })

      const swapService = new SwapService({
        manager: MockManager,
        eventBusService,
        swapRepository: swapRepo,
        totalsService,
        cartService,
        paymentProviderService,
        shippingOptionService,
        inventoryService,
      })

      it("creates a shipment", async () => {
        await swapService.registerCartCompletion(IdMap.getId("swap"))

        expect(paymentProviderService.getStatus).toHaveBeenCalledWith({
          good: "yes",
        })

        expect(inventoryService.confirmInventory).toHaveBeenCalledWith(
          "variant",
          2
        )
        expect(inventoryService.adjustInventory).toHaveBeenCalledWith(
          "variant",
          -2
        )

        expect(swapRepo.save).toHaveBeenCalledWith({
          ...existing,
          difference_due: 1,
          shipping_address_id: 1234,
          confirmed_at: expect.anything(),
        })
      })
    })

    describe("failure", () => {
      const existing = {
        cart: {
          items: [{ id: "1", variant_id: "variant", quantity: 25 }],
          shipping_methods: [{ id: "method_1" }],
          payment: {
            good: "yes",
          },
          shipping_address_id: 1234,
        },
        other: "data",
      }

      const swapRepo = MockRepository({
        findOneWithRelations: (rels, q) => {
          switch (q.where.id) {
            case IdMap.getId("canceled"):
              return Promise.resolve({ canceled_at: new Date() })
            default:
              return Promise.resolve(existing)
          }
        },
      })

      const swapService = new SwapService({
        manager: MockManager,
        swapRepo: swapRepo,
        eventBusService,
        swapRepository: swapRepo,
        totalsService,
        cartService,
        paymentProviderService,
        shippingOptionService,
        inventoryService,
      })

      it("fails to register cart completion when swap is canceled", async () => {
        await expect(
          swapService.registerCartCompletion(IdMap.getId("canceled"))
        ).rejects.toThrow("Cart related to canceled swap cannot be completed")
      })
      it("throws an error because inventory is to low", async () => {
        try {
          await swapService.registerCartCompletion(IdMap.getId("swap"))
        } catch (e) {
          expect(e.message).toEqual(
            `Variant with id: variant does not have the required inventory`
          )
        }
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
        withTransaction: function () {
          return this
        },
      }

      const paymentProviderService = {
        capturePayment: jest.fn((g) =>
          g.id === "good" ? Promise.resolve() : Promise.reject()
        ),
        refundPayment: jest.fn((g) =>
          g[0].id === "good" ? Promise.resolve() : Promise.reject()
        ),
        withTransaction: function () {
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
        findOneWithRelations: (rels, q) => {
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
            case "canceled":
              return Promise.resolve({ canceled_at: new Date() })
            default:
              return Promise.resolve(existing(1, false))
          }
        },
      })

      const swapService = new SwapService({
        manager: MockManager,
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

      it("fails as swap is canceled", async () => {
        await expect(swapService.processDifference("canceled")).rejects.toThrow(
          "Canceled swap cannot be processed"
        )
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
        withTransaction: function () {
          return this
        },
      }

      const swapRepo = MockRepository({
        findOneWithRelations: (rels, q) => {
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
            case "canceled":
              return Promise.resolve({
                canceled_at: new Date(),
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

      it("fails to register as received when swap is canceled", async () => {
        await expect(swapService.registerReceived("canceled")).rejects.toThrow(
          "Canceled swap cannot be registered as received"
        )
      })
    })
  })

  describe("cancel", () => {
    const now = new Date()
    const payment = { id: IdMap.getId("payment") }
    const return_order = { status: "canceled" }
    const fulfillment = { canceled_at: now }

    const paymentProviderService = {
      cancelPayment: jest.fn(() => Promise.resolve({})),
      withTransaction: function () {
        return this
      },
    }

    const swapRepo = MockRepository({
      findOneWithRelations: (_, q) => {
        const swap = {
          payment: { ...payment },
          return_order: { ...return_order },
          fulfillments: [{ ...fulfillment }, { ...fulfillment }],
        }
        switch (q.where.id) {
          case IdMap.getId("fail-fulfillment"):
            swap.fulfillments[1].canceled_at = undefined
            return Promise.resolve(swap)
          case IdMap.getId("fail-return"):
            swap.return_order.status = "received"
            return Promise.resolve(swap)
          case IdMap.getId("fail-refund-1"):
            swap.payment_status = "difference_refunded"
            return Promise.resolve(swap)
          case IdMap.getId("fail-refund-2"):
            swap.payment_status = "partially_refunded"
            return Promise.resolve(swap)
          case IdMap.getId("fail-refund-3"):
            swap.payment_status = "refunded"
            return Promise.resolve(swap)
          default:
            return Promise.resolve(swap)
        }
      },
      save: (f) => f,
    })

    const swapService = new SwapService({
      manager: MockManager,
      swapRepository: swapRepo,
      paymentProviderService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully cancels valid swap", async () => {
      await swapService.cancel(IdMap.getId("complete"))

      expect(swapRepo.save).toHaveBeenCalledTimes(1)
      expect(swapRepo.save).toHaveBeenCalledWith({
        payment_status: "canceled",
        fulfillment_status: "canceled",
        canceled_at: expect.any(Date),
        fulfillments: expect.anything(),
        payment: expect.anything(),
        return_order: expect.anything(),
      })
      expect(paymentProviderService.cancelPayment).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.cancelPayment).toHaveBeenCalledWith({
        id: IdMap.getId("payment"),
      })
    })

    it("fails to cancel swap when fulfillment not canceled", async () => {
      await expect(
        swapService.cancel(IdMap.getId("fail-fulfillment"))
      ).rejects.toThrow(
        "All fulfillments must be canceled before the swap can be canceled"
      )
    })

    it("fails to cancel swap when return not canceled", async () => {
      await expect(
        swapService.cancel(IdMap.getId("fail-return"))
      ).rejects.toThrow(
        "Return must be canceled before the swap can be cancele"
      )
    })

    it.each([["fail-refund-1"], ["fail-refund-2"], ["fail-refund-3"]])(
      "fails to cancel swap when contains refund",
      async (input) => {
        await expect(swapService.cancel(IdMap.getId(input))).rejects.toThrow(
          "Swap with a refund cannot be canceled"
        )
      }
    )
  })
})
