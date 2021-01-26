import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { RegionServiceMock } from "../../../../../services/__mocks__/region"

describe("Get region by id", () => {
  describe("get region by id successfull", () => {
    let subject
    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/regions/${IdMap.getId("testRegion")}`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls retrieve from region service", () => {
      expect(RegionServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("testRegion"),
        {
          relations: [
            "countries",
            "payment_providers",
            "fulfillment_providers",
          ],
        }
      )
    })

    it("returns region", () => {
      expect(subject.body.region.id).toEqual(IdMap.getId("testRegion"))
    })
  })
})
