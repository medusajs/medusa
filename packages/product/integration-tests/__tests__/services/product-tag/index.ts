import { SqlEntityManager } from "@mikro-orm/postgresql"

import { Product } from "@models"
import { ProductTagRepository } from "@repositories"
import { ProductTagService } from "@services"

import { ProductTypes } from "@medusajs/types"
import { createProductAndTags } from "../../../__fixtures__/product"
import { TestDatabase } from "../../../utils"

jest.setTimeout(30000)

describe("Product tag Service", () => {
  let service: ProductTagService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let data!: Product[]

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    const productTagRepository = new ProductTagRepository({
      manager: repositoryManager,
    })

    service = new ProductTagService({
      productTagRepository,
    })
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("list", () => {
    const productsData = [
      {
        id: "test-1",
        title: "product 1",
        status: ProductTypes.ProductStatus.PUBLISHED,
        tags: [
          {
            id: "tag-1",
            value: "France",
          },
        ],
      },
      {
        id: "test-2",
        title: "product",
        status: ProductTypes.ProductStatus.PUBLISHED,
        tags: [
          {
            id: "tag-2",
            value: "Germany",
          },
          {
            id: "tag-3",
            value: "United States",
          },
          {
            id: "tag-4",
            value: "United Kingdom",
          },
        ],
      },
    ]

    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      data = await createProductAndTags(testManager, productsData)
    })

    it("list product tags", async () => {
      const tagsResults = await service.list()

      expect(tagsResults).toEqual([
        expect.objectContaining({
          id: "tag-1",
          value: "France",
        }),
        expect.objectContaining({
          id: "tag-2",
          value: "Germany",
        }),
        expect.objectContaining({
          id: "tag-3",
          value: "United States",
        }),
        expect.objectContaining({
          id: "tag-4",
          value: "United Kingdom",
        }),
      ])
    })

    it("list product tags by id", async () => {
      const tagsResults = await service.list({ id: data[0].tags![0].id })

      expect(tagsResults).toEqual([
        expect.objectContaining({
          id: "tag-1",
          value: "France",
        }),
      ])
    })

    it("list product tags by value matching string", async () => {
      const tagsResults = await service.list({ value: "united kingdom" })

      expect(tagsResults).toEqual([
        expect.objectContaining({
          id: "tag-4",
          value: "United Kingdom",
        }),
      ])
    })
  })
})
