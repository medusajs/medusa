import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { RegionServiceMock } from "../../../../../services/__mocks__/region"

describe("POST /admin/regions/:region_id/countries", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      const id = IdMap.getId("testRegion")
      subject = await request("POST", `/admin/regions/${id}/countries`, {
        payload: {
          country_code: "se",
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
      expect(RegionServiceMock.addCountry).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.addCountry).toHaveBeenCalledWith(
        IdMap.getId("testRegion"),
        "se"
      )
    })
  })
})
