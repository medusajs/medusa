import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductTypeServiceMock } from "../../../../../services/__mocks__/product-type"

describe("GET /store/product-types/:id", () => {
  describe("get product type by id successfully", () => {
    let subject
    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/product-types/${IdMap.getId("ptyp")}`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls retrieve from product types service", () => {
      expect(ProductTypeServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductTypeServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("ptyp")
      )
    })

    it("returns variant decorated", () => {
      expect(subject.body.product_type.id).toEqual(IdMap.getId("ptyp"))
    })
  })
})
