import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import OrderService from "../order"

describe("OrderService", () => {
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
    const orderRepo = MockRepository({ create: p => p })
    const paymentProviderService = {
      getStatus: payment => {
        return Promise.resolve(payment.status || "authorized")
      },
    }
    const totalsService = {
      getTotal: cart => {
        return Promise.resolve(cart.total || 0)
      },
    }
    const cartService = {
      retrieve: jest.fn().mockImplementation(query => {
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
      paymentProviderService,
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
      const cart = {
        region: {},
        items: [],
      }
      const res = orderService.createFromCart(cart)
      expect(res).rejects.toThrow("Cannot create order from empty cart")
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
        discounts: [],
        shipping_methods: [{ id: "method_1" }],
        items: [{ id: "item_1" }, { id: "item_2" }],
        total: 100,
      }

      await orderService.createFromCart("cart_id")
      const order = {
        email: cart.email,
        customer_id: cart.customer_id,
        shipping_methods: cart.shipping_methods,
        payments: [cart.payment],
        customer_id: "cus_1234",
        discounts: cart.discounts,
        items: cart.items,
        billing_address_id: cart.billing_address_id,
        shipping_address_id: cart.shipping_address_id,
        region_id: cart.region_id,
        currency_code: "eur",
        cart_id: "cart_id",
        tax_rate: 25,
        metadata: {},
      }
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
        shipping_address_id: "1234",
        billing_address_id: "1234",
        discounts: [],
        shipping_methods: [{ id: "method_1" }],
        items: [{ id: "item_1" }, { id: "item_2" }],
        total: 0,
      }
      await orderService.createFromCart(cart)
      const order = {
        email: cart.email,
        customer_id: cart.customer_id,
        shipping_methods: cart.shipping_methods,
        payments: [cart.payment],
        customer_id: "cus_1234",
        discounts: cart.discounts,
        items: cart.items,
        billing_address_id: cart.billing_address_id,
        shipping_address_id: cart.shipping_address_id,
        region_id: cart.region_id,
        currency_code: "eur",
        cart_id: "cart_id",
        tax_rate: 25,
        metadata: {},
      }
      expect(orderRepo.create).toHaveBeenCalledTimes(1)
      expect(orderRepo.create).toHaveBeenCalledWith(order)
      expect(orderRepo.save).toHaveBeenCalledWith(order)
    })
  })

  describe("retrieve", () => {
    const orderRepo = MockRepository({
      findOne: q => {
        return Promise.resolve({})
      },
    })
    const orderService = new OrderService({
      manager: MockManager,
      orderRepository: orderRepo,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.retrieve(IdMap.getId("test-order"))
      expect(orderRepo.findOne).toHaveBeenCalledTimes(1)
      expect(orderRepo.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("test-order") },
        relations: [],
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
        relations: [],
      })
    })
  })

  describe("update", () => {
    const orderRepo = MockRepository({
      findOne: q => {
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
      findOne: q => {
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

    const fulfillmentProviderService = {
      cancelFulfillment: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

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
      manager: MockManager,
      orderRepository: orderRepo,
      paymentProviderService,
      fulfillmentProviderService,
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
      findOne: q => {
        switch (q.where.id) {
          case IdMap.getId("fail"):
            return Promise.resolve({
              payment_status: "awaiting",
              payments: [{ id: "payment_fail" }],
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

    const paymentProviderService = {
      capturePayment: jest
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
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.capturePayment(IdMap.getId("test-order"))

      expect(paymentProviderService.capturePayment).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.capturePayment).toHaveBeenCalledWith({
        id: "payment_test",
      })

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        fulfillment_status: "not_fulfilled",
        payment_status: "captured",
        status: "pending",
        fulfillments: [{ id: "fulfillment_test" }],
        payments: [{ id: "payment_test" }],
      })
    })

    it("sets requires action on failure", async () => {
      await orderService.capturePayment(IdMap.getId("fail"))

      expect(paymentProviderService.capturePayment).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.capturePayment).toHaveBeenCalledWith({
        id: "payment_fail",
      })

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        payment_status: "requires_action",
        payments: [{ id: "payment_fail" }],
      })
    })
  })

  describe("createFulfillment", () => {
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
      findOne: q => {
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
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.createFulfillment(IdMap.getId("test-order"), [
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
        {}
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
      await orderService.createFulfillment(IdMap.getId("partial"), [
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
        {}
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
      await orderService.createFulfillment(IdMap.getId("test"), [
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
        {}
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

  describe("receiveReturn", () => {
    const order = {
      items: [
        {
          id: "item_1",
          quantity: 10,
          returned_quantity: 0,
        },
      ],
      payments: [{ id: "payment_test" }],
    }
    const orderRepo = MockRepository({
      findOne: q => {
        switch (q.where.id) {
          default:
            return Promise.resolve(order)
        }
      },
    })

    const returnService = {
      retrieve: () => {
        return Promise.resolve({
          order_id: IdMap.getId("order"),
        })
      },
      receiveReturn: jest
        .fn()
        .mockImplementation((id, items, amount, mism) =>
          id === IdMap.getId("good")
            ? Promise.resolve({ items, status: "received", refund_amount: 100 })
            : Promise.resolve({ status: "requires_action" })
        ),
      withTransaction: function() {
        return this
      },
    }

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

    const lineItemService = {
      update: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

    const orderService = new OrderService({
      manager: MockManager,
      orderRepository: orderRepo,
      paymentProviderService,
      returnService,
      lineItemService,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      const items = [
        {
          item_id: "item_1",
          quantity: 10,
        },
      ]
      await orderService.receiveReturn(
        IdMap.getId("order"),
        IdMap.getId("good"),
        items
      )

      expect(returnService.receiveReturn).toHaveBeenCalledTimes(1)
      expect(returnService.receiveReturn).toHaveBeenCalledWith(
        IdMap.getId("good"),
        items,
        undefined,
        false
      )

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith("item_1", {
        returned_quantity: 10,
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
      const items = [
        {
          item_id: IdMap.getId("existingLine"),
          quantity: 10,
        },
      ]
      await orderService.receiveReturn(
        IdMap.getId("order"),
        IdMap.getId("good"),
        items,
        102
      )

      expect(returnService.receiveReturn).toHaveBeenCalledTimes(1)
      expect(returnService.receiveReturn).toHaveBeenCalledWith(
        IdMap.getId("good"),
        items,
        102,
        false
      )
    })

    it("calls order model functions and sets partially_returned", async () => {
      const items = [
        {
          item_id: IdMap.getId("existingLine"),
          quantity: 2,
        },
      ]
      await orderService.receiveReturn(
        IdMap.getId("order"),
        IdMap.getId("good"),
        items
      )

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        ...order,
        fulfillment_status: "partially_returned",
      })
    })

    it("sets requires_action on additional items", async () => {
      await orderService.receiveReturn(
        IdMap.getId("order"),
        IdMap.getId("action"),
        [
          {
            item_id: IdMap.getId("existingLine2"),
            quantity: 2,
          },
        ]
      )

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        ...order,
        fulfillment_status: "requires_action",
      })
    })
  })

  describe("requestReturn", () => {
    const order = {
      items: [
        {
          id: "item_1",
          quantity: 10,
          returned_quantity: 0,
        },
      ],
      payments: [{ id: "payment_test" }],
    }
    const orderRepo = MockRepository({
      findOne: q => {
        switch (q.where.id) {
          default:
            return Promise.resolve(order)
        }
      },
    })

    const returnService = {
      requestReturn: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

    const orderService = new OrderService({
      manager: MockManager,
      orderRepository: orderRepo,
      returnService,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully creates return request", async () => {
      const items = [
        {
          item_id: IdMap.getId("existingLine"),
          quantity: 10,
        },
      ]
      const shipping_method = {
        id: IdMap.getId("return-shipping"),
        price: 2,
      }
      await orderService.requestReturn(
        IdMap.getId("processed-order"),
        items,
        shipping_method
      )

      expect(returnService.requestReturn).toHaveBeenCalledTimes(1)
      expect(returnService.requestReturn).toHaveBeenCalledWith(
        order,
        items,
        shipping_method,
        undefined
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
      findOne: q => {
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
        ["1234", "2345"],
        {}
      )

      expect(fulfillmentService.createShipment).toHaveBeenCalledTimes(1)
      expect(fulfillmentService.createShipment).toHaveBeenCalledWith(
        IdMap.getId("fulfillment"),
        ["1234", "2345"],
        {}
      )

      expect(orderRepo.save).toHaveBeenCalledTimes(1)
      expect(orderRepo.save).toHaveBeenCalledWith({
        ...order,
        fulfillment_status: "shipped",
      })
    })
  })

  describe("registerSwapReceived", () => {
    beforeEach(async () => {
      jest.clearAllMocks()
    })
    const orderRepo = MockRepository({
      findOne: jest
        .fn()
        .mockReturnValue(Promise.resolve({ id: IdMap.getId("order") })),
    })

    it("fails if order/swap relationship not satisfied", async () => {
      const swapService = {
        retrieve: jest
          .fn()
          .mockReturnValue(
            Promise.resolve({ id: "1235", order_id: IdMap.getId("order_1") })
          ),
      }

      const orderService = new OrderService({
        manager: MockManager,
        orderRepository: orderRepo,
        swapService,
        eventBusService,
      })

      const res = orderService.registerSwapReceived(
        IdMap.getId("order"),
        "1235"
      )
      await expect(res).rejects.toThrow("Swap must belong to the given order")
    })

    it("fails if swap doesn't have status received", async () => {
      const swapService = {
        retrieve: jest.fn().mockReturnValue(
          Promise.resolve({
            _id: "1235",
            order_id: IdMap.getId("order"),
            return: { status: "requested" },
          })
        ),
      }
      const orderService = new OrderService({
        manager: MockManager,
        orderRepository: orderRepo,
        swapService,
        eventBusService: { emit: jest.fn().mockReturnValue(Promise.resolve()) },
      })

      const res = orderService.registerSwapReceived(
        IdMap.getId("order"),
        "1235"
      )
      await expect(res).rejects.toThrow("Swap is not received")
    })

    it("registers a swap as received", async () => {
      const orderRepo = MockRepository({
        findOne: jest.fn().mockReturnValue(
          Promise.resolve({
            id: IdMap.getId("order_123"),
            items: [
              {
                id: IdMap.getId("1234"),
                returned_quantity: 0,
                quantity: 1,
              },
            ],
          })
        ),
      })

      const swapService = {
        retrieve: jest.fn().mockReturnValue(
          Promise.resolve({
            id: "1235",
            order_id: IdMap.getId("order_123"),
            return: {
              status: "received",
              items: [{ item_id: IdMap.getId("1234"), quantity: 1 }],
            },
          })
        ),
      }

      const lineItemService = {
        update: jest.fn(),
        withTransaction: function() {
          return this
        },
      }

      const orderService = new OrderService({
        manager: MockManager,
        orderRepository: orderRepo,
        swapService,
        lineItemService,
        eventBusService,
      })

      await orderService.registerSwapReceived(IdMap.getId("order_123"), "1235")

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith(IdMap.getId("1234"), {
        returned_quantity: 1,
      })
    })
  })

  describe("createRefund", () => {
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const orderRepo = MockRepository({
      findOne: jest.fn().mockImplementation(q => {
        if (q.where.id === IdMap.getId("cannot")) {
          return Promise.resolve({
            id: IdMap.getId("order"),
            payments: [
              {
                id: "payment",
              },
            ],
            total: 100,
            refunded: 100,
          })
        }

        return Promise.resolve({
          id: IdMap.getId("order"),
          payments: [
            {
              id: "payment",
            },
          ],
          total: 100,
          refuneded: 0,
        })
      }),
    })

    const paymentProviderService = {
      refundPayment: jest.fn().mockImplementation(p => Promise.resolve()),
      withTransaction: function() {
        return this
      },
    }

    const totalsService = {
      getTotal: o => {
        return Promise.resolve(o.total || 100)
      },
      getRefundedTotal: o => {
        return o.refunded || 0
      },
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
