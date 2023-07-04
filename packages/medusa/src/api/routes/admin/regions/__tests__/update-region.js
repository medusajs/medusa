import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { RegionServiceMock } from "../../../../../services/__mocks__/region"

describe("POST /admin/regions/:region_id", () => {
  describe("successful deletion", () => {
    let subject

    beforeAll(async () => {
      const id = IdMap.getId("region")
      subject = await request("POST", `/admin/regions/${id}`, {
        payload: {
          name: "Updated Region",
          currency_code: "dkk",
          countries: ["dk"],
          tax_rate: 0.3,
          payment_providers: ["default_provider"],
          fulfillment_providers: ["default_provider"],
        },
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

    it("calls service addCountry", () => {
      expect(RegionServiceMock.update).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("region"),
        {
          name: "Updated Region",
          currency_code: "dkk",
          countries: ["dk"],
          tax_rate: 0.3,
          payment_providers: ["default_provider"],
          fulfillment_providers: ["default_provider"],
        }
      )
    })
  })
})
