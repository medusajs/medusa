import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import OrderService from "../order"

describe("OrderService", () => {
  const totalsService = {
    getLineItemRefund: () => {},
    getTotal: o => {
      return o.total || 0
    },
    getRefundedTotal: o => {
      return o.refunded_total || 0
    },
    getShippingTotal: o => {
      return o.shipping_total || 0
    },
    getGiftCardTotal: o => {
      return o.gift_card_total || 0
    },
    getDiscountTotal: o => {
      return o.discount_total || 0
    },
    getTaxTotal: o => {
      return o.tax_total || 0
    },
    getSubtotal: o => {
      return o.subtotal || 0
    },
    getPaidTotal: o => {
      return o.paid_total || 0
    },
  }

  const eventBusService = {
    emit: jest.fn(),
    withTransaction: function() {
      return this
    },
  }

  describe("create", () => {
    const orderRepo = MockRepository({ create: f => f })
    const orderService = new OrderService({
      manager: MockManager,
      orderRepository: orderRepo,
      totalsService,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.create({
        email: "oliver@test.dk",
      })

      expect(orderRepo.create).toHaveBeenCalledTimes(1)
      expect(orderRepo.create).toHaveBeenCalledWith({
        email: "oliver@test.dk",
      })

      expect(orderRepo.save).toHaveBeenCalledWith({
        email: "oliver@test.dk",
      })
    })
  })

  describe("createFromCart", () => {
    const orderRepo = MockRepository({
      create: p => p,
      save: p => ({ ...p, id: "id" }),
    })
    const lineItemService = {
      update: jest.fn(),
      withTransaction: function() {
        return this
      },
    }
    const shippingOptionService = {
      updateShippingMethod: jest.fn(),
      withTransaction: function() {
        return this
      },
    }
    const giftCardService = {
      update: jest.fn(),
      createTransaction: jest.fn(),
      withTransaction: function() {
        return this
      },
    }
    const paymentProviderService = {
      getStatus: payment => {
        return Promise.resolve(payment.status || "authorized")
      },
      updatePayment: jest.fn(),
      withTransaction: function() {
        return this
      },
    }
    const emptyCart = {
      region: {},
      items: [],
      total: 0,
    }
    const cartService = {
      retrieve: jest.fn().mockImplementation(query => {
        if (query === "empty") {
          return Promise.resolve(emptyCart)
        }
        return Promise.resolve({
          id: "cart_id",
          email: "test@test.com",
          customer_id: "cus_1234",
          payment: {
            id: "testpayment",
            amount: 100,
            status: "authorized",
          },
          region_id: "test",
          region: {
            id: "test",
            currency_code: "eur",
            name: "test",
            tax_rate: 25,
          },
          shipping_address_id: "1234",
          billing_address_id: "1234",
          discounts: [],
          gift_cards: [],
          shipping_methods: [{ id: "method_1" }],
          items: [{ id: "item_1" }, { id: "item_2" }],
          total: 100,
        })
      }),
      withTransaction: function() {
        return this
      },
    }

    const discountService = {}
    const regionService = {}
    const orderService = new OrderService({
      manager: MockManager,
      orderRepository: orderRepo,
      lineItemService,
      giftCardService,
      paymentProviderService,
      shippingOptionService,
      totalsService,
      discountService,
      regionService,
      eventBusService,
      cartService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("fails when no items", async () => {
      const res = orderService.createFromCart("empty")
      await expect(res).rejects.toThrow("Cannot create order from empty cart")
    })

    it("calls order model functions", async () => {
      const cart = {
        id: "cart_id",
        email: "test@test.com",
        customer_id: "cus_1234",
        payment: {
          id: "testpayment",
          amount: 100,
          status: "authorized",
        },
        region_id: "test",
        region: {
          id: "test",
          currency_code: "eur",
          name: "test",
          tax_rate: 25,
        },
        shipping_address_id: "1234",
        billing_address_id: "1234",
        gift_cards: [],
        discounts: [],
        shipping_methods: [{ id: "method_1" }],
        items: [{ id: "item_1" }, { id: "item_2" }],
        total: 100,
      }

      orderService.cartService_.retrieve = jest.fn(() => Promise.resolve(cart))

      await orderService.createFromCart("cart_id")
      const order = {
        payment_status: "awaiting",
        email: cart.email,
        customer_id: cart.customer_id,
        shipping_methods: cart.shipping_methods,
        customer_id: "cus_1234",
        discounts: cart.discounts,
        billing_address_id: cart.billing_address_id,
        shipping_address_id: cart.shipping_address_id,
        region_id: cart.region_id,
        currency_code: "eur",
        cart_id: "cart_id",
        tax_rate: 25,
        gift_cards: [],
        metadata: {},
      }

      expect(cartService.retrieve).toHaveBeenCalledTimes(1)
      expect(cartService.retrieve).toHaveBeenCalledWith("cart_id", {
        select: ["subtotal", "total"],
        relations: [
          "region",
          "payment",
          "items",
          "discounts",
          "gift_cards",
          "shipping_methods",
        ],
      })

      expect(paymentProviderService.updatePayment).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.updatePayment).toHaveBeenCalledWith(
        "testpayment",
        {
          order_id: "id",
        }
      )

      expect(lineItemService.update).toHaveBeenCalledTimes(2)
      expect(lineItemService.update).toHaveBeenCalledWith("item_1", {
        order_id: "id",
      })
      expect(lineItemService.update).toHaveBeenCalledWith("item_2", {
        order_id: "id",
      })

      expect(orderRepo.create).toHaveBeenCalledTimes(1)
      expect(orderRepo.create).toHaveBeenCalledWith(order)
      expect(orderRepo.save).toHaveBeenCalledWith(order)
    })

    it("creates gift card transactions", async () => {
      const cart = {
        id: "cart_id",
        email: "test@test.com",
        customer_id: "cus_1234",
        payment: {
          id: "testpayment",
          amount: 100,
          status: "authorized",
        },
        region_id: "test",
        region: {
          id: "test",
          currency_code: "eur",
          name: "test",
          tax_rate: 25,
        },
        shipping_address_id: "1234",
        billing_address_id: "1234",
        gift_cards: [
          {
            id: "gid",
            code: "GC",
            balance: 80,
          },
        ],
        discounts: [],
        shipping_methods: [{ id: "method_1" }],
        items: [{ id: "item_1" }, { id: "item_2" }],
        subtotal: 100,
        total: 100,
      }

      orderService.cartService_.retrieve = () => {
        return Promise.resolve(cart)
      }

      await orderService.createFromCart("cart_id")
      const order = {
        payment_status: "awaiting",
        email: cart.email,
        customer_id: cart.customer_id,
        shipping_methods: cart.shipping_methods,
        customer_id: "cus_1234",
        discounts: cart.discounts,
        billing_address_id: cart.billing_address_id,
        shipping_address_id: cart.shipping_address_id,
        region_id: cart.region_id,
        currency_code: "eur",
        cart_id: "cart_id",
        tax_rate: 25,
        gift_cards: [
          {
            id: "gid",
            code: "GC",
            balance: 80,
          },
        ],
        metadata: {},
      }

      expect(giftCardService.update).toHaveBeenCalledTimes(1)
      expect(giftCardService.update).toHaveBeenCalledWith("gid", {
        balance: 0,
        disabled: true,
      })

      expect(giftCardService.createTransaction).toHaveBeenCalledTimes(1)
      expect(giftCardService.createTransaction).toHaveBeenCalledWith({
        gift_card_id: "gid",
        order_id: "id",
        amount: 80,
      })

      expect(paymentProviderService.updatePayment).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.updatePayment).toHaveBeenCalledWith(
        "testpayment",
        {
          order_id: "id",
        }
      )

      expect(lineItemService.update).toHaveBeenCalledTimes(2)
      expect(lineItemService.update).toHaveBeenCalledWith("item_1", {
        order_id: "id",
      })
      expect(lineItemService.update).toHaveBeenCalledWith("item_2", {
        order_id: "id",
      })

      expect(orderRepo.create).toHaveBeenCalledTimes(1)
      expect(orderRepo.create).toHaveBeenCalledWith(order)
      expect(orderRepo.save).toHaveBeenCalledWith(order)
    })

    it("creates cart with 0 total", async () => {
      const cart = {
        id: "cart_id",
        email: "test@test.com",
        customer_id: "cus_1234",
        payment: {
          id: "testpayment",
          amount: 100,
          status: "authorized",
        },
        region_id: "test",
        region: {
          id: "test",
          currency_code: "eur",
          name: "test",
          tax_rate: 25,
        },
        gift_cards: [],
        shipping_address_id: "1234",
        billing_address_id: "1234",
        discounts: [],
        shipping_methods: [{ id: "method_1" }],
        items: [{ id: "item_1" }, { id: "item_2" }],
        total: 0,
      }
      orderService.cartService_.retrieve = () => Promise.resolve(cart)
      await orderService.createFromCart(cart)
      const order = {
        payment_status: "awaiting",
        email: cart.email,
        customer_id: cart.customer_id,
        shipping_methods: cart.shipping_methods,
        customer_id: "cus_1234",
        discounts: cart.discounts,
        billing_address_id: cart.billing_address_id,
        shipping_address_id: cart.shipping_address_id,
        gift_cards: [],
        region_id: cart.region_id,
        currency_code: "eur",
        cart_id: "cart_id",
        tax_rate: 25,
        metadata: {},
      }
      expect(orderRepo.create).toHaveBeenCalledTimes(1)
      expect(orderRepo.create).toHaveBeenCalledWith(order)

      expect(lineItemService.update).toHaveBeenCalledTimes(2)
      expect(lineItemService.update).toHaveBeenCalledWith("item_1", {
        order_id: "id",
      })
      expect(lineItemService.update).toHaveBeenCalledWith("item_2", {
        order_id: "id",
      })

      expect(orderRepo.save).toHaveBeenCalledWith(order)
    })
  })

  describe("retrieve", () => {
    const orderRepo = MockRepository({
      findOneWithRelations: q => {
        return Promise.resolve({})
      },
    })
    const orderService = new OrderService({
      manager: MockManager,
      orderRepository: orderRepo,
      totalsService,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.retrieve(IdMap.getId("test-order"))
      expect(orderRepo.findOneWithRelations).toHaveBeenCalledTimes(1)
      expect(orderRepo.findOneWithRelations).toHaveBeenCalledWith(undefined, {
        where: { id: IdMap.getId("test-order") },
      })
    })
  })

  describe("retrieveByCartId", () => {
    const orderRepo = MockRepository({
      findOne: q => {
        return Promise.resolve({})
      },
    })
    const orderService = new OrderService({
      totalsService,
      manager: MockManager,
      orderRepository: orderRepo,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.retrieveByCartId(IdMap.getId("test-cart"))
      expect(orderRepo.findOne).toHaveBeenCalledTimes(1)
      expect(orderRepo.findOne).toHaveBeenCalledWith({
        where: { cart_id: IdMap.getId("test-cart") },
      })
    })
  })

  describe("update", () => {
    const orderRepo = MockRepository({
      findOneWithRelations: (rel, q) => {
        switch (q.where.id) {
          case IdMap.getId("fulfilled-order"):
            return Promise.resolve({
              fulfillment_status: "fulfilled",
              payment_status: "awaiting",
              status: "pending",
            })
          default:
            return Promise.resolve({
              fulfillment_status: "not_fulfilled",
              payment_status: "awaiting",
              status: "pending",
            })
        }
      },
    })
    const orderService = new OrderService({
      totalsService,
      manager: MockManager,
      orderRepository: orderRepo,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.update(IdMap.getId("test-order"), {
        email: "oliver@test.dk",
      })

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        email: "oliver@test.dk",
        fulfillment_status: "not_fulfilled",
        payment_status: "awaiting",
        status: "pending",
      })
    })

    it("throws if metadata update are attempted", async () => {
      await orderService.update(IdMap.getId("test-order"), {
        metadata: { test: "foo" },
      })
      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        metadata: { test: "foo" },
        fulfillment_status: "not_fulfilled",
        payment_status: "awaiting",
        status: "pending",
      })
    })

    it("throws if payment method update is attempted after fulfillment", async () => {
      await expect(
        orderService.update(IdMap.getId("fulfilled-order"), {
          payment: {
            provider_id: "test",
            profile_id: "test",
          },
        })
      ).rejects.toThrow(
        "Can't update shipping, billing, items and payment method when order is processed"
      )
    })

    it("throws if items update is attempted after fulfillment", async () => {
      await expect(
        orderService.update(IdMap.getId("fulfilled-order"), {
          items: [],
        })
      ).rejects.toThrow(
        "Can't update shipping, billing, items and payment method when order is processed"
      )
    })
  })

  describe("cancel", () => {
    const orderRepo = MockRepository({
      findOneWithRelations: (rel, q) => {
        switch (q.where.id) {
          case IdMap.getId("paid-order"):
            return Promise.resolve({
              fulfillment_status: "fulfilled",
              payment_status: "paid",
              status: "pending",
            })
          default:
            return Promise.resolve({
              fulfillment_status: "not_fulfilled",
              payment_status: "awaiting",
              status: "pending",
              fulfillments: [{ id: "fulfillment_test" }],
              payments: [{ id: "payment_test" }],
            })
        }
      },
    })

    const fulfillmentService = {
      cancelFulfillment: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

    const paymentProviderService = {
      cancelPayment: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

    const orderService = new OrderService({
      totalsService,
      manager: MockManager,
      orderRepository: orderRepo,
      paymentProviderService,
      fulfillmentService,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.cancel(IdMap.getId("not-fulfilled-order"))

      expect(paymentProviderService.cancelPayment).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.cancelPayment).toHaveBeenCalledWith({
        id: "payment_test",
      })

      expect(fulfillmentService.cancelFulfillment).toHaveBeenCalledTimes(1)
      expect(fulfillmentService.cancelFulfillment).toHaveBeenCalledWith({
        id: "fulfillment_test",
      })

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        fulfillment_status: "canceled",
        payment_status: "canceled",
        status: "canceled",
        fulfillments: [{ id: "fulfillment_test" }],
        payments: [{ id: "payment_test" }],
      })
    })

    it("throws if order payment is captured", async () => {
      await expect(
        orderService.cancel(IdMap.getId("paid-order"))
      ).rejects.toThrow("Can't cancel an order with a processed payment")
    })
  })

  describe("capturePayment", () => {
    const orderRepo = MockRepository({
      findOneWithRelations: (rel, q) => {
        switch (q.where.id) {
          case IdMap.getId("fail"):
            return Promise.resolve({
              payment_status: "awaiting",
              payments: [{ id: "payment_fail", captured_at: null }],
            })

          default:
            return Promise.resolve({
              fulfillment_status: "not_fulfilled",
              payment_status: "awaiting",
              status: "pending",
              fulfillments: [{ id: "fulfillment_test" }],
              payments: [{ id: "payment_test", captured_at: null }],
            })
        }
      },
    })

    const paymentProviderService = {
      capturePayment: jest
        .fn()
        .mockImplementation(p =>
          p.id === "payment_fail"
            ? Promise.reject()
            : Promise.resolve({ ...p, captured_at: "notnull" })
        ),
      withTransaction: function() {
        return this
      },
    }

    const orderService = new OrderService({
      manager: MockManager,
      orderRepository: orderRepo,
      paymentProviderService,
      totalsService,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.capturePayment("test-order")

      expect(paymentProviderService.capturePayment).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.capturePayment).toHaveBeenCalledWith({
        id: "payment_test",
        captured_at: null,
      })

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        fulfillment_status: "not_fulfilled",
        payment_status: "captured",
        status: "pending",
        fulfillments: [{ id: "fulfillment_test" }],
        payments: [{ id: "payment_test", captured_at: "notnull" }],
      })
    })

    it("sets requires action on failure", async () => {
      await orderService.capturePayment(IdMap.getId("fail"))

      expect(paymentProviderService.capturePayment).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.capturePayment).toHaveBeenCalledWith({
        id: "payment_fail",
        captured_at: null,
      })

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        payment_status: "requires_action",
        payments: [{ id: "payment_fail", captured_at: null }],
      })
    })
  })

  describe("createFulfillment", () => {
    const partialOrder = {
      fulfillments: [],
      shipping_methods: [{ id: "ship" }],
      items: [
        {
          id: "item_1",
          quantity: 2,
          fulfilled_quantity: 0,
        },
        {
          id: "item_2",
          quantity: 1,
          fulfilled_quantity: 0,
        },
      ],
    }

    const order = {
      fulfillments: [],
      shipping_methods: [{ id: "ship" }],
      items: [
        {
          id: "item_1",
          quantity: 2,
          fulfilled_quantity: 0,
        },
      ],
    }

    const orderRepo = MockRepository({
      findOneWithRelations: (rel, q) => {
        switch (q.where.id) {
          case "partial":
            return Promise.resolve(partialOrder)
          default:
            return Promise.resolve(order)
        }
      },
    })

    const lineItemService = {
      update: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

    const fulfillmentService = {
      createFulfillment: jest.fn().mockImplementation((o, i, m) => {
        return Promise.resolve([
          {
            items: i,
          },
        ])
      }),
      withTransaction: function() {
        return this
      },
    }

    const orderService = new OrderService({
      manager: MockManager,
      orderRepository: orderRepo,
      fulfillmentService,
      lineItemService,
      totalsService,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.createFulfillment("test-order", [
        {
          item_id: "item_1",
          quantity: 2,
        },
      ])

      expect(fulfillmentService.createFulfillment).toHaveBeenCalledTimes(1)
      expect(fulfillmentService.createFulfillment).toHaveBeenCalledWith(
        order,
        [
          {
            item_id: "item_1",
            quantity: 2,
          },
        ],
        { metadata: {}, order_id: "test-order" }
      )

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith("item_1", {
        fulfilled_quantity: 2,
      })

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        ...order,
        fulfillment_status: "fulfilled",
      })
    })

    it("sets partially fulfilled", async () => {
      await orderService.createFulfillment("partial", [
        {
          item_id: "item_1",
          quantity: 2,
        },
      ])

      expect(fulfillmentService.createFulfillment).toHaveBeenCalledTimes(1)
      expect(fulfillmentService.createFulfillment).toHaveBeenCalledWith(
        partialOrder,
        [
          {
            item_id: "item_1",
            quantity: 2,
          },
        ],
        { metadata: {}, order_id: "partial" }
      )

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith("item_1", {
        fulfilled_quantity: 2,
      })

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        ...partialOrder,
        fulfillment_status: "partially_fulfilled",
      })
    })

    it("sets partially fulfilled", async () => {
      await orderService.createFulfillment("test", [
        {
          item_id: "item_1",
          quantity: 1,
        },
      ])

      expect(fulfillmentService.createFulfillment).toHaveBeenCalledTimes(1)
      expect(fulfillmentService.createFulfillment).toHaveBeenCalledWith(
        order,
        [
          {
            item_id: "item_1",
            quantity: 1,
          },
        ],
        { metadata: {}, order_id: "test" }
      )

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith("item_1", {
        fulfilled_quantity: 1,
      })

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        ...order,
        fulfillment_status: "partially_fulfilled",
      })
    })
  })

  describe("registerReturnReceived", () => {
    const order = {
      items: [
        {
          id: "item_1",
          quantity: 10,
          returned_quantity: 10,
        },
      ],
      payments: [{ id: "payment_test", amount: 100 }],
      refunded_total: 0,
      paid_total: 100,
      refundable_amount: 100,
      total: 100,
    }
    const orderRepo = MockRepository({
      findOneWithRelations: (rel, q) => {
        switch (q.where.id) {
          default:
            return Promise.resolve(order)
        }
      },
    })

    const paymentProviderService = {
      refundPayment: jest
        .fn()
        .mockImplementation(p =>
          p.id === "payment_fail" ? Promise.reject() : Promise.resolve()
        ),
      withTransaction: function() {
        return this
      },
    }

    const orderService = new OrderService({
      manager: MockManager,
      orderRepository: orderRepo,
      paymentProviderService,
      totalsService,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.registerReturnReceived(IdMap.getId("order"), {
        id: IdMap.getId("good"),
        order_id: IdMap.getId("order"),
        status: "received",
        refund_amount: 100,
      })

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        ...order,
        fulfillment_status: "returned",
      })

      expect(paymentProviderService.refundPayment).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.refundPayment).toHaveBeenCalledWith(
        order.payments,
        100,
        "return"
      )
    })

    it("return with custom refund", async () => {
      await orderService.registerReturnReceived(
        IdMap.getId("order"),
        {
          id: IdMap.getId("good"),
          order_id: IdMap.getId("order"),
          status: "received",
          refund_amount: 95,
        },
        95
      )

      expect(paymentProviderService.refundPayment).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.refundPayment).toHaveBeenCalledWith(
        order.payments,
        95,
        "return"
      )
    })
  })

  describe("createShipment", () => {
    const partialOrder = {
      items: [
        {
          id: "item_1",
          quantity: 2,
          fulfilled_quantity: 0,
        },
        {
          id: "item_2",
          quantity: 1,
          fulfilled_quantity: 0,
        },
      ],
    }

    const order = {
      items: [
        {
          id: "item_1",
          quantity: 2,
          fulfilled_quantity: 0,
        },
      ],
    }

    const orderRepo = MockRepository({
      findOneWithRelations: (rel, q) => {
        switch (q.where.id) {
          case IdMap.getId("partial"):
            return Promise.resolve(partialOrder)
          default:
            return Promise.resolve(order)
        }
      },
    })

    const lineItemService = {
      update: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

    const fulfillmentService = {
      retrieve: () => Promise.resolve({ order_id: IdMap.getId("test") }),
      createShipment: jest
        .fn()
        .mockImplementation((shipmentId, tracking, meta) => {
          return Promise.resolve({
            items: [
              {
                item_id: "item_1",
                quantity: 2,
              },
            ],
          })
        }),
      withTransaction: function() {
        return this
      },
    }

    const orderService = new OrderService({
      manager: MockManager,
      orderRepository: orderRepo,
      totalsService,
      fulfillmentService,
      lineItemService,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.createShipment(
        IdMap.getId("test"),
        IdMap.getId("fulfillment"),
        [{ tracking_number: "1234" }, { tracking_number: "2345" }],
        {}
      )

      expect(fulfillmentService.createShipment).toHaveBeenCalledTimes(1)
      expect(fulfillmentService.createShipment).toHaveBeenCalledWith(
        IdMap.getId("fulfillment"),
        [{ tracking_number: "1234" }, { tracking_number: "2345" }],
        {}
      )

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        ...order,
        fulfillment_status: "shipped",
      })
    })
  })

  describe("createRefund", () => {
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const orderRepo = MockRepository({
      findOneWithRelations: (rel, q) => {
        if (q.where.id === IdMap.getId("cannot")) {
          return Promise.resolve({
            id: IdMap.getId("order"),
            payments: [
              {
                id: "payment",
              },
            ],
            total: 100,
            refunded_total: 100,
          })
        }

        return Promise.resolve({
          id: IdMap.getId("order_123"),
          payments: [
            {
              id: "payment",
            },
          ],
          total: 100,
          paid_total: 100,
          refundable_amount: 100,
          refunded_total: 0,
        })
      },
    })

    const paymentProviderService = {
      refundPayment: jest
        .fn()
        .mockImplementation(p => Promise.resolve({ id: "ref" })),
      withTransaction: function() {
        return this
      },
    }

    const orderService = new OrderService({
      manager: MockManager,
      orderRepository: orderRepo,
      paymentProviderService,
      totalsService,
      eventBusService,
    })

    it("success", async () => {
      await orderService.createRefund(
        IdMap.getId("order_123"),
        100,
        "discount",
        "note"
      )

      expect(paymentProviderService.refundPayment).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.refundPayment).toHaveBeenCalledWith(
        [{ id: "payment" }],
        100,
        "discount",
        "note"
      )
    })

    it("fails when refund is off", async () => {
      await expect(
        orderService.createRefund(
          IdMap.getId("cannot"),
          100,
          "discount",
          "note"
        )
      ).rejects.toThrow("Cannot refund more than the original order amount")
    })
  })
})
