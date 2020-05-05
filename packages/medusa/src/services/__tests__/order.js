import { IdMap } from "medusa-test-utils"
import { OrderModelMock } from "../../models/__mocks__/order"
import OrderService from "../order"
import { PaymentProviderServiceMock } from "../__mocks__/payment-provider"
import { FulfillmentProviderServiceMock } from "../__mocks__/fulfillment-provider"
import { ShippingProfileServiceMock } from "../__mocks__/shipping-profile"

describe("OrderService", () => {
  describe("create", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
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

  describe("update", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.update(IdMap.getId("test-order"), {
        email: "oliver@test.dk",
        status: "completed",
      })

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("test-order") },
        {
          $set: {
            email: "oliver@test.dk",
            status: "completed",
          },
        },
        { runValidators: true }
      )
    })

    it("fails if metadata update are attempted", async () => {
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
  })

  describe("cancel", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.cancel(IdMap.getId("not-fulfilled-order"))

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("not-fulfilled-order") },
        { $set: { status: "cancelled" } }
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
          "Can't cancel an order with payment processed"
        )
      }
    })
  })

  describe("capturePayment", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
      paymentProviderService: PaymentProviderServiceMock,
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
      try {
        await orderService.capturePayment(IdMap.getId("payed-order"))
      } catch (error) {
        expect(error.message).toEqual("Payment already captured")
      }
    })
  })

  describe("createFulfillment", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
      paymentProviderService: PaymentProviderServiceMock,
      fulfillmentProviderService: FulfillmentProviderServiceMock,
      shippingProfileService: ShippingProfileServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.createFulfillment(IdMap.getId("test-order"))

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("test-order") },
        { $set: { fulfillment_status: "fulfilled" } }
      )
    })

    it("throws if payment is already processed", async () => {
      try {
        await orderService.createFulfillment(IdMap.getId("fulfilled-order"))
      } catch (error) {
        expect(error.message).toEqual("Order is already fulfilled")
      }
    })
  })
})
