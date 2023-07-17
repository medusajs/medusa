import { SqlEntityManager } from "@mikro-orm/postgresql"

import { ProductCategory } from "@models"
import { ProductCategoryRepository } from "@repositories"
import { ProductCategoryService } from "@services"

import { createProductCategories } from "../../../__fixtures__/product-category"
import { productCategoriesData } from "../../../__fixtures__/product-category/data"
import { TestDatabase } from "../../../utils"

jest.setTimeout(30000)

describe("Product category Service", () => {
  let service: ProductCategoryService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let productCategories!: ProductCategory[]

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    const productCategoryRepository = new ProductCategoryRepository({
      manager: repositoryManager,
    })

    service = new ProductCategoryService({
      productCategoryRepository,
    })
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("list", () => {
    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      productCategories = await createProductCategories(
        testManager,
        productCategoriesData
      )
    })

    it("lists all product categories", async () => {
      const productCategoryResults = await service.list(
        {},
        {
          select: ["id", "parent_category_id"],
        }
      )

      expect(productCategoryResults).toEqual([
        expect.objectContaining({
          id: "category-0",
          parent_category_id: null,
        }),
        expect.objectContaining({
          id: "category-1",
          parent_category: expect.objectContaining({
            id: "category-0",
          }),
        }),
        expect.objectContaining({
          id: "category-1-a",
          parent_category: expect.objectContaining({
            id: "category-1",
          }),
        }),
        expect.objectContaining({
          id: "category-1-b",
          parent_category: expect.objectContaining({
            id: "category-1",
          }),
        }),
        expect.objectContaining({
          id: "category-1-b-1",
          parent_category: expect.objectContaining({
            id: "category-1-b",
          }),
        }),
      ])
    })

    it("scopes product categories by parent_category_id", async () => {
      let productCategoryResults = await service.list(
        { parent_category_id: null },
        {
          select: ["id"],
        }
      )

      expect(productCategoryResults).toEqual([
        expect.objectContaining({
          id: "category-0",
        }),
      ])

      productCategoryResults = await service.list({
        parent_category_id: "category-0",
      })

      expect(productCategoryResults).toEqual([
        expect.objectContaining({
          id: "category-1",
        }),
      ])

      productCategoryResults = await service.list({
        parent_category_id: ["category-1-b", "category-0"],
      })

      expect(productCategoryResults).toEqual([
        expect.objectContaining({
          id: "category-1",
        }),
        expect.objectContaining({
          id: "category-1-b-1",
        }),
      ])
    })

    it("includes the entire list of descendants when include_descendants_tree is true", async () => {
      const productCategoryResults = await service.list(
        {
          parent_category_id: null,
          include_descendants_tree: true,
        },
        {
          select: ["id", "handle"],
        }
      )

      const serializedObject = JSON.parse(
        JSON.stringify(productCategoryResults)
      )

      expect(serializedObject).toEqual([
        expect.objectContaining({
          id: "category-0",
          handle: "category-0",
          mpath: "category-0.",
          parent_category_id: null,
          parent_category: null,
          category_children: [
            expect.objectContaining({
              id: "category-1",
              handle: "category-1",
              mpath: "category-0.category-1.",
              parent_category_id: "category-0",
              parent_category: "category-0",
              category_children: [
                expect.objectContaining({
                  id: "category-1-a",
                  handle: "category-1-a",
                  mpath: "category-0.category-1.category-1-a.",
                  parent_category_id: "category-1",
                  parent_category: "category-1",
                  category_children: [],
                }),
                expect.objectContaining({
                  id: "category-1-b",
                  handle: "category-1-b",
                  mpath: "category-0.category-1.category-1-b.",
                  parent_category_id: "category-1",
                  parent_category: "category-1",
                  category_children: [
                    expect.objectContaining({
                      id: "category-1-b-1",
                      handle: "category-1-b-1",
                      mpath:
                        "category-0.category-1.category-1-b.category-1-b-1.",
                      parent_category_id: "category-1-b",
                      parent_category: "category-1-b",
                      category_children: [],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ])
    })

    it("scopes children when include_descendants_tree is true", async () => {
      const productCategoryResults = await service.list(
        {
          parent_category_id: null,
          include_descendants_tree: true,
          is_internal: false,
        },
        {
          select: ["id", "handle"],
        }
      )

      const serializedObject = JSON.parse(
        JSON.stringify(productCategoryResults)
      )

      expect(serializedObject).toEqual([
        expect.objectContaining({
          id: "category-0",
          handle: "category-0",
          mpath: "category-0.",
          parent_category_id: null,
          parent_category: null,
          category_children: [
            expect.objectContaining({
              id: "category-1",
              handle: "category-1",
              mpath: "category-0.category-1.",
              parent_category_id: "category-0",
              parent_category: "category-0",
              category_children: [
                expect.objectContaining({
                  id: "category-1-a",
                  handle: "category-1-a",
                  mpath: "category-0.category-1.category-1-a.",
                  parent_category_id: "category-1",
                  parent_category: "category-1",
                  category_children: [],
                }),
              ],
            }),
          ],
        }),
      ])
    })
  })

  describe("retrieve", () => {
    const categoryOneId = "category-1"

    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      productCategories = await createProductCategories(
        testManager,
        productCategoriesData
      )
    })

    it("should return category for the given id", async () => {
      const productCategoryResults = await service.retrieve(
        categoryOneId,
      )

      expect(productCategoryResults).toEqual(
        expect.objectContaining({
          id:  categoryOneId
        })
      )
    })

    it("should throw an error when category with id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('ProductCategory with id: does-not-exist was not found')
    })

    it("should throw an error when an id is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"productCategoryId" must be defined')
    })

    it("should return category based on config select param", async () => {
      const productCategoryResults = await service.retrieve(
        categoryOneId,
        {
          select: ["id", "parent_category_id"],
        }
      )

      expect(productCategoryResults).toEqual(
        expect.objectContaining({
          id:  categoryOneId,
          parent_category_id: "category-0",
        })
      )
    })

    it("should return category based on config relation param", async () => {
      const productCategoryResults = await service.retrieve(
        categoryOneId,
        {
          select: ["id", "parent_category_id"],
          relations: ["parent_category"]
        }
      )

      expect(productCategoryResults).toEqual(
        expect.objectContaining({
          id:  categoryOneId,
          category_children: [
            expect.objectContaining({
              id: 'category-1-a',
            }),
            expect.objectContaining({
              id: 'category-1-b',
            })
          ],
          parent_category: expect.objectContaining({
            id: "category-0"
          })
        })
      )
    })
  })

  describe("listAndCount", () => {
    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      productCategories = await createProductCategories(
        testManager,
        productCategoriesData
      )
    })

    it("should return categories and count based on take and skip", async () => {
      let results = await service.listAndCount(
        {},
        {
          take: 1,
        }
      )

      expect(results[1]).toEqual(5)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: "category-0",
        }),
      ])

      results = await service.listAndCount(
        {},
        {
          take: 1,
          skip: 1
        }
      )

      expect(results[1]).toEqual(5)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: "category-1",
        }),
      ])
    })

    it("should return all product categories and count", async () => {
      const productCategoryResults = await service.listAndCount(
        {},
        {
          select: ["id", "parent_category_id"],
          relations: ["parent_category"],
        }
      )

      expect(productCategoryResults[1]).toEqual(5)
      expect(productCategoryResults[0]).toEqual([
        expect.objectContaining({
          id: "category-0",
          parent_category: null
        }),
        expect.objectContaining({
          id: "category-1",
          parent_category: expect.objectContaining({
            id: "category-0",
          }),
        }),
        expect.objectContaining({
          id: "category-1-a",
          parent_category: expect.objectContaining({
            id: "category-1",
          }),
        }),
        expect.objectContaining({
          id: "category-1-b",
          parent_category: expect.objectContaining({
            id: "category-1",
          }),
        }),
        expect.objectContaining({
          id: "category-1-b-1",
          parent_category: expect.objectContaining({
            id: "category-1-b",
          }),
        }),
      ])
    })

    it("should only return categories that are scoped by parent_category_id", async () => {
      let productCategoryResults = await service.listAndCount(
        { parent_category_id: null },
        {
          select: ["id"],
        }
      )

      expect(productCategoryResults[1]).toEqual(1)
      expect(productCategoryResults[0]).toEqual([
        expect.objectContaining({
          id: "category-0",
        }),
      ])

      productCategoryResults = await service.listAndCount({
        parent_category_id: "category-0",
      })

      expect(productCategoryResults[1]).toEqual(1)
      expect(productCategoryResults[0]).toEqual([
        expect.objectContaining({
          id: "category-1",
        }),
      ])

      productCategoryResults = await service.listAndCount({
        parent_category_id: ["category-1-b", "category-0"],
      })

      expect(productCategoryResults[1]).toEqual(2)
      expect(productCategoryResults[0]).toEqual([
        expect.objectContaining({
          id: "category-1",
        }),
        expect.objectContaining({
          id: "category-1-b-1",
        }),
      ])
    })

    it("should includes descendants when include_descendants_tree is true", async () => {
      const productCategoryResults = await service.listAndCount(
        {
          parent_category_id: null,
          include_descendants_tree: true,
        },
        {
          select: ["id", "handle"],
        }
      )

      expect(productCategoryResults[1]).toEqual(1)

      const serializedObject = JSON.parse(
        JSON.stringify(productCategoryResults[0])
      )

      expect(serializedObject).toEqual([
        expect.objectContaining({
          id: "category-0",
          handle: "category-0",
          mpath: "category-0.",
          parent_category_id: null,
          parent_category: null,
          category_children: [
            expect.objectContaining({
              id: "category-1",
              handle: "category-1",
              mpath: "category-0.category-1.",
              parent_category_id: "category-0",
              parent_category: "category-0",
              category_children: [
                expect.objectContaining({
                  id: "category-1-a",
                  handle: "category-1-a",
                  mpath: "category-0.category-1.category-1-a.",
                  parent_category_id: "category-1",
                  parent_category: "category-1",
                  category_children: [],
                }),
                expect.objectContaining({
                  id: "category-1-b",
                  handle: "category-1-b",
                  mpath: "category-0.category-1.category-1-b.",
                  parent_category_id: "category-1",
                  parent_category: "category-1",
                  category_children: [
                    expect.objectContaining({
                      id: "category-1-b-1",
                      handle: "category-1-b-1",
                      mpath:
                        "category-0.category-1.category-1-b.category-1-b-1.",
                      parent_category_id: "category-1-b",
                      parent_category: "category-1-b",
                      category_children: [],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ])
    })

    it("should filter out children when include_descendants_tree is true", async () => {
      const productCategoryResults = await service.listAndCount(
        {
          parent_category_id: null,
          include_descendants_tree: true,
          is_internal: false,
        },
        {
          select: ["id", "handle"],
        }
      )

      expect(productCategoryResults[1]).toEqual(1)

      const serializedObject = JSON.parse(
        JSON.stringify(productCategoryResults[0])
      )

      expect(serializedObject).toEqual([
        expect.objectContaining({
          id: "category-0",
          handle: "category-0",
          mpath: "category-0.",
          parent_category_id: null,
          parent_category: null,
          category_children: [
            expect.objectContaining({
              id: "category-1",
              handle: "category-1",
              mpath: "category-0.category-1.",
              parent_category_id: "category-0",
              parent_category: "category-0",
              category_children: [
                expect.objectContaining({
                  id: "category-1-a",
                  handle: "category-1-a",
                  mpath: "category-0.category-1.category-1-a.",
                  parent_category_id: "category-1",
                  parent_category: "category-1",
                  category_children: [],
                }),
              ],
            }),
          ],
        }),
      ])
    })
  })
})
