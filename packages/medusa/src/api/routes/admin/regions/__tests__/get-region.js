import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { RegionServiceMock } from "../../../../../services/__mocks__/region"

describe("GET /admin/regions/:region_id", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      const id = IdMap.getId("testRegion")
      subject = await request("GET", `/admin/regions/${id}`, {
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
      expect(RegionServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("testRegion")
      )
    })
  })
})
