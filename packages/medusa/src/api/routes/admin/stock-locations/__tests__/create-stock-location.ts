import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { StockLocationServiceMock } from "../../../../../services/__mocks__/stock-location"

describe("POST /admin/stock-locations", () => {
  describe("create a stock location", () => {
    beforeAll(async () => {
      await request("POST", `/admin/stock-locations`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
        payload: {
          id: "stock_location_1_product_1",
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls the retrieve method from the sales channel service", () => {
      expect(StockLocationServiceMock.create).toHaveBeenCalledTimes(1)
      expect(StockLocationServiceMock.create).toHaveBeenCalledWith(
        IdMap.getId("stock_location_1"),
        ["stock_location_1_product_1"]
      )
    })
  })
})
