import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("POST /admin/products/:id/variants/:variantId", () => {
  describe("successful removes variant", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/products/${IdMap.getId(
          "productWithOptions"
        )}/variants/${IdMap.getId("variant1")}`,
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

    it("calls service removeVariant", () => {
      expect(ProductServiceMock.removeVariant).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.removeVariant).toHaveBeenCalledWith(
        IdMap.getId("productWithOptions"),
        IdMap.getId("variant1")
      )
    })

    it("returns decorated product with variant removed", () => {
      expect(subject.body._id).toEqual(IdMap.getId("productWithOptions"))
      expect(subject.body.decorated).toEqual(true)
    })
  })
})
