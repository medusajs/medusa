import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("DELETE /admin/products/:id", () => {
  describe("successfully deletes a product", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/products/${IdMap.getId("product1")}`,
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

    it("calls ProductService delete", () => {
      expect(ProductServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.delete).toHaveBeenCalledWith(
        IdMap.getId("product1")
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns correct delete data", () => {
      expect(subject.body).toEqual({
        id: IdMap.getId("product1"),
        object: "product",
        deleted: true,
      })
    })
  })
})
