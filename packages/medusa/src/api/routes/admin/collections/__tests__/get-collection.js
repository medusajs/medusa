import { IdMap } from "medusa-test-utils"
import { defaultAdminCollectionsRelations } from ".."
import { request } from "../../../../../helpers/test-request"
import { ProductCollectionServiceMock } from "../../../../../services/__mocks__/product-collection"

describe("GET /admin/categories/:id", () => {
  describe("get collection by id successfully", () => {
    let subject
    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/collections/${IdMap.getId("col")}`,
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

    it("calls retrieve from product collection service", () => {
      expect(ProductCollectionServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductCollectionServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("col"),
        {relations: defaultAdminCollectionsRelations}
      )
    })

    it("returns variant decorated", () => {
      expect(subject.body.collection.id).toEqual(IdMap.getId("col"))
    })
  })
})
