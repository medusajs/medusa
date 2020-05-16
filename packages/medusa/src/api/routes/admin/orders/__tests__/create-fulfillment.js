import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

describe("POST /admin/orders/:id/fulfillment", () => {
  describe("successfully fulfills an order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/fulfillment`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls OrderService createFulfillment", () => {
      expect(OrderServiceMock.createFulfillment).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.createFulfillment).toHaveBeenCalledWith(
        IdMap.getId("test-order")
      )
    })

    it("returns order with fulfillment_status = fulfilled", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body._id).toEqual(IdMap.getId("test-order"))
      expect(subject.body.fulfillment_status).toEqual("fulfilled")
    })
  })
})
