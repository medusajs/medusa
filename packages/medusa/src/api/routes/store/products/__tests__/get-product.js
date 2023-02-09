import { IdMap } from "medusa-test-utils"
import { defaultStoreProductsFields, defaultStoreProductsRelations } from ".."
import { request } from "../../../../../helpers/test-request"
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
        {
          select: defaultStoreProductsFields,
          relations: defaultStoreProductsRelations,
        }
      )
    })

    it("returns product decorated", () => {
      expect(subject.body.product.id).toEqual(IdMap.getId("product1"))
    })
  })

  describe("Query products with relations", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/products/${IdMap.getId("variantsWithPrices")}`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls retrieve() once", () => {
      expect(ProductServiceMock.retrieve).toHaveBeenCalledTimes(1)
    })

    it("endpoint called with defaultRelations", () => {
      expect(ProductServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("variantsWithPrices"),
        {
          select: defaultStoreProductsFields,
          relations: defaultStoreProductsRelations,
        }
      )
    })

    it("returns product with variant prices", () => {
      expect(
        subject.body.product.variants.some((variant) => variant.prices)
      ).toEqual(true)
      expect(subject.body.product.variants[0].prices[0].amount).toEqual(100)
    })
  })
})
