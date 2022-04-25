import { IdMap } from "medusa-test-utils"
import { defaultAdminPriceListFields, defaultAdminPriceListRelations } from ".."
import { request } from "../../../../../helpers/test-request"
import { PriceListServiceMock } from "../../../../../services/__mocks__/price-list"

describe("GET /price-lists/:id", () => {
  describe("", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/price-lists/pl_1234`, {
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

    it("calls PriceListService retrieve", () => {
      expect(PriceListServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(PriceListServiceMock.retrieve).toHaveBeenCalledWith("pl_1234", {
        relations: defaultAdminPriceListRelations,
        select: defaultAdminPriceListFields,
      })
    })
  })
})
