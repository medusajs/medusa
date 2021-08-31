import { request } from "../../../../../helpers/test-request"
import { IdMap } from "medusa-test-utils"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("Get product by id", () => {
  describe("get product by id successfull", () => {
    let subject
    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/products/${IdMap.getId("product1")}`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls get product from productSerice", () => {
      expect(ProductServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("product1"),
        { relations: ["images", "variants", "options"] }
      )
    })

    it("returns product decorated", () => {
      expect(subject.body.product.id).toEqual(IdMap.getId("product1"))
    })
  })
})
