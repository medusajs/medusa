import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { RegionServiceMock } from "../../../../../services/__mocks__/region"

describe("POST /admin/regions", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/regions", {
        payload: {
          name: "New Region",
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

    it("calls service create", () => {
      expect(RegionServiceMock.create).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.create).toHaveBeenCalledWith({
        name: "New Region",
        currency_code: "dkk",
        countries: ["dk"],
        tax_rate: 0.3,
        payment_providers: ["default_provider"],
        fulfillment_providers: ["default_provider"],
      })
    })
  })
})
