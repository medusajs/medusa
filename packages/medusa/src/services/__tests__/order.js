import { IdMap } from "medusa-test-utils"
import { OrderModelMock } from "../../models/__mocks__/order"
import OrderService from "../order"

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

  describe("updateBillingAddress", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.updateBillingAddress(IdMap.getId("test-order"), {
        first_name: "Oli",
        last_name: "test",
        address_1: "testaddress",
        city: "LA",
        country_code: "US",
        postal_code: "90002",
      })

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("test-order") },
        {
          $set: {
            billing_address: {
              first_name: "Oli",
              last_name: "test",
              address_1: "testaddress",
              city: "LA",
              country_code: "US",
              postal_code: "90002",
            },
          },
        }
      )
    })
  })

  describe("updateShippingAddress", () => {
    const orderService = new OrderService({
      orderModel: OrderModelMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await orderService.updateShippingAddress(IdMap.getId("test-order"), {
        first_name: "Oli",
        last_name: "test",
        address_1: "shipping test address",
        city: "LA",
        country_code: "US",
        postal_code: "90002",
      })

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("test-order") },
        {
          $set: {
            shipping_address: {
              first_name: "Oli",
              last_name: "test",
              address_1: "shipping test address",
              city: "LA",
              country_code: "US",
              postal_code: "90002",
            },
          },
        }
      )
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
      await orderService.cancel(IdMap.getId("test-order"))

      expect(OrderModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(OrderModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("test-order") },
        {
          $set: {
            shipping_address: {
              first_name: "Oli",
              last_name: "test",
              address_1: "shipping test address",
              city: "LA",
              country_code: "US",
              postal_code: "90002",
            },
          },
        }
      )
    })
  })
})
