import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { DiscountServiceMock } from "../../../../../services/__mocks__/discount"

describe("DELETE /admin/discounts/discount_id", () => {
  describe("successful deletion", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
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

    it("calls service delete", () => {
      expect(DiscountServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.delete).toHaveBeenCalledWith(
        IdMap.getId("total10")
      )
    })

    it("returns correct delete object", () => {
      expect(subject.body).toEqual({
        id: IdMap.getId("total10"),
        object: "discount",
        deleted: true,
      })
    })
  })
})
