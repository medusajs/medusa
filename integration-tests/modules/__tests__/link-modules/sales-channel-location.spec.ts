import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ISalesChannelModuleService,
  IStockLocationService,
} from "@medusajs/types"
import { Modules, remoteQueryObjectFromString } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    describe("Cart links", () => {
      let appContainer
      let scService: ISalesChannelModuleService
      let locationService: IStockLocationService
      let remoteQuery, remoteLink

      beforeAll(async () => {
        appContainer = getContainer()
        scService = appContainer.resolve(ModuleRegistrationName.SALES_CHANNEL)
        locationService = appContainer.resolve(
          ModuleRegistrationName.STOCK_LOCATION
        )
        remoteQuery = appContainer.resolve("remoteQuery")
        remoteLink = appContainer.resolve("remoteLink")
      })

      it("should query carts, sales channels, customers, regions with remote query", async () => {
        const scWebshop = await scService.createSalesChannels({
          name: "Webshop",
        })

        const scCphStore = await scService.createSalesChannels({
          name: "CPH store",
        })

        const scNycStore = await scService.createSalesChannels({
          name: "NYC store",
        })

        const euWarehouse = await locationService.createStockLocations({
          name: "EU Warehouse",
        })

        const usWarehouse = await locationService.createStockLocations({
          name: "US Warehouse",
        })

        await remoteLink.create([
          {
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: scWebshop.id,
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: euWarehouse.id,
            },
          },
          {
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: scCphStore.id,
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: euWarehouse.id,
            },
          },
          {
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: scNycStore.id,
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: usWarehouse.id,
            },
          },
        ])

        const euStockLocationChannelQuery = remoteQueryObjectFromString({
          entryPoint: "stock_locations",
          fields: ["id", "name", "sales_channels.id", "sales_channels.name"],
          variables: { id: euWarehouse.id },
        })

        const usStockLocationChannelQuery = remoteQueryObjectFromString({
          entryPoint: "stock_locations",
          fields: ["id", "name", "sales_channels.id", "sales_channels.name"],
          variables: { id: usWarehouse.id },
        })

        const euLocations = await remoteQuery(euStockLocationChannelQuery)
        const usLocations = await remoteQuery(usStockLocationChannelQuery)

        expect(euLocations.length).toBe(1)
        expect(euLocations).toEqual([
          expect.objectContaining({
            id: euWarehouse.id,
            sales_channels: [
              expect.objectContaining({ id: scWebshop.id }),
              expect.objectContaining({ id: scCphStore.id }),
            ],
            name: "EU Warehouse",
          }),
        ])

        expect(usLocations.length).toBe(1)
        expect(usLocations).toEqual([
          expect.objectContaining({
            id: usWarehouse.id,
            sales_channels: [expect.objectContaining({ id: scNycStore.id })],
            name: "US Warehouse",
          }),
        ])
      })
    })
  },
})
