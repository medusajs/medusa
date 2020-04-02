import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingOptionServiceMock } from "../../../../../services/__mocks__/shipping-option"

describe("GET /admin/shipping-options/:optionId", () => {
  describe("successful retrieval", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
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

    it("calls service retrieve", () => {
      expect(ShippingOptionServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ShippingOptionServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("validId")
      )
    })
  })
})
