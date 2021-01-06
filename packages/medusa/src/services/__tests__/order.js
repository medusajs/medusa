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

      expect(
        fulfillmentProviderService.cancelFulfillment
      ).toHaveBeenCalledTimes(1)
      expect(fulfillmentProviderService.cancelFulfillment).toHaveBeenCalledWith(
        {
          id: "fulfillment_test",
        }
      )

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
    const returnService = new ReturnService({
      totalsService: TotalsServiceMock,
      shippingOptionService: ShippingOptionServiceMock,
      fulfillmentProviderService: FulfillmentProviderServiceMock,
    })
    const orderService = new OrderService({
      orderModel: OrderModelMock,
      returnService,
      shippingOptionService: ShippingOptionServiceMock,
      fulfillmentProviderService: FulfillmentProviderServiceMock,
      paymentProviderService: PaymentProviderServiceMock,
      totalsService: TotalsServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.receiveReturn(
        IdMap.getId("returned-order"),
        IdMap.getId("return"),
        [
          {
            item_id: IdMap.getId("existingLine"),
            quantity: 10,
          },
        ]
      )

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("returned-order") },
        {
          $push: {
            refunds: {
              amount: 1228,
            },
          },
          $set: {
            returns: [
              {
                _id: IdMap.getId("return"),
                status: "received",
                documents: ["doc1234"],
                shipping_method: {
                  _id: IdMap.getId("return-shipping"),
                  is_return: true,
                  name: "Return Shipping",
                  region_id: IdMap.getId("region-france"),
                  profile_id: IdMap.getId("default-profile"),
                  data: {
                    id: "return_shipment",
                  },
                  price: 2,
                  provider_id: "default_provider",
                },
                shipping_data: {
                  id: "return_shipment",
                  shipped: true,
                },
                items: [
                  {
                    item_id: IdMap.getId("existingLine"),
                    content: {
                      unit_price: 123,
                      variant: {
                        _id: IdMap.getId("can-cover"),
                      },
                      product: {
                        _id: IdMap.getId("validId"),
                      },
                      quantity: 1,
                    },
                    is_requested: true,
                    is_registered: true,
                    quantity: 10,
                    requested_quantity: 10,
                  },
                ],
                refund_amount: 1228,
              },
            ],
            items: [
              {
                _id: IdMap.getId("existingLine"),
                content: {
                  product: {
                    _id: IdMap.getId("validId"),
                  },
                  quantity: 1,
                  unit_price: 123,
                  variant: {
                    _id: IdMap.getId("can-cover"),
                  },
                },
                description: "This is a new line",
                quantity: 10,
                returned_quantity: 10,
                thumbnail: "test-img-yeah.com/thumb",
                title: "merge line",
                returned: true,
              },
            ],
            fulfillment_status: "returned",
          },
        }
      )

      expect(DefaultProviderMock.refundPayment).toHaveBeenCalledTimes(1)
      expect(DefaultProviderMock.refundPayment).toHaveBeenCalledWith(
        { hi: "hi" },
        1228
      )
    })

    //  it("return with custom refund", async () => {
    //    await orderService.receiveReturn(
    //      IdMap.getId("returned-order"),
    //      IdMap.getId("return"),
    //      [
    //        {
    //          item_id: IdMap.getId("existingLine"),
    //          quantity: 10,
    //        },
    //      ],
    //      102
    //    )

    //    expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
    //    expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
    //      { _id: IdMap.getId("returned-order") },
    //      {
    //        $push: {
    //          refunds: {
    //            amount: 102,
    //          },
    //        },
    //        $set: {
    //          items: [
    //            {
    //              _id: IdMap.getId("existingLine"),
    //              content: {
    //                product: {
    //                  _id: IdMap.getId("validId"),
    //                },
    //                quantity: 1,
    //                unit_price: 123,
    //                variant: {
    //                  _id: IdMap.getId("can-cover"),
    //                },
    //              },
    //              description: "This is a new line",
    //              quantity: 10,
    //              returned_quantity: 10,
    //              thumbnail: "test-img-yeah.com/thumb",
    //              title: "merge line",
    //              returned: true,
    //            },
    //          ],
    //          returns: [
    //            {
    //              documents: ["doc1234"],
    //              _id: IdMap.getId("return"),
    //              status: "received",
    //              shipping_method: {
    //                _id: IdMap.getId("return-shipping"),
    //                is_return: true,
    //                name: "Return Shipping",
    //                region_id: IdMap.getId("region-france"),
    //                profile_id: IdMap.getId("default-profile"),
    //                data: {
    //                  id: "return_shipment",
    //                },
    //                price: 2,
    //                provider_id: "default_provider",
    //              },
    //              shipping_data: {
    //                id: "return_shipment",
    //                shipped: true,
    //              },
    //              items: [
    //                {
    //                  item_id: IdMap.getId("existingLine"),
    //                  content: {
    //                    unit_price: 123,
    //                    variant: {
    //                      _id: IdMap.getId("can-cover"),
    //                    },
    //                    product: {
    //                      _id: IdMap.getId("validId"),
    //                    },
    //                    quantity: 1,
    //                  },
    //                  is_requested: true,
    //                  is_registered: true,
    //                  quantity: 10,
    //                  requested_quantity: 10,
    //                },
    //              ],
    //              refund_amount: 102,
    //            },
    //          ],
    //          fulfillment_status: "returned",
    //        },
    //      }
    //    )

    //    expect(DefaultProviderMock.refundPayment).toHaveBeenCalledTimes(1)
    //    expect(DefaultProviderMock.refundPayment).toHaveBeenCalledWith(
    //      { hi: "hi" },
    //      102
    //    )
    //  })

    //  it("calls order model functions and sets partially_returned", async () => {
    //    await orderService.receiveReturn(
    //      IdMap.getId("order-refund"),
    //      IdMap.getId("return"),
    //      [
    //        {
    //          item_id: IdMap.getId("existingLine"),
    //          quantity: 2,
    //        },
    //      ]
    //    )

    //    expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
    //    expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
    //      { _id: IdMap.getId("order-refund") },
    //      {
    //        $push: {
    //          refunds: {
    //            amount: 246,
    //          },
    //        },
    //        $set: {
    //          returns: [
    //            {
    //              _id: IdMap.getId("return"),
    //              status: "received",
    //              shipping_method: {
    //                _id: IdMap.getId("return-shipping"),
    //                is_return: true,
    //                name: "Return Shipping",
    //                region_id: IdMap.getId("region-france"),
    //                profile_id: IdMap.getId("default-profile"),
    //                data: {
    //                  id: "return_shipment",
    //                },
    //                price: 2,
    //                provider_id: "default_provider",
    //              },
    //              documents: ["doc1234"],
    //              shipping_data: {
    //                id: "return_shipment",
    //                shipped: true,
    //              },
    //              items: [
    //                {
    //                  item_id: IdMap.getId("existingLine"),
    //                  content: {
    //                    unit_price: 100,
    //                    variant: {
    //                      _id: IdMap.getId("can-cover"),
    //                    },
    //                    product: {
    //                      _id: IdMap.getId("product"),
    //                    },
    //                    quantity: 1,
    //                  },
    //                  is_requested: true,
    //                  is_registered: true,
    //                  requested_quantity: 2,
    //                  quantity: 2,
    //                  metadata: {},
    //                },
    //              ],
    //              refund_amount: 246,
    //            },
    //          ],
    //          items: [
    //            {
    //              _id: IdMap.getId("existingLine"),
    //              content: {
    //                product: {
    //                  _id: IdMap.getId("product"),
    //                },
    //                quantity: 1,
    //                unit_price: 100,
    //                variant: {
    //                  _id: IdMap.getId("eur-8-us-10"),
    //                },
    //              },
    //              description: "This is a new line",
    //              quantity: 10,
    //              returned: false,
    //              returned_quantity: 2,
    //              thumbnail: "test-img-yeah.com/thumb",
    //              title: "merge line",
    //            },
    //            {
    //              _id: IdMap.getId("existingLine2"),
    //              title: "merge line",
    //              description: "This is a new line",
    //              thumbnail: "test-img-yeah.com/thumb",
    //              content: {
    //                unit_price: 100,
    //                variant: {
    //                  _id: IdMap.getId("can-cover"),
    //                },
    //                product: {
    //                  _id: IdMap.getId("product"),
    //                },
    //                quantity: 1,
    //              },
    //              quantity: 10,
    //              returned_quantity: 0,
    //              metadata: {},
    //            },
    //          ],
    //          fulfillment_status: "partially_returned",
    //        },
    //      }
    //    )
    //  })

    //  it("sets requires_action on additional items", async () => {
    //    await orderService.receiveReturn(
    //      IdMap.getId("order-refund"),
    //      IdMap.getId("return"),
    //      [
    //        {
    //          item_id: IdMap.getId("existingLine"),
    //          quantity: 2,
    //        },
    //        {
    //          item_id: IdMap.getId("existingLine2"),
    //          quantity: 2,
    //        },
    //      ]
    //    )

    //    const originalReturn = orders.orderToRefund.returns[0]
    //    const toSet = {
    //      ...originalReturn,
    //      status: "requires_action",
    //      items: [
    //        ...originalReturn.items.map((i, index) => ({
    //          ...i,
    //          requested_quantity: i.quantity,
    //          is_requested: index === 0,
    //          is_registered: true,
    //        })),
    //        {
    //          item_id: IdMap.getId("existingLine2"),
    //          content: {
    //            unit_price: 100,
    //            variant: {
    //              _id: IdMap.getId("can-cover"),
    //            },
    //            product: {
    //              _id: IdMap.getId("product"),
    //            },
    //            quantity: 1,
    //          },
    //          is_requested: false,
    //          is_registered: true,
    //          quantity: 2,
    //          metadata: {},
    //        },
    //      ],
    //    }

    //    expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
    //    expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
    //      { _id: IdMap.getId("order-refund"), "returns._id": originalReturn._id },
    //      {
    //        $set: {
    //          "returns.$": toSet,
    //        },
    //      }
    //    )
    //  })

    //  it("sets requires_action on unmatcing quantities", async () => {
    //    await orderService.receiveReturn(
    //      IdMap.getId("order-refund"),
    //      IdMap.getId("return"),
    //      [
    //        {
    //          item_id: IdMap.getId("existingLine"),
    //          quantity: 1,
    //        },
    //      ]
    //    )

    //    const originalReturn = orders.orderToRefund.returns[0]
    //    const toSet = {
    //      ...originalReturn,
    //      status: "requires_action",
    //      items: originalReturn.items.map(i => ({
    //        ...i,
    //        requested_quantity: i.quantity,
    //        quantity: 1,
    //        is_requested: false,
    //        is_registered: true,
    //      })),
    //    }

    //    expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
    //    expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
    //      { _id: IdMap.getId("order-refund"), "returns._id": originalReturn._id },
    //      {
    //        $set: {
    //          "returns.$": toSet,
    //        },
    //      }
    //    )
    //  })
  })

  //describe("requestReturn", () => {
  //  const returnService = new ReturnService({
  //    totalsService: TotalsServiceMock,
  //    shippingOptionService: ShippingOptionServiceMock,
  //    fulfillmentProviderService: FulfillmentProviderServiceMock,
  //  })
  //  const orderService = new OrderService({
  //    orderModel: OrderModelMock,
  //    returnService,
  //    shippingOptionService: ShippingOptionServiceMock,
  //    fulfillmentProviderService: FulfillmentProviderServiceMock,
  //    paymentProviderService: PaymentProviderServiceMock,
  //    totalsService: TotalsServiceMock,
  //    eventBusService: EventBusServiceMock,
  //  })

  //  beforeEach(async () => {
  //    jest.clearAllMocks()
  //  })

  //  it("successfully creates return request", async () => {
  //    const items = [
  //      {
  //        item_id: IdMap.getId("existingLine"),
  //        quantity: 10,
  //      },
  //    ]
  //    const shipping_method = {
  //      id: IdMap.getId("return-shipping"),
  //      price: 2,
  //    }
  //    await orderService.requestReturn(
  //      IdMap.getId("processed-order"),
  //      items,
  //      shipping_method
  //    )

  //    expect(FulfillmentProviderMock.createReturn).toHaveBeenCalledTimes(1)
  //    expect(FulfillmentProviderMock.createReturn).toHaveBeenCalledWith(
  //      {
  //        id: "return_shipment",
  //      },
  //      [
  //        {
  //          _id: IdMap.getId("existingLine"),
  //          title: "merge line",
  //          description: "This is a new line",
  //          thumbnail: "test-img-yeah.com/thumb",
  //          returned_quantity: 0,
  //          content: {
  //            unit_price: 123,
  //            variant: {
  //              _id: IdMap.getId("can-cover"),
  //            },
  //            product: {
  //              _id: IdMap.getId("validId"),
  //            },
  //            quantity: 1,
  //          },
  //          quantity: 10,
  //        },
  //      ],
  //      orders.processedOrder
  //    )

  //    expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
  //    expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
  //      { _id: IdMap.getId("processed-order") },
  //      {
  //        $push: {
  //          returns: {
  //            shipping_method: {
  //              _id: IdMap.getId("return-shipping"),
  //              is_return: true,
  //              name: "Return Shipping",
  //              region_id: IdMap.getId("region-france"),
  //              profile_id: IdMap.getId("default-profile"),
  //              data: {
  //                id: "return_shipment",
  //              },
  //              price: 2,
  //              provider_id: "default_provider",
  //            },
  //            shipping_data: {
  //              id: "return_shipment",
  //              shipped: true,
  //            },
  //            items: [
  //              {
  //                item_id: IdMap.getId("existingLine"),
  //                content: {
  //                  unit_price: 123,
  //                  variant: {
  //                    _id: IdMap.getId("can-cover"),
  //                  },
  //                  product: {
  //                    _id: IdMap.getId("validId"),
  //                  },
  //                  quantity: 1,
  //                },
  //                is_requested: true,
  //                quantity: 10,
  //              },
  //            ],
  //            refund_amount: 1228,
  //          },
  //        },
  //      }
  //    )
  //  })

  //  it("sets correct shipping method", async () => {
  //    const items = [
  //      {
  //        item_id: IdMap.getId("existingLine"),
  //        quantity: 10,
  //      },
  //    ]
  //    await orderService.requestReturn(IdMap.getId("processed-order"), items)

  //    expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
  //    expect(
  //      OrderModelMock.updateOne.mock.calls[0][1].$push.returns.refund_amount
  //    ).toEqual(1230)
  //  })

  //  it("throws if payment is already processed", async () => {
  //    await expect(
  //      orderService.requestReturn(IdMap.getId("fulfilled-order"), [])
  //    ).rejects.toThrow("Can't return an order with payment unprocessed")
  //  })

  //  it("throws if return is attempted on unfulfilled order", async () => {
  //    await expect(
  //      orderService.requestReturn(IdMap.getId("not-fulfilled-order"), [])
  //    ).rejects.toThrow("Can't return an unfulfilled or already returned order")
  //  })
  //})

  //describe("createShipment", () => {
  //  const fulfillmentService = new FulfillmentService({
  //    fulfillmentProviderService: FulfillmentProviderServiceMock,
  //    shippingProfileService: ShippingProfileServiceMock,
  //    totalsService: TotalsServiceMock,
  //  })
  //  const orderService = new OrderService({
  //    orderModel: OrderModelMock,
  //    fulfillmentProviderService: FulfillmentProviderServiceMock,
  //    fulfillmentService,
  //    eventBusService: EventBusServiceMock,
  //  })

  //  beforeEach(async () => {
  //    jest.clearAllMocks()
  //  })

  //  it("calls order model functions", async () => {
  //    await orderService.createShipment(
  //      IdMap.getId("shippedOrder"),
  //      IdMap.getId("fulfillment"),
  //      ["1234", "2345"],
  //      {}
  //    )

  //    expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
  //    expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
  //      {
  //        _id: IdMap.getId("shippedOrder"),
  //        "fulfillments._id": IdMap.getId("fulfillment"),
  //      },
  //      {
  //        $set: {
  //          "fulfillments.$": {
  //            _id: IdMap.getId("fulfillment"),
  //            provider_id: "default_provider",
  //            tracking_numbers: ["1234", "2345"],
  //            data: {},
  //            items: [
  //              {
  //                _id: IdMap.getId("existingLine"),
  //                content: {
  //                  product: {
  //                    _id: IdMap.getId("validId"),
  //                  },
  //                  quantity: 1,
  //                  unit_price: 123,
  //                  variant: {
  //                    _id: IdMap.getId("can-cover"),
  //                  },
  //                },
  //                description: "This is a new line",
  //                fulfilled_quantity: 10,
  //                quantity: 10,
  //                thumbnail: "test-img-yeah.com/thumb",
  //                title: "merge line",
  //              },
  //            ],
  //            shipped_at: expect.anything(),
  //            metadata: {},
  //          },
  //          items: [
  //            {
  //              _id: IdMap.getId("existingLine"),
  //              content: {
  //                product: {
  //                  _id: IdMap.getId("validId"),
  //                },
  //                quantity: 1,
  //                unit_price: 123,
  //                variant: {
  //                  _id: IdMap.getId("can-cover"),
  //                },
  //              },
  //              description: "This is a new line",
  //              shipped: true,
  //              fulfilled_quantity: 10,
  //              shipped_quantity: 10,
  //              quantity: 10,
  //              thumbnail: "test-img-yeah.com/thumb",
  //              title: "merge line",
  //            },
  //          ],
  //          fulfillment_status: "shipped",
  //        },
  //      }
  //    )
  //  })

  //  it("throws if order is unprocessed", async () => {
  //    try {
  //      await orderService.archive(IdMap.getId("test-order"))
  //    } catch (error) {
  //      expect(error.message).toEqual("Can't archive an unprocessed order")
  //    }
  //  })
  //})

  //describe("registerSwapCreated", () => {
  //  beforeEach(async () => {
  //    jest.clearAllMocks()
  //  })
  //  const orderModel = {
  //    findOne: jest
  //      .fn()
  //      .mockReturnValue(Promise.resolve({ _id: IdMap.getId("order") })),
  //    updateOne: jest.fn().mockReturnValue(Promise.resolve()),
  //  }

  //  it("adds a swap to an order", async () => {
  //    const swapService = {
  //      retrieve: jest
  //        .fn()
  //        .mockReturnValue(
  //          Promise.resolve({ _id: "1235", order_id: IdMap.getId("order") })
  //        ),
  //    }
  //    const orderService = new OrderService({
  //      swapService,
  //      orderModel,
  //      eventBusService: { emit: jest.fn().mockReturnValue(Promise.resolve()) },
  //    })

  //    const res = orderService.registerSwapCreated(IdMap.getId("order"), "1235")
  //    expect(res).resolves

  //    await res
  //    expect(orderModel.updateOne).toHaveBeenCalledWith(
  //      {
  //        _id: IdMap.getId("order"),
  //      },
  //      {
  //        $addToSet: { swaps: "1235" },
  //      }
  //    )
  //  })

  //  it("fails if order/swap relationship is not satisfied", async () => {
  //    const swapService = {
  //      retrieve: jest
  //        .fn()
  //        .mockReturnValue(
  //          Promise.resolve({ _id: "1235", order_id: IdMap.getId("order_1") })
  //        ),
  //    }
  //    const orderService = new OrderService({
  //      swapService,
  //      orderModel,
  //      eventBusService: { emit: jest.fn().mockReturnValue(Promise.resolve()) },
  //    })

  //    const res = orderService.registerSwapCreated(IdMap.getId("order"), "1235")
  //    expect(res).rejects.toThrow("Swap must belong to the given order")
  //  })
  //})

  //describe("registerSwapReceived", () => {
  //  beforeEach(async () => {
  //    jest.clearAllMocks()
  //  })
  //  const orderModel = {
  //    findOne: jest
  //      .fn()
  //      .mockReturnValue(Promise.resolve({ _id: IdMap.getId("order") })),
  //    updateOne: jest.fn().mockReturnValue(Promise.resolve()),
  //  }

  //  it("fails if order/swap relationship not satisfied", async () => {
  //    const swapService = {
  //      retrieve: jest
  //        .fn()
  //        .mockReturnValue(
  //          Promise.resolve({ _id: "1235", order_id: IdMap.getId("order_1") })
  //        ),
  //    }
  //    const orderService = new OrderService({
  //      swapService,
  //      orderModel,
  //      eventBusService: { emit: jest.fn().mockReturnValue(Promise.resolve()) },
  //    })

  //    const res = orderService.registerSwapReceived(
  //      IdMap.getId("order"),
  //      "1235"
  //    )
  //    await expect(res).rejects.toThrow("Swap must belong to the given order")
  //  })

  //  it("fails if swap doesn't have status received", async () => {
  //    const swapService = {
  //      retrieve: jest.fn().mockReturnValue(
  //        Promise.resolve({
  //          _id: "1235",
  //          order_id: IdMap.getId("order"),
  //          return: { status: "requested" },
  //        })
  //      ),
  //    }
  //    const orderService = new OrderService({
  //      swapService,
  //      orderModel,
  //      eventBusService: { emit: jest.fn().mockReturnValue(Promise.resolve()) },
  //    })

  //    const res = orderService.registerSwapReceived(
  //      IdMap.getId("order"),
  //      "1235"
  //    )
  //    await expect(res).rejects.toThrow("Swap is not received")
  //  })

  //  it("registers a swap as received", async () => {
  //    const model = {
  //      findOne: jest.fn().mockReturnValue(
  //        Promise.resolve({
  //          _id: IdMap.getId("order_123"),
  //          items: [
  //            {
  //              _id: IdMap.getId("1234"),
  //              returned_quantity: 0,
  //              quantity: 1,
  //            },
  //          ],
  //        })
  //      ),
  //      updateOne: jest.fn().mockReturnValue(Promise.resolve()),
  //    }
  //    const swapService = {
  //      retrieve: jest.fn().mockReturnValue(
  //        Promise.resolve({
  //          _id: "1235",
  //          order_id: IdMap.getId("order_123"),
  //          return: { status: "received" },
  //          return_items: [{ item_id: IdMap.getId("1234"), quantity: 1 }],
  //        })
  //      ),
  //    }
  //    const orderService = new OrderService({
  //      swapService,
  //      orderModel: model,
  //      eventBusService: { emit: jest.fn().mockReturnValue(Promise.resolve()) },
  //    })

  //    await orderService.registerSwapReceived(IdMap.getId("order"), "1235")

  //    expect(model.updateOne).toHaveBeenCalledWith(
  //      {
  //        _id: IdMap.getId("order_123"),
  //      },
  //      {
  //        $set: {
  //          items: [
  //            {
  //              _id: IdMap.getId("1234"),
  //              returned_quantity: 1,
  //              returned: true,
  //              quantity: 1,
  //            },
  //          ],
  //        },
  //      }
  //    )
  //  })

  //  it("fails if order/swap relationship is not satisfied", async () => {
  //    const swapService = {
  //      retrieve: jest
  //        .fn()
  //        .mockReturnValue(
  //          Promise.resolve({ _id: "1235", order_id: IdMap.getId("order_1") })
  //        ),
  //    }
  //    const orderService = new OrderService({
  //      swapService,
  //      orderModel,
  //      eventBusService: { emit: jest.fn().mockReturnValue(Promise.resolve()) },
  //    })

  //    const res = orderService.registerSwapCreated(IdMap.getId("order"), "1235")
  //    expect(res).rejects.toThrow("Swap must belong to the given order")
  //  })
  //})

  //describe("archive", () => {
  //  const orderService = new OrderService({
  //    orderModel: OrderModelMock,
  //  })

  //  beforeEach(async () => {
  //    jest.clearAllMocks()
  //  })

  //  it("calls order model functions", async () => {
  //    await orderService.archive(IdMap.getId("processed-order"))

  //    expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
  //    expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
  //      { _id: IdMap.getId("processed-order") },
  //      { $set: { status: "archived" } }
  //    )
  //  })

  //  it("throws if order is unprocessed", async () => {
  //    try {
  //      await orderService.archive(IdMap.getId("test-order"))
  //    } catch (error) {
  //      expect(error.message).toEqual("Can't archive an unprocessed order")
  //    }
  //  })
  //})
})
