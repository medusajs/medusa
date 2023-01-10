import { IdMap, MockRepository, MockManager } from "medusa-test-utils"
import ProductCategoryService from "../product-category"

describe("ProductCategoryService", () => {
  describe("retrieve", () => {
    const productCategoryRepository = MockRepository({
      findOne: query => {
        if (query.where.id === "not-found") {
          return Promise.resolve(undefined)
        }

        return Promise.resolve({ id: IdMap.getId("skinny-jeans") })
      },
      findDescendantsTree: productCategory => {
        return Promise.resolve(productCategory)
      }
    })

    const productCategoryService = new ProductCategoryService({
      manager: MockManager,
      productCategoryRepository,
    })

    beforeEach(async () => { jest.clearAllMocks() })

    it("successfully retrieves a product category", async () => {
      const result = await productCategoryService.retrieve(
        IdMap.getId("skinny-jeans")
      )

      expect(result.id).toEqual(IdMap.getId("skinny-jeans"))
      expect(productCategoryRepository.findOne).toHaveBeenCalledTimes(1)
      expect(productCategoryRepository.findDescendantsTree).toHaveBeenCalledTimes(1)
      expect(productCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("skinny-jeans") },
      })
    })

    it("fails on not-found product category id", async () => {
      const categoryResponse = await productCategoryService
        .retrieve("not-found")
        .catch((e) => e)

      expect(categoryResponse.message).toBe(
        `ProductCategory with id: not-found was not found`
      )
    })
  })

  describe("delete", () => {
    const productCategoryRepository = MockRepository({
      findOne: query => {
        if (query.where.id === "not-found") {
          return Promise.resolve(undefined)
        }

        if (query.where.id === "with-children") {
          return Promise.resolve({
            id: IdMap.getId("with-children"),
            category_children: [{
              id: IdMap.getId("skinny-jeans"),
            }]
          })
        }

        return Promise.resolve({
          id: IdMap.getId("jeans"),
          category_children: []
        })
      },
      findDescendantsTree: (productCategory) => {
        return Promise.resolve(productCategory)
      },
      softRemove: (productCategory) => {
        return Promise.resolve(productCategory)
      }
    })

    const productCategoryService = new ProductCategoryService({
      manager: MockManager,
      productCategoryRepository,
    })

    beforeEach(async () => { jest.clearAllMocks() })

    it("successfully deletes a product category", async () => {
      const result = await productCategoryService.delete(
        IdMap.getId("jeans")
      )

      expect(productCategoryRepository.softRemove).toBeCalledTimes(1)
      expect(productCategoryRepository.softRemove).toBeCalledWith({
        id: IdMap.getId("jeans"),
        category_children: [],
      })
    })

    it("fails on not-found product category id", async () => {
      const categoryResponse = await productCategoryService
        .delete("not-found")
        .catch((e) => e)

      expect(categoryResponse.message).toBe(
        `ProductCategory with id: not-found was not found`
      )
    })

    it("fails on product category with children", async () => {
      const categoryResponse = await productCategoryService
        .delete("with-children")
        .catch((e) => e)

      expect(categoryResponse.message).toBe(
        `Deleting ProductCategory (with-children) with category children is not allowed`
      )
    })
  })
})
