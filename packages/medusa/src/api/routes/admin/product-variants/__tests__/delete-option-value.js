import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("DELETE /admin/product-variants/:id/options", () => {
  describe("successfully deletes option value", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/product-variants/${IdMap.getId("testVariant")}/options`,
        {
          payload: {
            optionId: IdMap.getId("testOption"),
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
    it("calls service deleteOptionValue", () => {
      expect(ProductVariantServiceMock.deleteOptionValue).toHaveBeenCalledTimes(
        1
      )
      expect(ProductVariantServiceMock.deleteOptionValue).toHaveBeenCalledWith(
        IdMap.getId("testVariant"),
        IdMap.getId("testOption")
      )
    })
  })
})
