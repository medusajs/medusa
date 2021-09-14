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
          starts_at: "02/02/2021",
          ends_at: "03/14/2021",
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
        starts_at: new Date("02/02/2021"),
        ends_at: new Date("03/14/2021"),
        is_disabled: false,
        is_dynamic: false,
      })
    })
  })

  describe("successful creation with dynamic discount", () => {
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
          starts_at: "02/02/2021",
          ends_at: "03/14/2021",
          is_dynamic: true,
          valid_duration: "P1Y2M03DT04H05M",
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
        starts_at: new Date("02/02/2021"),
        is_disabled: false,
        is_dynamic: true,
        valid_duration: "P1Y2M03DT04H05M",
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

  describe("fails on invalid date intervals", () => {
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
          ends_at: "02/02/2021",
          starts_at: "03/14/2021",
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
      expect(subject.body.message[0].message).toEqual(
        `"ends_at" must be greater than "ref:starts_at"`
      )
    })
  })
})
