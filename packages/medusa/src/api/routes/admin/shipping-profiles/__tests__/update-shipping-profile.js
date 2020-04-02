import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingProfileServiceMock } from "../../../../../services/__mocks__/shipping-profile"

describe("POST /admin/shipping-profile", () => {
  describe("successful update", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/shipping-profiles/${IdMap.getId("validId")}`,
        {
          payload: {
            name: "Test option",
          },
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

    it("calls service method", () => {
      expect(ShippingProfileServiceMock.update).toHaveBeenCalledTimes(1)
      expect(ShippingProfileServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("validId"),
        {
          name: "Test option",
        }
      )
    })
  })
})
