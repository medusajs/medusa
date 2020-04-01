import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("GET /store/products", () => {
  describe("list all products", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", "/store/products")
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls get product from productSerice", () => {
      expect(ProductServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.list).toHaveBeenCalledWith({})
    })

    it("returns products", () => {
      expect(subject.body[0]._id).toEqual(IdMap.getId("product1"))
      expect(subject.body[1]._id).toEqual(IdMap.getId("product2"))
    })
  })
})
