import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductCollectionServiceMock } from "../../../../../services/__mocks__/product-collection"

describe("POST /admin/collections/:id", () => {
  describe("successful update", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/collections/${IdMap.getId("col")}`,
        {
          payload: {
            title: "Suits and vests",
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

    it("returns updated product collection", () => {
      expect(subject.body.collection.id).toEqual(IdMap.getId("col"))
    })

    it("product collection service update", () => {
      expect(ProductCollectionServiceMock.update).toHaveBeenCalledTimes(1)
      expect(ProductCollectionServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("col"),
        {
          title: "Suits and vests",
        }
      )
    })
  })
})
