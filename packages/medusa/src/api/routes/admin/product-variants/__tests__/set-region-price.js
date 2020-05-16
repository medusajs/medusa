import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("POST /admin/product-variants/:id/region-price", () => {
  describe("successfully sets region price", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/product-variants/${IdMap.getId("testVariant")}/region-price`,
        {
          payload: {
            regionId: IdMap.getId("region-fr"),
            amount: 100,
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

    it("calls service setCurrencyPrice", () => {
      expect(ProductVariantServiceMock.setRegionPrice).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.setRegionPrice).toHaveBeenCalledWith(
        IdMap.getId("testVariant"),
        IdMap.getId("region-fr"),
        100
      )
    })
  })
})
