import path from "path"
import { ProductCategory } from "@medusajs/medusa"
import { initDb, useDb } from "../../../helpers/use-db"
import { simpleProductCategoryFactory } from '../../factories'
import { ProductCategoryRepository } from "@medusajs/medusa/dist/repositories/product-category"

describe("Product Categories", () => {
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  describe("Tree Queries (Materialized Paths)", () => {
    let a1, a11, a111, a12
    let productCategoryRepository

    beforeEach(async () => {
      a1 = await simpleProductCategoryFactory(dbConnection, {
        name: 'a1',
        is_active: true,
        rank: 0,
      })
      a11 = await simpleProductCategoryFactory(dbConnection, {
        name: 'a11',
        parent_category: a1,
        is_active: true,
        rank: 0,
      })
      a111 = await simpleProductCategoryFactory(dbConnection, {
        name: 'a111',
        parent_category: a11,
        is_active: true,
        is_internal: true,
        rank: 0,
      })
      a12 = await simpleProductCategoryFactory(dbConnection, {
        name: 'a12',
        parent_category: a1,
        is_active: false,
        rank: 1,
      })

      productCategoryRepository = dbConnection.manager.withRepository(ProductCategoryRepository)
    })

    it("can fetch all root categories", async () => {
      const rootCategories = await productCategoryRepository.findRoots()

      expect(rootCategories).toEqual([
        expect.objectContaining({
          name: "a1",
        })
      ])
    })

    it("can fetch all ancestors of a category", async () => {
      const a11Parent = await productCategoryRepository.findAncestors(a11)

      expect(a11Parent).toEqual([
        expect.objectContaining({
          name: "a1",
        }),
        expect.objectContaining({
          name: "a11",
        }),
      ])
    })

    it("can fetch all root descendants of a category", async () => {
      const a1Children = await productCategoryRepository.findDescendants(a1)

      expect(a1Children).toEqual([
        expect.objectContaining({
          name: "a1",
        }),
        expect.objectContaining({
          name: "a11",
        }),
        expect.objectContaining({
          name: "a111",
        }),
        expect.objectContaining({
          name: "a12",
        }),
      ])
    })
  })

  describe("getFreeTextSearchResultsAndCount", () => {
    let a1, a11, a111, a12
    let productCategoryRepository

    beforeEach(async () => {
      a1 = await simpleProductCategoryFactory(
        dbConnection, {
          name: 'skinny jeans',
          handle: 'skinny-jeans',
          is_active: true,
          rank: 0,
        }
      )

      a11 = await simpleProductCategoryFactory(
        dbConnection, {
          name: 'winter shirts',
          handle: 'winter-shirts',
          parent_category: a1,
          is_active: true,
          rank: 0,
        }
      )

      a111 = await simpleProductCategoryFactory(
        dbConnection, {
          name: 'running shoes',
          handle: 'running-shoes',
          parent_category: a11,
          rank: 0,
        }
      )

      a12 = await simpleProductCategoryFactory(
        dbConnection, {
          name: 'casual shoes',
          handle: 'casual-shoes',
          parent_category: a1,
          is_internal: true,
          rank: 1,
        }
      )

      productCategoryRepository = dbConnection.manager.withRepository(ProductCategoryRepository)
    })

    it("fetches all active categories", async () => {
      const [ categories, count ] = await productCategoryRepository.getFreeTextSearchResultsAndCount(
        { where: { is_active: true } },
      )

      expect(count).toEqual(2)
      expect(categories).toEqual([
        expect.objectContaining({
          name: a1.name,
        }),
        expect.objectContaining({
          name: a11.name,
        }),
      ])
    })

    it("fetches all internal categories", async () => {
      const [ categories, count ] = await productCategoryRepository.getFreeTextSearchResultsAndCount(
        { where: { is_internal: true } },
      )

      expect(count).toEqual(1)
      expect(categories).toEqual([
        expect.objectContaining({
          name: a12.name,
        }),
      ])
    })

    it("fetches all categories with query shoes", async () => {
      const [ categories, count ] = await productCategoryRepository.getFreeTextSearchResultsAndCount(
        { where: {} },
        'shoes'
      )

      expect(count).toEqual(2)
      expect(categories).toEqual([
        expect.objectContaining({
          name: a111.name,
        }),
        expect.objectContaining({
          name: a12.name,
        }),
      ])
    })

    it("fetches all categories with query casual-", async () => {
      const [ categories, count ] = await productCategoryRepository.getFreeTextSearchResultsAndCount(
        { where: {} },
        'casual-'
      )

      expect(count).toEqual(1)
      expect(categories).toEqual([
        expect.objectContaining({
          name: a12.name,
        }),
      ])
    })

    it("builds relations for categories", async () => {
      const [ categories, count ] = await productCategoryRepository.getFreeTextSearchResultsAndCount(
        {
          where: { id: a11.id },
          relations: { parent_category: true, category_children: true },
        },
      )

      expect(count).toEqual(1)
      expect(categories[0]).toEqual(
        expect.objectContaining({
          id: a11.id,
          parent_category: expect.objectContaining({
            id: a1.id,
          }),
          category_children: [
            expect.objectContaining({
              id: a111.id,
            })
          ]
        })
      )
    })
  })
})
