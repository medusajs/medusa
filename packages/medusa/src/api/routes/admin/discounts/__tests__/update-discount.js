import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { DiscountServiceMock } from "../../../../../services/__mocks__/discount"

describe("POST /admin/discounts", () => {
  describe("successful update", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/discounts/${IdMap.getId("total10")}`,
        {
          payload: {
            code: "10TOTALOFF",
            rule: {
              id: "1234",
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
          rule: {
            id: "1234",
            type: "fixed",
            value: 10,
            allocation: "total",
          },
          is_dynamic: false,
        }
      )
    })
  })

  describe("unsuccessful update with dynamic discount using an invalid iso8601 duration", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/discounts/${IdMap.getId("total10")}`,
        {
          payload: {
            code: "10TOTALOFF",
            rule: {
              id: "1234",
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
        }
      )
    })

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })

    it("returns error", () => {
      expect(subject.body.message[0].message).toEqual(
        `"valid_duration" must be a valid ISO 8601 duration`
      )
    })
  })

  describe("successful update with dynamic discount", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/discounts/${IdMap.getId("total10")}`,
        {
          payload: {
            code: "10TOTALOFF",
            rule: {
              id: "1234",
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
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service update", () => {
      expect(DiscountServiceMock.update).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("total10"),
        {
          code: "10TOTALOFF",
          rule: {
            id: "1234",
            type: "fixed",
            value: 10,
            allocation: "total",
          },
          starts_at: new Date("02/02/2021 13:45"),
          is_dynamic: true,
          valid_duration: "P1Y2M03DT04H05M",
        }
      )
    })
  })

  describe("fails on invalid date intervals", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/discounts/${IdMap.getId("total10")}`,
        {
          payload: {
            code: "10TOTALOFF",
            rule: {
              id: "1234",
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
        }
      )
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
