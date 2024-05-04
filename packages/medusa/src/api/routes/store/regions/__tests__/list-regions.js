import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { RegionServiceMock } from "../../../../../services/__mocks__/region"

describe("List regions", () => {
  describe("list regions", () => {
    let subject
    beforeAll(async () => {
      subject = await request("GET", `/store/regions`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls list from region service", () => {
      expect(RegionServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(
        RegionServiceMock.listAndCount.mock.calls[0][1].relations
      ).toHaveLength(4)
      expect(RegionServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        {
          relations: expect.arrayContaining([
            "countries",
            "currency",
            "fulfillment_providers",
            "payment_providers",
          ]),
          select: [
            "id",
            "name",
            "currency_code",
            "tax_rate",
            "tax_code",
            "gift_cards_taxable",
            "automatic_taxes",
            "tax_provider_id",
            "metadata",
            "created_at",
            "updated_at",
            "deleted_at",
          ],
          skip: 0,
          take: 100,
          order: { created_at: "DESC" },
        }
      )
    })

    it("returns regions", () => {
      expect(subject.body.regions[0].id).toEqual(IdMap.getId("testRegion"))
    })
  })
})
