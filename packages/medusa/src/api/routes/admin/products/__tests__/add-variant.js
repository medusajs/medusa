import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("POST /admin/products/:id/variant/:variantId", () => {
  describe("successful add variant", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/products/${IdMap.getId(
          "productWithOptions"
        )}/variant/${IdMap.getId("variant2")}`,
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

    it("calls service addVariant", () => {
      expect(ProductServiceMock.addVariant).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.addVariant).toHaveBeenCalledWith(
        IdMap.getId("productWithOptions"),
        IdMap.getId("variant2")
      )
    })
  })
})
