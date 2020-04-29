import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { RegionServiceMock } from "../../../../../services/__mocks__/region"

describe("GET /admin/regions", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/regions`, {
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
      expect(RegionServiceMock.list).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.list).toHaveBeenCalledWith({})
    })
  })
})
