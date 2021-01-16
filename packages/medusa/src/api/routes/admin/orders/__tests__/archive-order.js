import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

describe("POST /admin/orders/:id/archive", () => {
  describe("successfully archives an order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("processed-order")}/archive`,
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

    it("calls OrderService archive", () => {
      expect(OrderServiceMock.archive).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.archive).toHaveBeenCalledWith(
        IdMap.getId("processed-order")
      )
    })

    it("returns order with status = archived", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body.order.id).toEqual(IdMap.getId("processed-order"))
      expect(subject.body.order.status).toEqual("archived")
    })
  })
})
