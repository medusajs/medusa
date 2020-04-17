import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { RegionServiceMock } from "../../../../../services/__mocks__/region"

describe("DELETE /admin/regions/:region_id", () => {
  describe("successful deletion", () => {
    let subject

    beforeAll(async () => {
      const id = IdMap.getId("region")
      subject = await request("DELETE", `/admin/regions/${id}`, {
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
      expect(RegionServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.delete).toHaveBeenCalledWith(
        IdMap.getId("region")
      )
    })
  })
})
