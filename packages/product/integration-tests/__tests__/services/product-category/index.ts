import { SqlEntityManager } from "@mikro-orm/postgresql"

import { ProductCategoryService } from "@services"
import { ProductCategoryRepository } from "@repositories"
import { ProductCategory } from "@models"

import { TestDatabase } from "../../../utils"
import { createProductCategories } from "../../../__fixtures__/product-category"
import { productCategoriesData } from "../../../__fixtures__/product-category/data"

jest.setTimeout(30000)

describe("ProductCategory Service", () => {
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
          select: ["id", "parent_category_id"] as any,
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
          select: ["id", "handle"] as any,
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
          select: ["id", "handle"] as any,
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
})
