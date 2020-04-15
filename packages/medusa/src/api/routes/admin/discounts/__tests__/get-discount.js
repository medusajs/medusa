import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { DiscountServiceMock } from "../../../../../services/__mocks__/discount"

describe("GET /admin/discounts/:discount_id", () => {
  describe("successful retrieval", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/discounts/${IdMap.getId("total10")}`,
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
    })
  })
})
