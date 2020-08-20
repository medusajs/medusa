import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingOptionServiceMock } from "../../../../../services/__mocks__/shipping-option"

describe("POST /admin/shipping-options", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/shipping-options/${IdMap.getId("validId")}`,
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

    it("calls service delete", () => {
      expect(ShippingOptionServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(ShippingOptionServiceMock.delete).toHaveBeenCalledWith(
        IdMap.getId("validId")
      )
    })
  })
})
