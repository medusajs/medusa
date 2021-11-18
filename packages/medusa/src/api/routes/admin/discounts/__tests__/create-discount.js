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
          starts_at: "02/02/2021 13:45",
          ends_at: "03/14/2021 04:30",
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
        starts_at: new Date("02/02/2021 13:45"),
        ends_at: new Date("03/14/2021 04:30"),
        is_disabled: false,
        is_dynamic: false,
      })
    })
  })

  describe("unsuccessful creation with dynamic discount using an invalid iso8601 duration", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("POST", "/admin/discounts", {
        payload: {
          code: "TEST",
          rule: {
            description: "Test",
            type: "fixed",
            value: 10,
            allocation: "total",
          },
          starts_at: "02/02/2021 13:45",
          is_dynamic: true,
          valid_duration: "PaMT2D",
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
      expect(subject.body.message).toEqual(
        `"valid_duration" must be a valid ISO 8601 duration`
      )
    })
  })

  describe("successful creation with dynamic discount", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("POST", "/admin/discounts", {
        payload: {
          code: "TEST",
          rule: {
            description: "Test",
            type: "fixed",
            value: 10,
            allocation: "total",
          },
          starts_at: "02/02/2021 13:45",
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
        starts_at: new Date("02/02/2021 13:45"),
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
      expect(subject.body.message).toEqual(
        `type should not be empty, type must be a string`
      )
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
      expect(subject.body.message).toEqual(
        `"ends_at" must be greater than "starts_at"`
      )
    })
  })

  describe("succesfully creates a dynamic discount without setting valid duration", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("POST", "/admin/discounts", {
        payload: {
          code: "TEST",
          is_dynamic: true,
          rule: {
            description: "Test",
            type: "fixed",
            value: 10,
            allocation: "total",
          },
          starts_at: "03/14/2021 14:30",
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

    it("returns error", () => {
      expect(DiscountServiceMock.create).toHaveBeenCalledWith({
        code: "TEST",
        is_dynamic: true,
        is_disabled: false,
        rule: {
          description: "Test",
          type: "fixed",
          value: 10,
          allocation: "total",
        },
        starts_at: new Date("03/14/2021 14:30"),
      })
    })
  })
})
