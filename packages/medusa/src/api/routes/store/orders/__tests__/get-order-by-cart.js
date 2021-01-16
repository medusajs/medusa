import { IdMap } from "medusa-test-utils"
import { defaultFields, defaultRelations } from ".."
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

describe("GET /store/orders", () => {
  describe("successfully gets an order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/orders/cart/${IdMap.getId("test-cart")}`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService retrieve", () => {
      expect(OrderServiceMock.retrieveByCartId).toHaveBeenCalledTimes(1)
      expect(
        OrderServiceMock.retrieveByCartId
      ).toHaveBeenCalledWith(IdMap.getId("test-cart"), {
        select: defaultFields,
        relations: defaultRelations,
      })
    })

    it("returns order", () => {
      expect(subject.body.order.id).toEqual(IdMap.getId("test-order"))
    })
  })
})
