import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

describe("DELETE /admin/orders/:id/metadata/key", () => {
  describe("successfully deletes metadata on order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/orders/${IdMap.getId("test-order")}/metadata/test-key`,
        {
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

    it("calls OrderService deleteMetadata", () => {
      expect(OrderServiceMock.deleteMetadata).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.deleteMetadata).toHaveBeenCalledWith(
        IdMap.getId("test-order"),
        "test-key"
      )
    })
  })
})
