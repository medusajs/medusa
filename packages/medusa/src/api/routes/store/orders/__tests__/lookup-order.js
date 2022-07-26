import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

describe("GET /store/orders", () => {
  describe("successfully looksup an order passing param validation", () => {
    beforeAll(async () => {
      await request(
        "GET",
        `/store/orders?display_id=67007&email=tester%40medusa-commerce.com&shipping_address[postal_code]=23232`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService list", () => {
      expect(OrderServiceMock.list).toHaveBeenCalledTimes(1)
    })
  })
})
