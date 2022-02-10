import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductCollectionServiceMock } from "../../../../../services/__mocks__/product-collection"

describe("POST /admin/collections/:id/products/batch", () => {
  describe("successful update", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/collections/${IdMap.getId("col")}/products/batch`,
        {
          payload: {
            add_product_ids: ["prod_1", "prod_2"],
            remove_product_ids: ["prod_3"],
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

    it("returns updated collection with new products", () => {
      expect(subject.body.collection.id).toEqual(IdMap.getId("col"))
    })

    it("product collection service update", () => {
      expect(ProductCollectionServiceMock.updateProducts).toHaveBeenCalledTimes(
        1
      )
      expect(ProductCollectionServiceMock.updateProducts).toHaveBeenCalledWith(
        IdMap.getId("col"),
        ["prod_1", "prod_2"],
        ["prod_3"]
      )
    })
  })
})
