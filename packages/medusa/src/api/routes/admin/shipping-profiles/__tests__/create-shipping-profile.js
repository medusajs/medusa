import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingProfileServiceMock } from "../../../../../services/__mocks__/shipping-profile"

describe("POST /admin/shipping-profiles", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/shipping-profiles", {
        payload: {
          name: "Test Profile",
          type: "default",
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
      expect(ShippingProfileServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ShippingProfileServiceMock.create).toHaveBeenCalledWith({
        name: "Test Profile",
        type: "default",
      })
    })
  })
})
