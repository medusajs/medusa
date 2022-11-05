import { IdMap } from "medusa-test-utils"
import { defaultStoreProductOptionRelations } from ".."
import { request } from "../../../../../helpers/test-request"
import { ProductOptionServiceMock } from "../../../../../services/__mocks__/product-option"

describe("GET /store/product-options/:id", () => {
  describe("get product option by id successfully", () => {
    let subject
    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/product-options/${IdMap.getId("opt")}`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls retrieve from product option service", () => {
      expect(ProductOptionServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductOptionServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("product_option_1"),
        { relations: defaultStoreProductOptionRelations }
      )
    })

    it("returns variant decorated", () => {
      expect(subject.body.product_option.id).toEqual(IdMap.getId("opt"))
    })
  })
})
