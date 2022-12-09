import { IdMap } from "medusa-test-utils"
import { defaultStoreOrdersFields, defaultStoreOrdersRelations } from ".."
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
      expect(OrderServiceMock.retrieveWithTotals).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.retrieveWithTotals).toHaveBeenCalledWith(
        IdMap.getId("test-order"),
        {
          select: defaultStoreOrdersFields,
          relations: defaultStoreOrdersRelations,
        }
      )
    })

    it("returns order", () => {
      expect(subject.body.order.id).toEqual(IdMap.getId("test-order"))
    })
  })
})
