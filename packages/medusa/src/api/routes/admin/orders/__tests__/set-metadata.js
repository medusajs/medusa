import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

describe("POST /admin/orders/:id/metadata", () => {
  describe("successfully sets metadata on order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/metadata`,
        {
          payload: {
            key: "Test key",
            value: "Test value",
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls OrderService setMetadata", () => {
      expect(OrderServiceMock.setMetadata).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.setMetadata).toHaveBeenCalledWith(
        IdMap.getId("test-order"),
        "Test key",
        "Test value"
      )
    })
  })
})
