import { SqlEntityManager } from "@mikro-orm/postgresql"

import { ProductTypeService } from "@services"
import { ProductTypeRepository } from "@repositories"
import { Product } from "@models"

import { TestDatabase } from "../../../utils"
import { createProductAndTypes } from "../../../__fixtures__/product"
import { ProductTypes } from "@medusajs/types"

jest.setTimeout(30000)

describe("ProductType Service", () => {
  let service: ProductTypeService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let data!: Product[]

  const productsData = [
    {
      id: "product-1",
      title: "product 1",
      status: ProductTypes.ProductStatus.PUBLISHED,
      type: {
        id: "type-1",
        value: "Type 1",
      },
    },
    {
      id: "product-2",
      title: "product",
      status: ProductTypes.ProductStatus.PUBLISHED,
      type: {
        id: "type-2",
        value: "Type 2",
      }
    },
  ]

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    const productTypeRepository = new ProductTypeRepository({
      manager: repositoryManager,
    })

    service = new ProductTypeService({
      productTypeRepository,
    })

    testManager = await TestDatabase.forkManager()

    data = await createProductAndTypes(testManager, productsData)
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("list", () => {
    it("list product type", async () => {
      const typeResults = await service.list()

      expect(typeResults).toEqual([
        expect.objectContaining({
          id: "type-1",
          value: "Type 1",
        }),
        expect.objectContaining({
          id: "type-2",
          value: "Type 2",
        }),
      ])
    })

    it("list product type by id", async () => {
      const typeResults = await service.list({ id: data[0].type.id })

      expect(typeResults).toEqual([
        expect.objectContaining({
          id: "type-1",
          value: "Type 1",
        }),
      ])
    })

    it("list product type by value matching string", async () => {
      const typeResults = await service.list({ value: "Type 1" })

      expect(typeResults).toEqual([
        expect.objectContaining({
          id: "type-1",
          value: "Type 1",
        }),
      ])
    })
  })

  describe("listAndCount", () => {
    it("should return product type and count", async () => {
      const [typeResults, count] = await service.listAndCount()

      expect(count).toEqual(2)
      expect(typeResults).toEqual([
        expect.objectContaining({
          id: "type-1",
          value: "Type 1",
        }),
        expect.objectContaining({
          id: "type-2",
          value: "Type 2",
        }),
      ])
    })

    it("should return product type and count when filtered", async () => {
      const [typeResults, count] = await service.listAndCount({ id: data[0].type.id })

      expect(count).toEqual(1)
      expect(typeResults).toEqual([
        expect.objectContaining({
          id: "type-1",
        }),
      ])
    })

    it("should return product type and count when using skip and take", async () => {
      const [typeResults, count] = await service.listAndCount({}, { skip: 1, take: 1 })

      expect(count).toEqual(2)
      expect(typeResults).toEqual([
        expect.objectContaining({
          id: "type-2",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [typeResults, count] = await service.listAndCount({}, {
        take: 1,
        select: ["value"],
      })

      const serialized = JSON.parse(JSON.stringify(typeResults))

      expect(count).toEqual(2)
      expect(serialized).toEqual([
        expect.objectContaining({
          id: "type-1",
        }),
      ])
    })
  })

  describe("retrieve", () => {
    const tagId = "type-1"
    const tagValue = "Type 1"

    it("should return tag for the given id", async () => {
      const tag = await service.retrieve(
        tagId,
      )

      expect(tag).toEqual(
        expect.objectContaining({
          id: tagId
        })
      )
    })

    it("should throw an error when tag with id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('ProductType with id: does-not-exist was not found')
    })

    it("should throw an error when an id is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"productTypeId" must be defined')
    })

    it("should return tag based on config select param", async () => {
      const tag = await service.retrieve(
        tagId,
        {
          select: ["id", "value"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(tag))

      expect(serialized).toEqual(
        {
          id: tagId,
          value: tagValue,
        }
      )
    })
  })
})
