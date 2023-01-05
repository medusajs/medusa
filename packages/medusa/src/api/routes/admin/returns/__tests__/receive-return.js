import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"
import { ReturnService } from "../../../../../services/__mocks__/return"

describe("POST /admin/returns/:id/receive", () => {
  describe("successfully receives a return", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/returns/${IdMap.getId("test-return")}/receive`,
        {
          payload: {
            items: [
              {
                item_id: IdMap.getId("test"),
                quantity: 2,
              },
            ],
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

    it("calls ReturnService receive", () => {
      expect(ReturnService.receive).toHaveBeenCalledTimes(1)
      expect(ReturnService.receive).toHaveBeenCalledWith(
        IdMap.getId("test-return"),
        [{ item_id: IdMap.getId("test"), quantity: 2 }],
        undefined,
        true,
        { location_id: undefined }
      )
    })

    it("calls OrderService registerReturnReceived", () => {
      expect(OrderServiceMock.registerReturnReceived).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.registerReturnReceived).toHaveBeenCalledWith(
        IdMap.getId("test-order"),
        {
          id: IdMap.getId("test-return"),
          order_id: IdMap.getId("test-order"),
        },
        undefined
      )
    })
  })
})
