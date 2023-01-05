import path from "path"
import { Category } from "@medusajs/medusa"
import { initDb, useDb } from "../../../helpers/use-db"

describe("Categories > Materialized Paths", () => {
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

  it("can fetch ancestors, descendents and root categories", async () => {
    const categoryRepository = dbConnection.getTreeRepository(Category)

    const a1 = categoryRepository.create({ name: 'a1', handle: 'a1' })
    await categoryRepository.save(a1)

    const a11 = categoryRepository.create({ name: 'a11', handle: 'a11', parentCategory: a1 })
    await categoryRepository.save(a11)

    const a111 = categoryRepository.create({ name: 'a111', handle: 'a111', parentCategory: a11 })
    await categoryRepository.save(a111)

    const a12 = categoryRepository.create({ name: 'a12', handle: 'a12', parentCategory: a1 })
    await categoryRepository.save(a12)

    const rootCategories = await categoryRepository.findRoots()

    expect(rootCategories).toEqual([
      expect.objectContaining({
        name: "a1",
      })
    ])

    const a11Parent = await categoryRepository.findAncestors(a11)

    expect(a11Parent).toEqual([
      expect.objectContaining({
        name: "a1",
      }),
      expect.objectContaining({
        name: "a11",
      }),
    ])

    const a1Children = await categoryRepository.findDescendants(a1)

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
