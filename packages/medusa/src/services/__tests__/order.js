import { IdMap } from "medusa-test-utils"
import { OrderModelMock, orders } from "../../models/__mocks__/order"
import { carts } from "../../models/__mocks__/cart"
import OrderService from "../order"
import {
  PaymentProviderServiceMock,
  DefaultProviderMock,
} from "../__mocks__/payment-provider"
import { DiscountServiceMock } from "../__mocks__/discount"
import {
  FulfillmentProviderServiceMock,
  DefaultProviderMock as FulfillmentProviderMock,
} from "../__mocks__/fulfillment-provider"
import { ShippingProfileServiceMock } from "../__mocks__/shipping-profile"
import { TotalsServiceMock } from "../__mocks__/totals"
import { RegionServiceMock } from "../__mocks__/region"
import { CounterServiceMock } from "../__mocks__/counter"
import { EventBusServiceMock } from "../__mocks__/event-bus"

describe("OrderService", () => {
  describe("create", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.create({
        email: "oliver@test.dk",
      })

      expect(OrderModelMock.create).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.create).toHaveBeenCalledWith({
        email: "oliver@test.dk",
      })
    })
  })

  describe("createFromCart", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
      paymentProviderService: PaymentProviderServiceMock,
      discountService: DiscountServiceMock,
      regionService: RegionServiceMock,
      eventBusService: EventBusServiceMock,
      counterService: CounterServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.createFromCart(carts.completeCart)

      const order = {
        ...carts.completeCart,
        currency_code: "eur",
        cart_id: carts.completeCart._id,
        tax_rate: 0.25,
      }
      delete order._id
      delete order.payment_sessions

      expect(OrderModelMock.create).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.create).toHaveBeenCalledWith([order], {
        session: expect.anything(),
      })
    })

    it("creates cart with gift card", async () => {
      await orderService.createFromCart(carts.withGiftCard)

      const order = {
        ...carts.withGiftCard,
        items: [
          {
            _id: IdMap.getId("existingLine"),
            title: "merge line",
            description: "This is a new line",
            is_giftcard: false,
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
          {
            _id: IdMap.getId("giftline"),
            title: "GiftCard",
            description: "Gift card line",
            thumbnail: "test-img-yeah.com/thumb",
            metadata: {
              giftcard: IdMap.getId("gift_card_id"),
              name: "Test Name",
            },
            is_giftcard: true,
            content: {
              unit_price: 100,
              variant: {
                _id: IdMap.getId("giftCardVar"),
              },
              product: {
                _id: IdMap.getId("giftCardProd"),
              },
              quantity: 1,
            },
            quantity: 1,
          },
        ],
        currency_code: "eur",
        cart_id: carts.withGiftCard._id,
        tax_rate: 0.25,
      }

      delete order._id
      delete order.payment_sessions

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(2)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "order.gift_card_created",
        {
          currency_code: "eur",
          tax_rate: 0.25,
          email: "test",
          giftcard: expect.any(Object),
          line_item: expect.any(Object),
        }
      )

      expect(DiscountServiceMock.generateGiftCard).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.generateGiftCard).toHaveBeenCalledWith(
        100,
        IdMap.getId("region-france")
      )

      expect(OrderModelMock.create).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.create).toHaveBeenCalledWith([order], {
        session: expect.anything(),
      })
    })
  })

  describe("retrieve", () => {
    let result
    const orderService = new OrderService({
      orderModel: OrderModelMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
      result = await orderService.retrieve(IdMap.getId("test-order"))
    })

    it("calls order model functions", async () => {
      expect(OrderModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("test-order"),
      })
    })

    it("returns correct order", async () => {
      expect(result._id).toEqual(IdMap.getId("test-order"))
    })
  })

  describe("retrieveByCartId", () => {
    let result
    const orderService = new OrderService({
      orderModel: OrderModelMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
      result = await orderService.retrieveByCartId(IdMap.getId("test-cart"))
    })

    it("calls order model functions", async () => {
      expect(OrderModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.findOne).toHaveBeenCalledWith({
        cart_id: IdMap.getId("test-cart"),
      })
    })

    it("returns correct order", async () => {
      expect(result._id).toEqual(IdMap.getId("test-order"))
    })
  })

  describe("update", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.update(IdMap.getId("test-order"), {
        email: "oliver@test.dk",
      })

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("test-order") },
        {
          $set: {
            email: "oliver@test.dk",
          },
        },
        { runValidators: true }
      )
    })

    it("throws on invalid billing address", async () => {
      const address = {
        last_name: "James",
        address_1: "24 Dunks Drive",
        city: "Los Angeles",
        country_code: "US",
        province: "CA",
        postal_code: "93011",
      }

      try {
        await orderService.update(IdMap.getId("test-order"), {
          billing_address: address,
        })
      } catch (err) {
        expect(err.message).toEqual("The address is not valid")
      }

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(0)
    })

    it("throws on invalid shipping address", async () => {
      const address = {
        last_name: "James",
        address_1: "24 Dunks Drive",
        city: "Los Angeles",
        country_code: "US",
        province: "CA",
        postal_code: "93011",
      }

      try {
        await orderService.update(IdMap.getId("test-order"), {
          shipping_address: address,
        })
      } catch (err) {
        expect(err.message).toEqual("The address is not valid")
      }

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(0)
    })

    it("throws if metadata update are attempted", async () => {
      try {
        await orderService.update(IdMap.getId("test-order"), {
          metadata: { test: "foo" },
        })
      } catch (error) {
        expect(error.message).toEqual(
          "Use setMetadata to update metadata fields"
        )
      }
    })

    it("throws if address updates are attempted after fulfillment", async () => {
      try {
        await orderService.update(IdMap.getId("fulfilled-order"), {
          billing_address: {
            first_name: "Lebron",
            last_name: "James",
            address_1: "24 Dunks Drive",
            city: "Los Angeles",
            country_code: "US",
            province: "CA",
            postal_code: "93011",
          },
        })
      } catch (error) {
        expect(error.message).toEqual(
          "Can't update shipping, billing, items and payment method when order is processed"
        )
      }
    })

    it("throws if payment method update is attempted after fulfillment", async () => {
      try {
        await orderService.update(IdMap.getId("fulfilled-order"), {
          payment_method: {
            provider_id: "test",
            profile_id: "test",
          },
        })
      } catch (error) {
        expect(error.message).toEqual(
          "Can't update shipping, billing, items and payment method when order is processed"
        )
      }
    })

    it("throws if items update is attempted after fulfillment", async () => {
      try {
        await orderService.update(IdMap.getId("fulfilled-order"), {
          items: [],
        })
      } catch (error) {
        expect(error.message).toEqual(
          "Can't update shipping, billing, items and payment method when order is processed"
        )
      }
    })
  })

  describe("cancel", () => {
    const orderService = new OrderService({
      fulfillmentProviderService: FulfillmentProviderServiceMock,
      paymentProviderService: PaymentProviderServiceMock,
      orderModel: OrderModelMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.cancel(IdMap.getId("not-fulfilled-order"))

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("not-fulfilled-order") },
        {
          $set: {
            status: "canceled",
            fulfillment_status: "canceled",
            payment_status: "canceled",
            fulfillments: [
              {
                data: {},
                is_canceled: true,
                provider_id: "default_provider",
              },
            ],
            payment_method: {
              data: {},
              provider_id: "default_provider",
            },
          },
        }
      )
    })

    it("throws if order is fulfilled", async () => {
      try {
        await orderService.cancel(IdMap.getId("fulfilled-order"))
      } catch (error) {
        expect(error.message).toEqual("Can't cancel a fulfilled order")
      }
    })

    it("throws if order payment is captured", async () => {
      try {
        await orderService.cancel(IdMap.getId("payed-order"))
      } catch (error) {
        expect(error.message).toEqual(
          "Can't cancel an order with a processed payment"
        )
      }
    })
  })

  describe("capturePayment", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
      paymentProviderService: PaymentProviderServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.capturePayment(IdMap.getId("test-order"))

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("test-order") },
        { $set: { payment_status: "captured" } }
      )
    })

    it("throws if payment is already processed", async () => {
      await expect(
        orderService.capturePayment(IdMap.getId("payed-order"))
      ).rejects.toThrow("Payment already captured")
    })
  })

  describe("createFulfillment", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
      paymentProviderService: PaymentProviderServiceMock,
      fulfillmentProviderService: FulfillmentProviderServiceMock,
      shippingProfileService: ShippingProfileServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.createFulfillment(IdMap.getId("test-order"), [
        {
          item_id: IdMap.getId("existingLine"),
          quantity: 10,
        },
      ])

      expect(FulfillmentProviderMock.createOrder).toHaveBeenCalledTimes(1)
      expect(FulfillmentProviderMock.createOrder).toHaveBeenCalledWith(
        {
          extra: "hi",
        },
        [
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
                _id: IdMap.getId("validId"),
              },
              quantity: 1,
            },
            fulfilled_quantity: 0,
            quantity: 10,
          },
        ],
        orders.testOrder
      )

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("test-order") },
        {
          $addToSet: {
            fulfillments: {
              $each: [
                {
                  data: {
                    extra: "hi",
                  },
                  items: [
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
                          _id: IdMap.getId("validId"),
                        },
                        quantity: 1,
                      },
                      fulfilled_quantity: 0,
                      quantity: 10,
                    },
                  ],
                  metadata: {},
                  provider_id: "default_provider",
                },
              ],
            },
          },
          $set: {
            items: [
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
                    _id: IdMap.getId("validId"),
                  },
                  quantity: 1,
                },
                quantity: 10,
                fulfilled_quantity: 10,
                fulfilled: true,
              },
            ],
            fulfillment_status: "fulfilled",
          },
        }
      )
    })

    it("throws if too many items are requested fulfilled", async () => {
      await expect(
        orderService.createFulfillment(IdMap.getId("test-order"), [
          {
            item_id: IdMap.getId("existingLine"),
            quantity: 11,
          },
        ])
      ).rejects.toThrow("Cannot fulfill more items than have been purchased")
    })
  })

  describe("return", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
      paymentProviderService: PaymentProviderServiceMock,
      totalsService: TotalsServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.return(IdMap.getId("processed-order"), [
        {
          item_id: IdMap.getId("existingLine"),
          quantity: 10,
        },
      ])

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("processed-order") },
        {
          $push: {
            refunds: {
              amount: 1230,
            },
            returns: {
              items: [
                {
                  item_id: IdMap.getId("existingLine"),
                  quantity: 10,
                },
              ],
              refund_amount: 1230,
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
            fulfillment_status: "returned",
          },
        }
      )

      expect(DefaultProviderMock.refundPayment).toHaveBeenCalledTimes(1)
      expect(DefaultProviderMock.refundPayment).toHaveBeenCalledWith(
        { hi: "hi" },
        1230
      )
    })

    it("return with custom refund", async () => {
      await orderService.return(
        IdMap.getId("processed-order"),
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
        { _id: IdMap.getId("processed-order") },
        {
          $push: {
            refunds: {
              amount: 102,
            },
            returns: {
              items: [
                {
                  item_id: IdMap.getId("existingLine"),
                  quantity: 10,
                },
              ],
              refund_amount: 102,
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
      await orderService.return(IdMap.getId("order-refund"), [
        {
          item_id: IdMap.getId("existingLine"),
          quantity: 2,
        },
      ])

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("order-refund") },
        {
          $push: {
            refunds: {
              amount: 0,
            },
            returns: {
              items: [
                {
                  item_id: IdMap.getId("existingLine"),
                  quantity: 2,
                },
              ],
              refund_amount: 0,
            },
          },
          $set: {
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
              },
            ],
            fulfillment_status: "partially_returned",
          },
        }
      )
    })

    it("throws if payment is already processed", async () => {
      try {
        await orderService.return(IdMap.getId("fulfilled-order"), [])
      } catch (error) {
        expect(error.message).toEqual(
          "Can't return an order with payment unprocessed"
        )
      }
    })

    it("throws if return is attempted on unfulfilled order", async () => {
      try {
        await orderService.return(IdMap.getId("not-fulfilled-order"), [])
      } catch (error) {
        expect(error.message).toEqual(
          "Can't return an unfulfilled or already returned order"
        )
      }
    })
  })

  describe("archive", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.archive(IdMap.getId("processed-order"))

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("processed-order") },
        { $set: { status: "archived" } }
      )
    })

    it("throws if order is unprocessed", async () => {
      try {
        await orderService.archive(IdMap.getId("test-order"))
      } catch (error) {
        expect(error.message).toEqual("Can't archive an unprocessed order")
      }
    })
  })
})
