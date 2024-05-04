import { IdMap, MockManager as manager } from "medusa-test-utils"
import { EventBusService, ProductCategoryService } from "../"
import {
  invalidProdCategoryId,
  productCategoryRepositoryMock as productCategoryRepository,
  validProdCategoryId,
  validProdCategoryIdWithChildren, validProdCategoryRankChange, validProdCategoryWithSiblings
} from "../../repositories/__mocks__/product-category"
import { tempReorderRank } from "../../types/product-category"
import { EventBusServiceMock as eventBusService } from "../__mocks__/event-bus"

const productCategoryService = new ProductCategoryService({
  manager,
  productCategoryRepository,
  eventBusService: eventBusService as unknown as EventBusService
})

describe("ProductCategoryService", () => {
  beforeEach(async () => { jest.clearAllMocks() })

  describe("retrieve", () => {
    it("successfully retrieves a product category", async () => {
      const validID = IdMap.getId(validProdCategoryId)
      const result = await productCategoryService.retrieve(
        validID
      )

      expect(result.id).toEqual(validID)
      expect(productCategoryRepository.findOneWithDescendants).toHaveBeenCalledTimes(1)
      expect(productCategoryRepository.findOneWithDescendants).toHaveBeenCalledWith({
        where: { id: validID },
      }, {})
    })

    it("fails on not-found product category id", async () => {
      const invalidID = IdMap.getId(invalidProdCategoryId)
      const categoryResponse = await productCategoryService
        .retrieve(invalidID)
        .catch((e) => e)

      expect(categoryResponse.message).toBe(
        `ProductCategory with id: ${invalidID} was not found`
      )
    })
  })

  describe("listAndCount", () => {
    it("successfully retrieves an array of product category", async () => {
      const validID = IdMap.getId(validProdCategoryId)
      const [result, count] = await productCategoryService
        .listAndCount({ q: validID })

      expect(count).toEqual(1)
      expect(result.length).toEqual(1)
      expect(result[0].id).toEqual(validID)
      expect(productCategoryRepository.getFreeTextSearchResultsAndCount).toHaveBeenCalledTimes(1)
      expect(productCategoryRepository.findDescendantsTree).not.toBeCalled()
      expect(productCategoryRepository.getFreeTextSearchResultsAndCount).toHaveBeenCalledWith(
        {
          skip: 0,
          take: 100,
          where: {},
        },
        validID,
        {},
        false,
      )
    })

    it("returns empty array if query doesn't match database results", async () => {
      const [result, count] = await productCategoryService
        .listAndCount({ q: IdMap.getId(invalidProdCategoryId) })

      expect(
        productCategoryRepository.getFreeTextSearchResultsAndCount
      ).toHaveBeenCalledTimes(1)
      expect(result).toEqual([])
      expect(count).toEqual(0)
    })

    it("successfully calls tree descendants when requested to be included", async () => {
      const validID = IdMap.getId(validProdCategoryId)
      const [result, count] = await productCategoryService
        .listAndCount({ include_descendants_tree: true })

      expect(result[0].id).toEqual(validID)
      expect(productCategoryRepository.getFreeTextSearchResultsAndCount).toHaveBeenCalledTimes(1)
      expect(productCategoryRepository.getFreeTextSearchResultsAndCount).toHaveBeenCalledWith(
        {
          skip: 0,
          take: 100,
          where: {},
        },
        undefined,
        {},
        true,
      )
    })
  })

  describe("create", () => {
    it("successfully creates a product category", async () => {
      await productCategoryService.create({ name: validProdCategoryId })

      expect(productCategoryRepository.create).toHaveBeenCalledTimes(1)
      expect(productCategoryRepository.create).toHaveBeenCalledWith({
        name: validProdCategoryId,
        rank: 0,
      })
    })

    it("emits a message on successful create", async () => {
      await productCategoryService.create({ name: validProdCategoryId })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "product-category.created",
        {
          id: IdMap.getId(validProdCategoryId),
        }
      )
    })
  })

  describe("delete", () => {
    it("successfully deletes a product category", async () => {
      const result = await productCategoryService.delete(
        IdMap.getId(validProdCategoryId)
      )

      expect(productCategoryRepository.delete).toBeCalledTimes(1)
      expect(productCategoryRepository.delete).toBeCalledWith(
        IdMap.getId(validProdCategoryId)
      )
    })

    it("returns without failure on not-found product category id", async () => {
      const categoryResponse = await productCategoryService
        .delete(IdMap.getId(invalidProdCategoryId))

      expect(categoryResponse).toBe(undefined)
    })

    it("fails on product category with children", async () => {
      const categoryResponse = await productCategoryService
        .delete(IdMap.getId(validProdCategoryIdWithChildren))
        .catch((e) => e)

      expect(categoryResponse.message).toBe(
        `Deleting ProductCategory (${IdMap.getId(validProdCategoryIdWithChildren)}) with category children is not allowed`
      )
    })

    it("emits a message on successful delete", async () => {
      const result = await productCategoryService.delete(
        IdMap.getId(validProdCategoryId)
      )

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "product-category.deleted",
        {
          id: IdMap.getId(validProdCategoryId),
        }
      )
    })

    it("deleting a category shifts its siblings into the correct rank", async () => {
      const result = await productCategoryService.delete(
        IdMap.getId(validProdCategoryWithSiblings)
      )

      expect(productCategoryRepository.delete).toBeCalledTimes(1)
      expect(productCategoryRepository.delete).toBeCalledWith(IdMap.getId(validProdCategoryWithSiblings))

      expect(productCategoryRepository.save).toBeCalledTimes(1)
      expect(productCategoryRepository.save).toBeCalledWith({
        id: IdMap.getId(validProdCategoryId),
        category_children: [],
        parent_category_id: null,
        rank: 0,
      })
    })
  })

  describe("update", () => {
    it("successfully updates a product category", async () => {
      await productCategoryService.update(IdMap.getId(validProdCategoryId), {
        name: "bathrobes",
      })

      expect(productCategoryRepository.save).toHaveBeenCalledTimes(1)
      expect(productCategoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: IdMap.getId(validProdCategoryId),
          name: "bathrobes",
        })
      )
    })

    it("successfully updates a product category rank and its siblings", async () => {
      await productCategoryService.update(
        IdMap.getId(validProdCategoryRankChange), {
          rank: 0
        }
      )

      expect(productCategoryRepository.save).toHaveBeenCalledTimes(3)
      expect(productCategoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: IdMap.getId(validProdCategoryRankChange),
          rank: tempReorderRank
        })
      )

      expect(productCategoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: IdMap.getId(validProdCategoryWithSiblings),
          rank: 1
        })
      )
    })

    it("fails on not-found Id product category", async () => {
      const error = await productCategoryService
        .update(IdMap.getId(invalidProdCategoryId), {
          name: "bathrobes",
        })
        .catch((e) => e)

      expect(error.message).toBe(
        `ProductCategory with id: ${IdMap.getId(
          invalidProdCategoryId
        )} was not found`
      )
    })

    it("emits a message on successful update", async () => {
      const result = await productCategoryService.update(
        IdMap.getId(validProdCategoryId),
        {
          name: "bathrobes",
        }
      )

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "product-category.updated",
        {
          id: IdMap.getId(validProdCategoryId),
        }
      )
    })
  })

  describe("addProducts", () => {
    it("should add a list of product to a category", async () => {
      const result = await productCategoryService.addProducts(
        IdMap.getId("product-category-id"),
        [IdMap.getId("product-id")]
      )

      expect(result).toBeUndefined()
      expect(productCategoryRepository.addProducts).toHaveBeenCalledTimes(1)
      expect(productCategoryRepository.addProducts).toHaveBeenCalledWith(
        IdMap.getId("product-category-id"),
        [IdMap.getId("product-id")]
      )
    })
  })

  describe("removeProducts", () => {
    it("should remove a list of product from a category", async () => {
      const result = await productCategoryService.removeProducts(
        IdMap.getId("product-category-id"),
        [IdMap.getId("product-id")]
      )

      expect(result).toBeUndefined()
      expect(productCategoryRepository.removeProducts).toHaveBeenCalledTimes(1)
      expect(productCategoryRepository.removeProducts).toHaveBeenCalledWith(
        IdMap.getId("product-category-id"),
        [IdMap.getId("product-id")]
      )
    })
  })
})
