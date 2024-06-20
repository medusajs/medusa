import { ISalesChannelModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import { Modules } from "@medusajs/modules-sdk"

jest.setTimeout(30000)

const salesChannelData = [
  {
    id: "channel-1",
    name: "Channel 1",
    description: "Channel description 1",
    is_disabled: false,
  },
  {
    id: "channel-2",
    name: "Channel 2",
    description: "Channel description 2",
    is_disabled: false,
  },
  {
    id: "channel-3",
    name: "Channel 3",
    description: "Channel description 3",
    is_disabled: true,
  },
]

moduleIntegrationTestRunner<ISalesChannelModuleService>({
  moduleName: Modules.SALES_CHANNEL,
  testSuite: ({ service }) => {
    describe("Sales Channel Service", () => {
      beforeEach(async () => {
        await service.createSalesChannels(salesChannelData)
      })

      describe("create", () => {
        it("should create a SalesChannel successfully", async () => {
          const [created] = await service.createSalesChannels([
            {
              name: "test",
              description: "test",
            },
          ])

          const [channel] = await service.listSalesChannels({
            name: [created.name],
          })

          expect(channel.name).toEqual("test")
          expect(channel.description).toEqual("test")
        })
      })

      describe("retrieve", () => {
        const id = "channel-1"

        it("should return SalesChannel for the given id", async () => {
          const result = await service.retrieveSalesChannel(id)

          expect(result).toEqual(
            expect.objectContaining({
              id,
            })
          )
        })

        it("should throw an error when SalesChannelId with id does not exist", async () => {
          let error

          try {
            await service.retrieveSalesChannel("does-not-exist")
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
          await service.updateSalesChannels(id, {
            name: "Update name 2",
            is_disabled: true,
          })

          const channel = await service.retrieveSalesChannel(id)

          expect(channel.name).toEqual("Update name 2")
          expect(channel.is_disabled).toEqual(true)
        })

        it("should throw an error when a id does not exist", async () => {
          let error

          try {
            await service.updateSalesChannels("does-not-exist", {
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
          const result = await service.listSalesChannels()

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
          const result = await service.listSalesChannels({
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
          const [result, count] = await service.listAndCountSalesChannels()

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
          const [result, count] = await service.listAndCountSalesChannels({
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
          const [results, count] = await service.listAndCountSalesChannels(
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
          const [result, count] = await service.listAndCountSalesChannels(
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
          const [result, count] = await service.listAndCountSalesChannels(
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
          await service.deleteSalesChannels([id])

          const result = await service.listSalesChannels({
            id: [id],
          })

          expect(result).toHaveLength(0)
        })
      })
    })
  },
})
