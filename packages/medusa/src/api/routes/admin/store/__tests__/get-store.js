import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { StoreServiceMock } from "../../../../../services/__mocks__/store"

describe("GET /admin/store", () => {
  describe("successful addition", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/store`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service retrieve", () => {
      expect(StoreServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(StoreServiceMock.retrieve).toHaveBeenCalledWith({
        relations: ["currencies", "default_currency", "default_sales_channel"],
      })
    })
  })
})
