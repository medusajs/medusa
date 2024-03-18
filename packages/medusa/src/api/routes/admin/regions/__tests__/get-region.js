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

describe("GET /admin/regions/:region_id", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      const id = IdMap.getId("testRegion")
      subject = await request("GET", `/admin/regions/${id}`, {
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

    it("calls service addCountry", () => {
      expect(RegionServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(
        RegionServiceMock.retrieve.mock.calls[0][1].relations
      ).toHaveLength(defaultRelations.length)
      expect(RegionServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("testRegion"),
        {
          select: defaultFields,
          relations: expect.arrayContaining(defaultRelations),
        }
      )
    })
  })
})
