import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { DiscountServiceMock } from "../../../../../services/__mocks__/discount"

describe("POST /admin/discounts", () => {
  describe("successful update", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/discounts/${IdMap.getId("total10")}`,
        {
          payload: {
            code: "10TOTALOFF",
            discount_rule: {
              type: "fixed",
              value: 10,
              allocation: "total",
            },
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
      expect(DiscountServiceMock.update).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("total10"),
        {
          code: "10TOTALOFF",
          discount_rule: {
            type: "fixed",
            value: 10,
            allocation: "total",
          },
          is_dynamic: false,
        }
      )
    })
  })
})
