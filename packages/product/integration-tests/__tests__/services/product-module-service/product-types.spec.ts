import { initialize } from "../../../../src"
import { DB_URL, TestDatabase } from "../../../utils"
import { IProductModuleService } from "@medusajs/types"
import { ProductType } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductTypes } from "@medusajs/types"

describe("ProductModuleService product types", () => {
  let service: IProductModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let typeOne: ProductType
  let typeTwo: ProductType

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
      },
    })

    testManager = await TestDatabase.forkManager()

    typeOne = testManager.create(ProductType, {
      id: "type-1",
      value: "type 1",
    })

    typeTwo = testManager.create(ProductType, {
      id: "type-2",
      value: "type",
    })

    await testManager.persistAndFlush([typeOne, typeTwo])
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("listTypes", () => {
    it("should return types and count queried by ID", async () => {
      const types = await service.listTypes({
        id: typeOne.id,
      })

      expect(types).toEqual([
        expect.objectContaining({
          id: typeOne.id,
        }),
      ])
    })

    it("should return types and count based on the options and filter parameter", async () => {
      let types = await service.listTypes(
        {
          id: typeOne.id,
        },
        {
          take: 1,
        }
      )

      expect(types).toEqual([
        expect.objectContaining({
          id: typeOne.id,
        }),
      ])

      types = await service.listTypes({}, { take: 1, skip: 1 })

      expect(types).toEqual([
        expect.objectContaining({
          id: typeTwo.id,
        }),
      ])
    })

    it("should return only requested fields for types", async () => {
      const types = await service.listTypes(
        {
          id: typeOne.id,
        },
        {
          select: ["value"],
          take: 1
        }
      )

      expect(types).toEqual([
        {
          id: typeOne.id,
          value: typeOne.value,
        },
      ])
    })
  })

  describe("listAndCountTypes", () => {
    it("should return types and count queried by ID", async () => {
      const [types, count] = await service.listAndCountTypes({
        id: typeOne.id,
      })

      expect(count).toEqual(1)
      expect(types).toEqual([
        expect.objectContaining({
          id: typeOne.id,
        }),
      ])
    })

    it("should return types and count based on the options and filter parameter", async () => {
      let [types, count] = await service.listAndCountTypes(
        {
          id: typeOne.id,
        },
        {
          take: 1,
        }
      )

      expect(count).toEqual(1)
      expect(types).toEqual([
        expect.objectContaining({
          id: typeOne.id,
        }),
      ])

      ;[types, count] = await service.listAndCountTypes({}, { take: 1 })

      expect(count).toEqual(2)

      ;[types, count] = await service.listAndCountTypes({}, { take: 1, skip: 1 })

      expect(count).toEqual(2)
      expect(types).toEqual([
        expect.objectContaining({
          id: typeTwo.id,
        }),
      ])
    })

    it("should return only requested fields for types", async () => {
      const [types, count] = await service.listAndCountTypes(
        {
          id: typeOne.id,
        },
        {
          select: ["value"],
          take: 1
        }
      )

      expect(count).toEqual(1)
      expect(types).toEqual([
        {
          id: typeOne.id,
          value: typeOne.value,
        },
      ])
    })
  })

  describe("retrieveType", () => {
    it("should return the requested type", async () => {
      const type = await service.retrieveType(typeOne.id)

      expect(type).toEqual(
        expect.objectContaining({
          id: typeOne.id,
        }),
      )
    })

    it("should return requested attributes when requested through config", async () => {
      const type = await service.retrieveType(
        typeOne.id,
        {
          select: ["id", "value"],
        }
      )

      expect(type).toEqual(
        {
          id: typeOne.id,
          value: typeOne.value,
        },
      )
    })

    it("should throw an error when a type with ID does not exist", async () => {
      let error

      try {
        await service.retrieveType("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual("ProductType with id: does-not-exist was not found")
    })
  })

  describe("deleteTypes", () => {
    const typeId = "type-1"

    it("should delete the product type given an ID successfully", async () => {
      await service.deleteTypes(
        [typeId],
      )

      const types = await service.listTypes({
        id: typeId
      })

      expect(types).toHaveLength(0)
    })
  })

  describe("updateTypes", () => {
    const typeId = "type-1"

    it("should update the value of the type successfully", async () => {
      await service.updateTypes(
        [{
          id: typeId,
          value: "UK"
        }]
      )

      const productType = await service.retrieveType(typeId)

      expect(productType.value).toEqual("UK")
    })

    it("should throw an error when an id does not exist", async () => {
      let error

      try {
        await service.updateTypes([
          {
            id: "does-not-exist",
            value: "UK"
          }
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('ProductType with id "does-not-exist" not found')
    })
  })

  describe("createTypes", () => {
    it("should create a type successfully", async () => {
      const res = await service.createTypes(
        [{
          value: "UK"
        }]
      )

      const productType = await service.listTypes({
        value: "UK"
      })

      expect(productType[0]?.value).toEqual("UK")
    })
  })
})

