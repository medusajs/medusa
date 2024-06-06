import { Modules } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import { ProductStatus } from "@medusajs/utils"
import { Product, ProductCategory } from "@models"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "medusa-test-utils"
import { createProductCategories } from "../../__fixtures__/product-category"
import { productCategoriesRankData } from "../../__fixtures__/product-category/data"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IProductModuleService>({
  moduleName: Modules.PRODUCT,
  injectedDependencies: {
    eventBusModuleService: new MockEventBusService(),
  },
  testSuite: ({ MikroOrmWrapper, service }) => {
    describe("ProductModuleService product categories", () => {
      let productOne: Product
      let productTwo: Product
      let productCategoryOne: ProductCategory
      let productCategoryTwo: ProductCategory
      let productCategories: ProductCategory[]

      beforeEach(async () => {
        const testManager = await MikroOrmWrapper.forkManager()

        productOne = testManager.create(Product, {
          id: "product-1",
          title: "product 1",
          status: ProductStatus.PUBLISHED,
        })

        productTwo = testManager.create(Product, {
          id: "product-2",
          title: "product 2",
          status: ProductStatus.PUBLISHED,
        })

        const productCategoriesData = [
          {
            id: "test-1",
            name: "category 1",
            products: [productOne],
          },
          {
            id: "test-2",
            name: "category",
            products: [productTwo],
          },
        ]

        productCategories = await createProductCategories(
          testManager,
          productCategoriesData
        )

        productCategoryOne = productCategories[0]
        productCategoryTwo = productCategories[1]

        await testManager.persistAndFlush([
          productCategoryOne,
          productCategoryTwo,
        ])
      })

      afterEach(async () => {
        jest.clearAllMocks()
      })

      describe("listCategories", () => {
        it("should return categories queried by ID", async () => {
          const results = await service.listCategories({
            id: productCategoryOne.id,
          })

          expect(results).toEqual([
            expect.objectContaining({
              id: productCategoryOne.id,
            }),
          ])
        })

        it("should return categories based on the options and filter parameter", async () => {
          let results = await service.listCategories(
            {
              id: productCategoryOne.id,
            },
            {
              take: 1,
            }
          )

          expect(results).toEqual([
            expect.objectContaining({
              id: productCategoryOne.id,
            }),
          ])

          results = await service.listCategories({}, { take: 1, skip: 1 })

          expect(results).toEqual([
            expect.objectContaining({
              id: productCategoryTwo.id,
            }),
          ])
        })

        it("should return only requested fields and relations for categories", async () => {
          const results = await service.listCategories(
            {
              id: productCategoryOne.id,
            },
            {
              select: ["id", "name", "products.title"],
              relations: ["products"],
            }
          )

          expect(results).toEqual([
            expect.objectContaining({
              id: "test-1",
              name: "category 1",
              products: [
                expect.objectContaining({
                  id: "product-1",
                  title: "product 1",
                }),
              ],
            }),
          ])
        })
      })

      describe("listAndCountCategories", () => {
        it("should return categories and count queried by ID", async () => {
          const results = await service.listAndCountCategories({
            id: productCategoryOne.id,
          })

          expect(results[1]).toEqual(1)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: productCategoryOne.id,
            }),
          ])
        })

        it("should return categories and count based on the options and filter parameter", async () => {
          let results = await service.listAndCountCategories(
            {
              id: productCategoryOne.id,
            },
            {
              take: 1,
            }
          )

          expect(results[1]).toEqual(1)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: productCategoryOne.id,
            }),
          ])

          results = await service.listAndCountCategories({}, { take: 1 })

          expect(results[1]).toEqual(2)

          results = await service.listAndCountCategories(
            {},
            { take: 1, skip: 1 }
          )

          expect(results[1]).toEqual(2)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: productCategoryTwo.id,
            }),
          ])
        })

        it("should return only requested fields and relations for categories", async () => {
          const results = await service.listAndCountCategories(
            {
              id: productCategoryOne.id,
            },
            {
              select: ["id", "name", "products.title"],
              relations: ["products"],
            }
          )

          expect(results[1]).toEqual(1)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: "test-1",
              name: "category 1",
              products: [
                expect.objectContaining({
                  id: "product-1",
                  title: "product 1",
                }),
              ],
            }),
          ])
        })
      })

      describe("retrieveCategory", () => {
        it("should return the requested category", async () => {
          const result = await service.retrieveCategory(productCategoryOne.id, {
            select: ["id", "name"],
          })

          expect(result).toEqual(
            expect.objectContaining({
              id: "test-1",
              name: "category 1",
            })
          )
        })

        it("should return requested attributes when requested through config", async () => {
          const result = await service.retrieveCategory(productCategoryOne.id, {
            select: ["id", "name", "products.title"],
            relations: ["products"],
          })

          expect(result).toEqual(
            expect.objectContaining({
              id: "test-1",
              name: "category 1",
              products: [
                expect.objectContaining({
                  id: "product-1",
                  title: "product 1",
                }),
              ],
            })
          )
        })

        it("should throw an error when a category with ID does not exist", async () => {
          let error

          try {
            await service.retrieveCategory("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "ProductCategory with id: does-not-exist was not found"
          )
        })
      })

      describe("createCategory", () => {
        it("should create a category successfully", async () => {
          await service.createCategory({
            name: "New Category",
            parent_category_id: productCategoryOne.id,
          })

          const [productCategory] = await service.listCategories(
            {
              name: "New Category",
            },
            {
              select: ["name", "rank"],
            }
          )

          expect(productCategory).toEqual(
            expect.objectContaining({
              name: "New Category",
              rank: 0,
            })
          )
        })

        it("should emit events through event bus", async () => {
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")

          const category = await service.createCategory({
            name: "New Category",
            parent_category_id: productCategoryOne.id,
          })

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith("product-category.created", {
            id: category.id,
          })
        })

        it("should append rank from an existing category depending on parent", async () => {
          await service.createCategory({
            name: "New Category",
            parent_category_id: productCategoryOne.id,
            rank: 0,
          })

          await service.createCategory({
            name: "New Category 2",
            parent_category_id: productCategoryOne.id,
          })

          const [productCategoryNew] = await service.listCategories(
            {
              name: "New Category 2",
            },
            {
              select: ["name", "rank"],
            }
          )

          expect(productCategoryNew).toEqual(
            expect.objectContaining({
              name: "New Category 2",
              rank: 1,
            })
          )

          await service.createCategory({
            name: "New Category 2.1",
            parent_category_id: productCategoryNew.id,
          })

          const [productCategoryWithParent] = await service.listCategories(
            {
              name: "New Category 2.1",
            },
            {
              select: ["name", "rank", "parent_category_id"],
            }
          )

          expect(productCategoryWithParent).toEqual(
            expect.objectContaining({
              name: "New Category 2.1",
              parent_category_id: productCategoryNew.id,
              rank: 0,
            })
          )
        })
      })

      describe("updateCategory", () => {
        let productCategoryZero
        let productCategoryOne
        let productCategoryTwo
        let productCategoryZeroZero
        let productCategoryZeroOne
        let productCategoryZeroTwo
        let categories

        beforeEach(async () => {
          const testManager = await MikroOrmWrapper.forkManager()

          categories = await createProductCategories(
            testManager,
            productCategoriesRankData
          )

          productCategoryZero = categories[0]
          productCategoryOne = categories[1]
          productCategoryTwo = categories[2]
          productCategoryZeroZero = categories[3]
          productCategoryZeroOne = categories[4]
          productCategoryZeroTwo = categories[5]
        })

        it("should emit events through event bus", async () => {
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
          await service.updateCategory(productCategoryZero.id, {
            name: "New Category",
          })

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith("product-category.updated", {
            id: productCategoryZero.id,
          })
        })

        it("should update the name of the category successfully", async () => {
          await service.updateCategory(productCategoryZero.id, {
            name: "New Category",
          })

          const productCategory = await service.retrieveCategory(
            productCategoryZero.id,
            {
              select: ["name"],
            }
          )

          expect(productCategory.name).toEqual("New Category")
        })

        it("should throw an error when an id does not exist", async () => {
          let error

          try {
            await service.updateCategory("does-not-exist", {
              name: "New Category",
            })
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            `ProductCategory not found ({ id: 'does-not-exist' })`
          )
        })

        it("should reorder rank successfully in the same parent", async () => {
          await service.updateCategory(productCategoryTwo.id, {
            rank: 0,
          })

          const productCategories = await service.listCategories(
            {
              parent_category_id: null,
            },
            {
              select: ["name", "rank"],
            }
          )

          expect(productCategories).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: productCategoryTwo.id,
                rank: 0,
              }),
              expect.objectContaining({
                id: productCategoryZero.id,
                rank: 1,
              }),
              expect.objectContaining({
                id: productCategoryOne.id,
                rank: 2,
              }),
            ])
          )
        })

        it("should reorder rank successfully when changing parent", async () => {
          await service.updateCategory(productCategoryTwo.id, {
            rank: 0,
            parent_category_id: productCategoryZero.id,
          })

          const productCategories = await service.listCategories(
            {
              parent_category_id: productCategoryZero.id,
            },
            {
              select: ["name", "rank"],
            }
          )

          expect(productCategories).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: productCategoryTwo.id,
                rank: 0,
              }),
              expect.objectContaining({
                id: productCategoryZeroZero.id,
                rank: 1,
              }),
              expect.objectContaining({
                id: productCategoryZeroOne.id,
                rank: 2,
              }),
              expect.objectContaining({
                id: productCategoryZeroTwo.id,
                rank: 3,
              }),
            ])
          )
        })

        it("should reorder rank successfully when changing parent and in first position", async () => {
          await service.updateCategory(productCategoryTwo.id, {
            rank: 0,
            parent_category_id: productCategoryZero.id,
          })

          const productCategories = await service.listCategories(
            {
              parent_category_id: productCategoryZero.id,
            },
            {
              select: ["name", "rank"],
            }
          )

          expect(productCategories).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: productCategoryTwo.id,
                rank: 0,
              }),
              expect.objectContaining({
                id: productCategoryZeroZero.id,
                rank: 1,
              }),
              expect.objectContaining({
                id: productCategoryZeroOne.id,
                rank: 2,
              }),
              expect.objectContaining({
                id: productCategoryZeroTwo.id,
                rank: 3,
              }),
            ])
          )
        })
      })

      describe("deleteCategory", () => {
        let productCategoryZero
        let productCategoryOne
        let productCategoryTwo
        let categories

        beforeEach(async () => {
          const testManager = await MikroOrmWrapper.forkManager()

          categories = await createProductCategories(
            testManager,
            productCategoriesRankData
          )

          productCategoryZero = categories[0]
          productCategoryOne = categories[1]
          productCategoryTwo = categories[2]
        })

        it("should emit events through event bus", async () => {
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
          await service.deleteCategory(productCategoryOne.id)

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith("product-category.deleted", {
            id: productCategoryOne.id,
          })
        })

        it("should throw an error when an id does not exist", async () => {
          let error

          try {
            await service.deleteCategory("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            `ProductCategory not found ({ id: 'does-not-exist' })`
          )
        })

        it("should throw an error when it has children", async () => {
          let error

          try {
            await service.deleteCategory(productCategoryZero.id)
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            `Deleting ProductCategory (category-0-0) with category children is not allowed`
          )
        })

        it("should reorder siblings rank successfully on deleting", async () => {
          await service.deleteCategory(productCategoryOne.id)

          const productCategories = await service.listCategories(
            {
              parent_category_id: null,
            },
            {
              select: ["id", "rank"],
            }
          )

          expect(productCategories).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: productCategoryZero.id,
                rank: 0,
              }),
              expect.objectContaining({
                id: productCategoryTwo.id,
                rank: 1,
              }),
            ])
          )
        })
      })
    })
  },
})
