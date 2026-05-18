import { IChannelPriceModuleService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { ChannelPriceModuleService } from "@services"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createChannelPriceFixture,
  createWholesalePriceFixture,
} from "../__fixtures__"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IChannelPriceModuleService>({
  moduleName: Modules.CHANNEL_PRICE,
  testSuite: ({ service }) => {
    it(`should export the appropriate linkable configuration`, () => {
      const linkable = Module(Modules.CHANNEL_PRICE, {
        service: ChannelPriceModuleService,
      }).linkable

      expect(Object.keys(linkable)).toEqual(["channelPrice"])

      Object.keys(linkable).forEach((key) => {
        delete linkable[key].toJSON
      })

      expect(linkable.channelPrice).toEqual({
        id: {
          linkable: "channel_price_id",
          entity: "ChannelPrice",
          primaryKey: "id",
          serviceName: "channel_price",
          field: "channelPrice",
        },
      })
    })

    describe("Channel Price Module Service", () => {
      const salesMaterialId = "sm_test_001"

      describe("creating channel prices", () => {
        it("should create a retail price successfully", async function () {
          const price = await service.createChannelPrices(
            createChannelPriceFixture(salesMaterialId)
          )

          expect(price).toEqual(
            expect.objectContaining({
              sales_material_id: salesMaterialId,
              price_type: "retail",
              currency_code: "CNY",
              amount: 99.99,
            })
          )
        })

        it("should create multiple prices", async function () {
          const prices = await service.createChannelPrices([
            createChannelPriceFixture(salesMaterialId),
            createWholesalePriceFixture(salesMaterialId),
          ])

          expect(prices).toHaveLength(2)
          expect(prices[0].price_type).toEqual("retail")
          expect(prices[1].price_type).toEqual("wholesale")
        })
      })

      describe("retrieving channel prices", () => {
        it("should retrieve a price by id", async function () {
          const created = await service.createChannelPrices(
            createChannelPriceFixture(salesMaterialId)
          )
          const price = await service.retrieveChannelPrice(created.id)

          expect(price.id).toEqual(created.id)
          expect(price.amount).toEqual(99.99)
        })
      })

      describe("listing channel prices", () => {
        it("should list all prices", async function () {
          await service.createChannelPrices([
            createChannelPriceFixture(salesMaterialId),
            createWholesalePriceFixture(salesMaterialId),
          ])

          const prices = await service.listChannelPrices()
          expect(prices).toHaveLength(2)
        })

        it("should list and count prices", async function () {
          await service.createChannelPrices([
            createChannelPriceFixture(salesMaterialId),
            createWholesalePriceFixture(salesMaterialId),
          ])

          const [prices, count] = await service.listAndCountChannelPrices()
          expect(prices).toHaveLength(2)
          expect(count).toEqual(2)
        })

        it("should filter by price_type", async function () {
          await service.createChannelPrices([
            createChannelPriceFixture(salesMaterialId),
            createWholesalePriceFixture(salesMaterialId),
          ])

          const prices = await service.listChannelPrices({
            price_type: "wholesale",
          })
          expect(prices).toHaveLength(1)
          expect(prices[0].amount).toEqual(79.99)
        })
      })

      describe("updating channel prices", () => {
        it("should update an amount", async function () {
          const created = await service.createChannelPrices(
            createChannelPriceFixture(salesMaterialId)
          )
          const updated = await service.updateChannelPrices({
            id: created.id,
            amount: 129.99,
          })

          expect(updated.amount).toEqual(129.99)
        })
      })

      describe("deleting channel prices", () => {
        it("should delete a price", async function () {
          const created = await service.createChannelPrices(
            createChannelPriceFixture(salesMaterialId)
          )
          await service.deleteChannelPrices(created.id)

          const prices = await service.listChannelPrices()
          expect(prices).toHaveLength(0)
        })
      })
    })
  },
})
