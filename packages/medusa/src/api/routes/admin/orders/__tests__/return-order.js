import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

describe("POST /admin/orders/:id/return", () => {
  describe("successfully returns full order", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/return`,
        {
          payload: {
            items: [
              {
                item_id: IdMap.getId("existingLine"),
                quantity: 10,
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

    it("calls OrderService return", () => {
      expect(OrderServiceMock.requestReturn).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.requestReturn).toHaveBeenCalledWith(
        IdMap.getId("test-order"),
        [
          {
            item_id: IdMap.getId("existingLine"),
            quantity: 10,
          },
        ],
        undefined, // no shipping method
        undefined // no refund amount
      )
    })
  })

  describe("defaults to 0 on negative refund amount", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/return`,
        {
          payload: {
            items: [
              {
                item_id: IdMap.getId("existingLine"),
                quantity: 10,
              },
            ],
            refund: -1,
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

    it("calls OrderService return", () => {
      expect(OrderServiceMock.requestReturn).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.requestReturn).toHaveBeenCalledWith(
        IdMap.getId("test-order"),
        [
          {
            item_id: IdMap.getId("existingLine"),
            quantity: 10,
          },
        ],
        undefined, // no shipping method
        0
      )
    })
  })
})
