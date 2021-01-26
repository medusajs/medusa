import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

describe("POST /admin/orders/:id/cancel", () => {
  describe("successfully cancels an order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/cancel`,
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

    it("calls OrderService cancel", () => {
      expect(OrderServiceMock.cancel).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.cancel).toHaveBeenCalledWith(
        IdMap.getId("test-order")
      )
    })

    it("returns order with status = cancelled", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body.order.id).toEqual(IdMap.getId("test-order"))
      expect(subject.body.order.status).toEqual("cancelled")
    })
  })
})
