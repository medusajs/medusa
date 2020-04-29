import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { DiscountServiceMock } from "../../../../../services/__mocks__/discount"

describe("DELETE /admin/discounts/:discount_id/regions/region_id", () => {
  describe("successful removal", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/discounts/${IdMap.getId("total10")}/regions/${IdMap.getId(
          "region-france"
        )}`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service retrieve", () => {
      expect(DiscountServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("total10")
      )

      expect(DiscountServiceMock.removeRegion).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.removeRegion).toHaveBeenCalledWith(
        IdMap.getId("total10"),
        IdMap.getId("region-france")
      )
    })
  })
})
