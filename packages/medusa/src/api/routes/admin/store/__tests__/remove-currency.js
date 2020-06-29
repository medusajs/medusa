import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { StoreServiceMock } from "../../../../../services/__mocks__/store"

describe("DELETE /admin/store/currencies/:currency_code", () => {
  describe("successful addition", () => {
    let subject

    beforeAll(async () => {
      subject = await request("DELETE", `/admin/store/currencies/dkk`, {
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
      expect(StoreServiceMock.removeCurrency).toHaveBeenCalledTimes(1)
      expect(StoreServiceMock.removeCurrency).toHaveBeenCalledWith("dkk")
    })
  })
})
