import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { RegionServiceMock } from "../../../../../services/__mocks__/region"

describe("DELETE /admin/regions/:region_id/payment-providers/:provider_id", () => {
  describe("successful deletion", () => {
    let subject

    beforeAll(async () => {
      const id = IdMap.getId("region")
      subject = await request(
        "DELETE",
        `/admin/regions/${id}/payment-providers/default_provider`,
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

    it("calls service addCountry", () => {
      expect(RegionServiceMock.removePaymentProvider).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.removePaymentProvider).toHaveBeenCalledWith(
        IdMap.getId("region"),
        "default_provider"
      )
    })
  })
})
