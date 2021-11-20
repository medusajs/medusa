import { IdMap } from "medusa-test-utils"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from ".."
import { request } from "../../../../../helpers/test-request"
import { DiscountServiceMock } from "../../../../../services/__mocks__/discount"

describe("GET /admin/discounts", () => {
  describe("successful retrieval of discounts", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/admin/discounts`, {
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

    it("calls service retrieve with config", () => {
      expect(DiscountServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        {
          select: defaultAdminDiscountsFields,
          relations: defaultAdminDiscountsRelations,
          skip: 0,
          take: 20,
          order: { created_at: "DESC" },
        }
      )
    })
  })

  describe("successful retrieval of discounts with query config", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "GET",
        `/admin/discounts?q=OLI&limit=40&offset=20&is_dynamic=false&is_disabled=false`,
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

    it("calls service retrieve with config", () => {
      expect(DiscountServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.listAndCount).toHaveBeenCalledWith(
        { q: "OLI", is_dynamic: false, is_disabled: false },
        {
          select: defaultAdminDiscountsFields,
          relations: defaultAdminDiscountsRelations,
          skip: 20,
          take: 40,
          order: { created_at: "DESC" },
        }
      )
    })
  })

  describe("successful retrieval of dynamic discounts", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/admin/discounts?is_dynamic=true`, {
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

    it("calls service retrieve with corresponding config", () => {
      expect(DiscountServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.listAndCount).toHaveBeenCalledWith(
        { is_dynamic: true },
        {
          select: defaultAdminDiscountsFields,
          relations: defaultAdminDiscountsRelations,
          skip: 0,
          take: 20,
          order: { created_at: "DESC" },
        }
      )
    })
  })

  describe("successful retrieval of disabled discounts", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/admin/discounts?is_disabled=true`, {
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

    it("calls service retrieve with corresponding config", () => {
      expect(DiscountServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.listAndCount).toHaveBeenCalledWith(
        { is_disabled: true },
        {
          select: defaultAdminDiscountsFields,
          relations: defaultAdminDiscountsRelations,
          skip: 0,
          take: 20,
          order: { created_at: "DESC" },
        }
      )
    })
  })
})
