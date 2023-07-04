import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductCollectionServiceMock } from "../../../../../services/__mocks__/product-collection"

describe("DELETE /admin/collections/:id", () => {
  describe("successful removes collection", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/collections/${IdMap.getId("collection")}`,
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

    it("calls product collection service delete", () => {
      expect(ProductCollectionServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(ProductCollectionServiceMock.delete).toHaveBeenCalledWith(
        IdMap.getId("collection")
      )
    })

    it("returns delete result", () => {
      expect(subject.body).toEqual({
        id: IdMap.getId("collection"),
        object: "product-collection",
        deleted: true,
      })
    })
  })
})
