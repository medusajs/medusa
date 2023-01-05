import path from "path"
import { ProductCategory } from "@medusajs/medusa"
import { initDb, useDb } from "../../../helpers/use-db"

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
    it("can fetch ancestors, descendents and root product categories", async () => {
      const productCategoryRepository = dbConnection.getTreeRepository(ProductCategory)

      const a1 = productCategoryRepository.create({ name: 'a1', handle: 'a1' })
      await productCategoryRepository.save(a1)

      const a11 = productCategoryRepository.create({ name: 'a11', handle: 'a11', parent_category: a1 })
      await productCategoryRepository.save(a11)

      const a111 = productCategoryRepository.create({ name: 'a111', handle: 'a111', parent_category: a11 })
      await productCategoryRepository.save(a111)

      const a12 = productCategoryRepository.create({ name: 'a12', handle: 'a12', parent_category: a1 })
      await productCategoryRepository.save(a12)

      const rootCategories = await productCategoryRepository.findRoots()

      expect(rootCategories).toEqual([
        expect.objectContaining({
          name: "a1",
        })
      ])

      const a11Parent = await productCategoryRepository.findAncestors(a11)

      expect(a11Parent).toEqual([
        expect.objectContaining({
          name: "a1",
        }),
        expect.objectContaining({
          name: "a11",
        }),
      ])

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
