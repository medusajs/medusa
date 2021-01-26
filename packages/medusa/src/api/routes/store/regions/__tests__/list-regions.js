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
      expect(RegionServiceMock.list).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.list).toHaveBeenCalledWith(
        {},
        {
          relations: [
            "countries",
            "payment_providers",
            "fulfillment_providers",
          ],
          skip: 0,
          take: 100,
        }
      )
    })

    it("returns regions", () => {
      expect(subject.body.regions[0].id).toEqual(IdMap.getId("testRegion"))
    })
  })
})
