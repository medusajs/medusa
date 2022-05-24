import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { PriceListServiceMock } from "../../../../../services/__mocks__/price-list"

describe("POST /price-lists/:id/prices/batch", () => {
  describe("successfully adds several new prices to a price list", () => {
    let subject

    beforeAll(async () => {
      subject = await request("DELETE", `/admin/price-lists/pl_1234`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls PriceListService addPrices", () => {
      expect(PriceListServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(PriceListServiceMock.delete).toHaveBeenCalledWith("pl_1234")

      expect(subject.body).toEqual({
        id: "pl_1234",
        object: "price-list",
        deleted: true,
      })
    })
  })
})
