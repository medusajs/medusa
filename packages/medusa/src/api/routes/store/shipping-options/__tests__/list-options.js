import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingOptionServiceMock } from "../../../../../services/__mocks__/shipping-option"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("GET /store/shipping-options", () => {
  describe("retrieves shipping options by product ids", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/shipping-options?product_ids=1,2,3&region_id=test-region`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls ShippingProfileService fetchOptionsByProductIds", () => {
      expect(ProductServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.list).toHaveBeenCalledWith({
        id: ["1", "2", "3"],
      })
      expect(ShippingOptionServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ShippingOptionServiceMock.list).toHaveBeenCalledWith(
        {
          admin_only: false,
          profile_id: [undefined, undefined],
          region_id: "test-region",
        },
        { relations: ["requirements"] }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })
  })
})
