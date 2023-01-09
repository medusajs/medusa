import path from "path"
import { ProductCategory } from "@medusajs/medusa"
import { initDb, useDb } from "../../../helpers/use-db"
import { simpleProductCategoryFactory } from '../../factories'

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
      a1 = await simpleProductCategoryFactory(dbConnection, { name: 'a1', handle: 'a1' })
      a11 = await simpleProductCategoryFactory(dbConnection, { name: 'a11', handle: 'a11', parent_category: a1 })
      a111 = await simpleProductCategoryFactory(dbConnection, { name: 'a111', handle: 'a111', parent_category: a11 })
      a12 = await simpleProductCategoryFactory(dbConnection, { name: 'a12', handle: 'a12', parent_category: a1 })
      productCategoryRepository = dbConnection.getTreeRepository(ProductCategory)
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
})
