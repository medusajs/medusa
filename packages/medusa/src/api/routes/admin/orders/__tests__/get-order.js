import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "../index"

describe("GET /admin/orders", () => {
  describe("successfully gets an order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/orders/${IdMap.getId("test-order")}`,
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

    it("calls orderService retrieve", () => {
      expect(OrderServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("test-order"),
        {
          select: defaultAdminOrdersFields,
          relations: defaultAdminOrdersRelations,
        }
      )
    })

    it("returns order", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body.order.id).toEqual(IdMap.getId("test-order"))
    })
  })
})
