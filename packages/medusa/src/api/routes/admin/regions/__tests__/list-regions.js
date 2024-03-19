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
  "currency",
  "fulfillment_providers",
  "payment_providers",
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
      expect(RegionServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(
        RegionServiceMock.listAndCount.mock.calls[0][1].relations
      ).toHaveLength(defaultRelations.length)
      expect(RegionServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        {
          select: defaultFields,
          relations: expect.arrayContaining(defaultRelations),
          take: 50,
          skip: 0,
          order: { created_at: "DESC" },
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
      expect(subject.status).toEqual(200)
    })

    it("calls service list", () => {
      expect(RegionServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(
        RegionServiceMock.listAndCount.mock.calls[0][1].relations
      ).toHaveLength(defaultRelations.length)
      expect(RegionServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        {
          select: defaultFields,
          relations: expect.arrayContaining(defaultRelations),
          take: 20,
          skip: 10,
          order: { created_at: "DESC" },
        }
      )
    })
  })
})
