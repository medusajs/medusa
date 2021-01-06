describe("ReturnService", () => {
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

    it("return with custom refund", async () => {
      await orderService.receiveReturn(
        IdMap.getId("returned-order"),
        IdMap.getId("return"),
        [
          {
            item_id: IdMap.getId("existingLine"),
            quantity: 10,
          },
        ],
        102
      )

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("returned-order") },
        {
          $push: {
            refunds: {
              amount: 102,
            },
          },
          $set: {
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
            returns: [
              {
                documents: ["doc1234"],
                _id: IdMap.getId("return"),
                status: "received",
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
                refund_amount: 102,
              },
            ],
            fulfillment_status: "returned",
          },
        }
      )

      expect(DefaultProviderMock.refundPayment).toHaveBeenCalledTimes(1)
      expect(DefaultProviderMock.refundPayment).toHaveBeenCalledWith(
        { hi: "hi" },
        102
      )
    })

    it("calls order model functions and sets partially_returned", async () => {
      await orderService.receiveReturn(
        IdMap.getId("order-refund"),
        IdMap.getId("return"),
        [
          {
            item_id: IdMap.getId("existingLine"),
            quantity: 2,
          },
        ]
      )

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("order-refund") },
        {
          $push: {
            refunds: {
              amount: 246,
            },
          },
          $set: {
            returns: [
              {
                _id: IdMap.getId("return"),
                status: "received",
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
                documents: ["doc1234"],
                shipping_data: {
                  id: "return_shipment",
                  shipped: true,
                },
                items: [
                  {
                    item_id: IdMap.getId("existingLine"),
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
                    is_requested: true,
                    is_registered: true,
                    requested_quantity: 2,
                    quantity: 2,
                    metadata: {},
                  },
                ],
                refund_amount: 246,
              },
            ],
            items: [
              {
                _id: IdMap.getId("existingLine"),
                content: {
                  product: {
                    _id: IdMap.getId("product"),
                  },
                  quantity: 1,
                  unit_price: 100,
                  variant: {
                    _id: IdMap.getId("eur-8-us-10"),
                  },
                },
                description: "This is a new line",
                quantity: 10,
                returned: false,
                returned_quantity: 2,
                thumbnail: "test-img-yeah.com/thumb",
                title: "merge line",
              },
              {
                _id: IdMap.getId("existingLine2"),
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
                returned_quantity: 0,
                metadata: {},
              },
            ],
            fulfillment_status: "partially_returned",
          },
        }
      )
    })

    it("sets requires_action on additional items", async () => {
      await orderService.receiveReturn(
        IdMap.getId("order-refund"),
        IdMap.getId("return"),
        [
          {
            item_id: IdMap.getId("existingLine"),
            quantity: 2,
          },
          {
            item_id: IdMap.getId("existingLine2"),
            quantity: 2,
          },
        ]
      )

      const originalReturn = orders.orderToRefund.returns[0]
      const toSet = {
        ...originalReturn,
        status: "requires_action",
        items: [
          ...originalReturn.items.map((i, index) => ({
            ...i,
            requested_quantity: i.quantity,
            is_requested: index === 0,
            is_registered: true,
          })),
          {
            item_id: IdMap.getId("existingLine2"),
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
            is_requested: false,
            is_registered: true,
            quantity: 2,
            metadata: {},
          },
        ],
      }

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("order-refund"), "returns._id": originalReturn._id },
        {
          $set: {
            "returns.$": toSet,
          },
        }
      )
    })

    it("sets requires_action on unmatcing quantities", async () => {
      await orderService.receiveReturn(
        IdMap.getId("order-refund"),
        IdMap.getId("return"),
        [
          {
            item_id: IdMap.getId("existingLine"),
            quantity: 1,
          },
        ]
      )

      const originalReturn = orders.orderToRefund.returns[0]
      const toSet = {
        ...originalReturn,
        status: "requires_action",
        items: originalReturn.items.map(i => ({
          ...i,
          requested_quantity: i.quantity,
          quantity: 1,
          is_requested: false,
          is_registered: true,
        })),
      }

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("order-refund"), "returns._id": originalReturn._id },
        {
          $set: {
            "returns.$": toSet,
          },
        }
      )
    })
  })

  describe("requestReturn", () => {
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

      expect(FulfillmentProviderMock.createReturn).toHaveBeenCalledTimes(1)
      expect(FulfillmentProviderMock.createReturn).toHaveBeenCalledWith(
        {
          id: "return_shipment",
        },
        [
          {
            _id: IdMap.getId("existingLine"),
            title: "merge line",
            description: "This is a new line",
            thumbnail: "test-img-yeah.com/thumb",
            returned_quantity: 0,
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
            quantity: 10,
          },
        ],
        orders.processedOrder
      )

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("processed-order") },
        {
          $push: {
            returns: {
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
                  quantity: 10,
                },
              ],
              refund_amount: 1228,
            },
          },
        }
      )
    })

    it("sets correct shipping method", async () => {
      const items = [
        {
          item_id: IdMap.getId("existingLine"),
          quantity: 10,
        },
      ]
      await orderService.requestReturn(IdMap.getId("processed-order"), items)

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(
        OrderModelMock.updateOne.mock.calls[0][1].$push.returns.refund_amount
      ).toEqual(1230)
    })

    it("throws if payment is already processed", async () => {
      await expect(
        orderService.requestReturn(IdMap.getId("fulfilled-order"), [])
      ).rejects.toThrow("Can't return an order with payment unprocessed")
    })

    it("throws if return is attempted on unfulfilled order", async () => {
      await expect(
        orderService.requestReturn(IdMap.getId("not-fulfilled-order"), [])
      ).rejects.toThrow("Can't return an unfulfilled or already returned order")
    })
  })
})
