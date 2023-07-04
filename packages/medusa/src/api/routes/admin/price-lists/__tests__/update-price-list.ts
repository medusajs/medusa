import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { PriceListServiceMock } from "../../../../../services/__mocks__/price-list"

describe("POST /price-lists/:id", () => {
  describe("successfully updates a price list", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/price-lists/pl_1234`, {
        payload: {
          description: "new description",
        },
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

    it("calls PriceListService update", () => {
      expect(PriceListServiceMock.update).toHaveBeenCalledTimes(1)
      expect(PriceListServiceMock.update).toHaveBeenCalledWith("pl_1234", {
        description: "new description",
      })
    })
  })
})
