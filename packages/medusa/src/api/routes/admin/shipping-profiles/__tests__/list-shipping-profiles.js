import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingProfileServiceMock } from "../../../../../services/__mocks__/shipping-profile"

describe("GET /admin/shipping-profiles", () => {
  describe("successful retrieval", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/shipping-profiles`, {
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

    it("calls service retrieve", () => {
      expect(ShippingProfileServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ShippingProfileServiceMock.list).toHaveBeenCalledWith()
    })
  })
})
