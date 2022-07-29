import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductCollectionServiceMock } from "../../../../../services/__mocks__/product-collection"

describe("DELETE /admin/collections/:id/products/batch", () => {
  describe("successfully removes products from collection", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/collections/${IdMap.getId("col")}/products/batch`,
        {
          payload: {
            product_ids: ["prod_1", "prod_2"],
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

    it("product collection service remove products", () => {
      expect(ProductCollectionServiceMock.removeProducts).toHaveBeenCalledTimes(
        1
      )
      expect(ProductCollectionServiceMock.removeProducts).toHaveBeenCalledWith(
        IdMap.getId("col"),
        ["prod_1", "prod_2"]
      )
    })
  })

  describe("error on invalid request", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/collections/${IdMap.getId("col")}/products/batch`,
        {
          payload: {
            product_ids: [],
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })
  })
})
