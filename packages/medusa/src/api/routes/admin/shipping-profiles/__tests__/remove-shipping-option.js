import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingProfileServiceMock } from "../../../../../services/__mocks__/shipping-profile"

describe("DELETE /admin/shipping-profiles/:profile_id/shipping-options/:option_id", () => {
  describe("successful addition", () => {
    let subject

    beforeAll(async () => {
      const profileId = IdMap.getId("validId")
      const optionId = IdMap.getId("validId")
      subject = await request(
        "DELETE",
        `/admin/shipping-profiles/${profileId}/shipping-options/${optionId}`,
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
      expect(
        ShippingProfileServiceMock.removeShippingOption
      ).toHaveBeenCalledTimes(1)
      expect(
        ShippingProfileServiceMock.removeShippingOption
      ).toHaveBeenCalledWith(IdMap.getId("validId"), IdMap.getId("validId"))
    })
  })
})
