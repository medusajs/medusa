import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductCollectionServiceMock } from "../../../../../services/__mocks__/product-collection"

describe("GET /store/categories/:id", () => {
  describe("get collection by id successfully", () => {
    let subject
    beforeAll(async () => {
      subject = await request("GET", `/store/collections/${IdMap.getId("col")}`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls retrieve from product collection service", () => {
      expect(ProductCollectionServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductCollectionServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("col")
      )
    })

    it("returns variant decorated", () => {
      expect(subject.body.collection.id).toEqual(IdMap.getId("col"))
    })
  })
})
