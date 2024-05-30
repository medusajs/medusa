import { SqlEntityManager } from "@mikro-orm/postgresql"

import { ISalesChannelModuleService } from "@medusajs/types"

import { initialize } from "../../../src"

import { createSalesChannels } from "../../__fixtures__"
import { DB_URL, MikroOrmWrapper } from "../../utils"

jest.setTimeout(30000)

describe("Sales Channel Service", () => {
  let service: ISalesChannelModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_SALES_CHANNEL_DB_SCHEMA,
      },
    })

    testManager = await MikroOrmWrapper.forkManager()

    await createSalesChannels(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("create", () => {
    it("should create a SalesChannel successfully", async () => {
      const [created] = await service.create([
        {
          name: "test",
          description: "test",
        },
      ])

      const [channel] = await service.list({
        name: [created.name],
      })

      expect(channel.name).toEqual("test")
      expect(channel.description).toEqual("test")
    })
  })

  describe("retrieve", () => {
    const id = "channel-1"

    it("should return SalesChannel for the given id", async () => {
      const result = await service.retrieve(id)

      expect(result).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when SalesChannelId with id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "SalesChannel with id: does-not-exist was not found"
      )
    })
  })

  describe("update", () => {
    const id = "channel-2"

    it("should update the name of the SalesChannel successfully", async () => {
      await service.update(id, {
        name: "Update name 2",
        is_disabled: true,
      })

      const channel = await service.retrieve(id)

      expect(channel.name).toEqual("Update name 2")
      expect(channel.is_disabled).toEqual(true)
    })

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.update("does-not-exist", {
          name: "does-not-exist",
        })
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        'SalesChannel with id "does-not-exist" not found'
      )
    })
  })

  describe("list", () => {
    it("should return a list of SalesChannels", async () => {
      const result = await service.list()

      expect(result).toEqual([
        expect.objectContaining({
          id: "channel-1",
        }),
        expect.objectContaining({
          id: "channel-2",
        }),
        expect.objectContaining({
          id: "channel-3",
        }),
      ])
    })

    it("should list SalesChannels by name", async () => {
      const result = await service.list({
        name: ["Channel 2", "Channel 3"],
      })

      expect(result).toEqual([
        expect.objectContaining({
          id: "channel-2",
        }),
        expect.objectContaining({
          id: "channel-3",
        }),
      ])
    })
  })

  describe("listAndCount", () => {
    it("should return sales channels and count", async () => {
      const [result, count] = await service.listAndCount()

      expect(count).toEqual(3)
      expect(result).toEqual([
        expect.objectContaining({
          id: "channel-1",
        }),
        expect.objectContaining({
          id: "channel-2",
        }),
        expect.objectContaining({
          id: "channel-3",
        }),
      ])
    })

    it("should return sales channels and count when filtered", async () => {
      const [result, count] = await service.listAndCount({
        id: ["channel-2"],
      })

      expect(count).toEqual(1)
      expect(result).toEqual([
        expect.objectContaining({
          id: "channel-2",
        }),
      ])
    })

    it("should return sales channels and count when using skip and take", async () => {
      const [results, count] = await service.listAndCount(
        {},
        { skip: 1, take: 1 }
      )

      expect(count).toEqual(3)
      expect(results).toEqual([
        expect.objectContaining({
          id: "channel-2",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [result, count] = await service.listAndCount(
        {},
        {
          take: 1,
          select: ["id", "name"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(result))

      expect(count).toEqual(3)
      expect(serialized).toEqual([
        {
          id: "channel-1",
          name: "Channel 1",
        },
      ])
    })

    it("should filter disabled channels", async () => {
      const [result, count] = await service.listAndCount(
        { is_disabled: true },
        { select: ["id"] }
      )

      const serialized = JSON.parse(JSON.stringify(result))

      expect(count).toEqual(1)
      expect(serialized).toEqual([
        {
          id: "channel-3",
        },
      ])
    })
  })

  describe("delete", () => {
    const id = "channel-2"

    it("should delete the SalesChannel given an id successfully", async () => {
      await service.delete([id])

      const result = await service.list({
        id: [id],
      })

      expect(result).toHaveLength(0)
    })
  })
})
