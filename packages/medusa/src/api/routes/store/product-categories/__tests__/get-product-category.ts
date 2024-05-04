import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import {
  defaultStoreProductCategoryRelations,
  defaultStoreCategoryScope,
  defaultStoreProductCategoryFields
} from ".."
import {
  ProductCategoryServiceMock,
  validProdCategoryId,
  invalidProdCategoryId,
} from "../../../../../services/__mocks__/product-category"

describe("GET /store/product-categories/:id", () => {
  describe("get product category by id successfully", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/store/product-categories/${IdMap.getId(validProdCategoryId)}`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls retrieve from product category service", () => {
      expect(ProductCategoryServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductCategoryServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId(validProdCategoryId),
        {
          relations: defaultStoreProductCategoryRelations,
          select: defaultStoreProductCategoryFields,
        },
        defaultStoreCategoryScope
      )
    })

    it("returns product category", () => {
      expect(subject.body.product_category.id).toEqual(IdMap.getId(validProdCategoryId))
    })
  })

  describe("returns 404 error when ID is invalid", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/store/product-categories/${IdMap.getId(invalidProdCategoryId)}`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls retrieve from product category service", () => {
      expect(ProductCategoryServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductCategoryServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId(invalidProdCategoryId),
        {
          relations: defaultStoreProductCategoryRelations,
          select: defaultStoreProductCategoryFields,
        },
        defaultStoreCategoryScope
      )
    })

    it("throws not found error", () => {
      expect(subject.body.type).toEqual("not_found")
    })
  })
})
