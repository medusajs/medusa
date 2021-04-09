import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { DiscountServiceMock } from "../../../../../services/__mocks__/discount"

describe("POST /admin/discounts", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/discounts", {
        payload: {
          code: "TEST",
          rule: {
            description: "Test",
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
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service create", () => {
      expect(DiscountServiceMock.create).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.create).toHaveBeenCalledWith({
        code: "TEST",
        rule: {
          description: "Test",
          type: "fixed",
          value: 10,
          allocation: "total",
        },
        is_disabled: false,
        is_dynamic: false,
      })
    })
  })

  describe("fails on invalid data", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/discounts", {
        payload: {
          code: "10%OFF",
          rule: {
            description: "Test",
            value: 10,
            allocation: "total",
          },
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })

    it("returns error", () => {
      expect(subject.body.message[0].message).toEqual(`"rule.type" is required`)
    })
  })
})
