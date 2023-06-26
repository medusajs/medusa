import { SqlEntityManager } from "@mikro-orm/postgresql"

import { ProductCollection } from "@models"
import { ProductCollectionService } from "@services"
import { ProductCollectionRepository } from "@repositories"

import { TestDatabase } from "../../../utils"
import { createCollections } from "../../../__fixtures__/product"

jest.setTimeout(30000)

describe("Product Service", () => {
  let service: ProductCollectionService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let collectionsData: ProductCollection[] = []

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    const productCollectionRepository = new ProductCollectionRepository({
      manager: repositoryManager,
    })

    service = new ProductCollectionService({
      productCollectionRepository,
    })
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("list", () => {
    const data = [
      {
        id: "test-1",
        title: "col 1",
      },
      {
        id: "test-2",
        title: "col 2",
      },
      {
        id: "test-3",
        title: "col 3 extra",
      },
      {
        id: "test-4",
        title: "col 4 extra",
      },
    ]

    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      collectionsData = await createCollections(testManager, data)
    })

    it("list product collections", async () => {
      const tagsResults = await service.list()

      expect(tagsResults).toEqual([
        expect.objectContaining({
          id: "test-1",
          title: "col 1",
        }),
        expect.objectContaining({
          id: "test-2",
          title: "col 2",
        }),
        expect.objectContaining({
          id: "test-3",
          title: "col 3 extra",
        }),
        expect.objectContaining({
          id: "test-4",
          title: "col 4 extra",
        }),
      ])
    })

    it("list product collections by id", async () => {
      const tagsResults = await service.list({ id: data![0].id })

      expect(tagsResults).toEqual([
        expect.objectContaining({
          id: "test-1",
          title: "col 1",
        }),
      ])
    })

    it("list product collections by title matching string", async () => {
      const tagsResults = await service.list({ title: "col 3 extra" })

      expect(tagsResults).toEqual([
        expect.objectContaining({
          id: "test-3",
          title: "col 3 extra",
        }),
      ])
    })
  })
})
