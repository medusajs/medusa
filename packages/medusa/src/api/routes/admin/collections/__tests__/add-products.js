import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductCollectionServiceMock } from "../../../../../services/__mocks__/product-collection"

describe("POST /admin/collections/:id/products/batch", () => {
  describe("successfully adds products to collection", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
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

    it("returns updated collection with new products", () => {
      expect(subject.body.collection.id).toEqual(IdMap.getId("col"))
    })

    it("product collection service update", () => {
      expect(ProductCollectionServiceMock.addProducts).toHaveBeenCalledTimes(1)
      expect(
        ProductCollectionServiceMock.addProducts
      ).toHaveBeenCalledWith(IdMap.getId("col"), ["prod_1", "prod_2"])
    })
  })

  describe("error on non-existing collection", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/collections/null/products/batch`,
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

    it("throws error", () => {
      expect(subject.body.message).toBe("Product collection not found")
    })
  })

  describe("error invalid request", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
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
