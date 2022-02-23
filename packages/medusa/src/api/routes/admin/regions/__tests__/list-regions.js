import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { RegionServiceMock } from "../../../../../services/__mocks__/region"

const defaultFields = [
  "id",
  "name",
  "automatic_taxes",
  "gift_cards_taxable",
  "tax_provider_id",
  "currency_code",
  "tax_rate",
  "tax_code",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

const defaultRelations = [
  "countries",
  "payment_providers",
  "fulfillment_providers",
]

describe("GET /admin/regions", () => {
  describe("successfully lists regions", () => {
    let subject

    afterAll(() => {
      jest.clearAllMocks()
    })

    beforeAll(async () => {
      subject = await request("GET", `/admin/regions`, {
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

    it("calls service list", () => {
      expect(RegionServiceMock.list).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.list).toHaveBeenCalledWith(
        {},
        {
          select: defaultFields,
          relations: defaultRelations,
          take: 50,
          skip: 0,
        }
      )
    })
  })

  describe("successfully lists regions with limit and offset", () => {
    let subject

    afterAll(() => {
      jest.clearAllMocks()
    })

    beforeAll(async () => {
      subject = await request("GET", `/admin/regions?offset=10&limit=20`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 200", () => {
      console.log(subject)
      expect(subject.status).toEqual(200)
    })

    it("calls service list", () => {
      expect(RegionServiceMock.list).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.list).toHaveBeenCalledWith(
        {},
        {
          select: defaultFields,
          relations: defaultRelations,
          take: 20,
          skip: 10,
        }
      )
    })
  })
})
