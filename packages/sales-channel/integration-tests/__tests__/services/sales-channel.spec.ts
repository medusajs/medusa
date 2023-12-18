import { SqlEntityManager } from "@mikro-orm/postgresql"

import { SalesChannelModuleService } from "@services"
import { SalesChannelRepository } from "@repositories"

import { MikroOrmWrapper } from "../../utils"
import { createSalesChannels } from "../../__fixtures__"

jest.setTimeout(30000)

describe("Sales Channel Service", () => {
  let service: SalesChannelModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    const salesChannelRepository = new SalesChannelRepository({
      manager: repositoryManager,
    })

    service = new SalesChannelModuleService({
      salesChannelRepository,
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
        id: [created.id],
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
      await service.update([
        {
          id,
          name: "Update name 2",
          is_disabled: true,
        },
      ])

      const channel = await service.retrieve(id)

      expect(channel.name).toEqual("Update name 2")
      expect(channel.is_disabled).toEqual(true)
    })

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.update([
          {
            id: "does-not-exist",
          },
        ])
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
