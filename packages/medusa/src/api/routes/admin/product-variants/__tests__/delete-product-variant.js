import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("DELETE /admin/product-variants/:id", () => {
  describe("successfully deletes a product variant", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/product-variants/${IdMap.getId("testVariant")}`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls ProductVariantService delete", () => {
      expect(ProductVariantServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.delete).toHaveBeenCalledWith(
        IdMap.getId("testVariant")
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns correct delete data", () => {
      expect(subject.body).toEqual({
        id: IdMap.getId("testVariant"),
        object: "productVariant",
        deleted: true,
      })
    })
  })
})
