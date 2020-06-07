import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

describe("GET /store/orders", () => {
  describe("successfully gets an order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/orders/${IdMap.getId("test-order")}`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService retrieve", () => {
      expect(OrderServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("test-order")
      )
    })

    it("returns order", () => {
      expect(subject.body.order._id).toEqual(IdMap.getId("test-order"))
    })
  })
})
