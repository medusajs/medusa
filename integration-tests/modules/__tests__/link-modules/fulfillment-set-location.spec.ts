import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import {
  IFulfillmentModuleService,
  ISalesChannelModuleService,
  IStockLocationService,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    describe("FulfillmentSet and Location", () => {
      let appContainer
      let fulfillmentModule: IFulfillmentModuleService
      let locationModule: IStockLocationService
      let remoteQuery
      let remoteLink

      beforeAll(async () => {
        appContainer = getContainer()
        fulfillmentModule = appContainer.resolve(
          ModuleRegistrationName.FULFILLMENT
        )
        locationModule = appContainer.resolve(
          ModuleRegistrationName.STOCK_LOCATION
        )
        remoteQuery = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )
        remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)
      })

      it("should query fulfillment set and location link with remote query", async () => {
        const fulfillmentSet = await fulfillmentModule.create({
          name: "Test fulfillment set",
          type: "delivery",
        })

        const euWarehouse = await locationModule.createStockLocations({
          name: "EU Warehouse",
        })

        await remoteLink.create([
          {
            [Modules.STOCK_LOCATION]: {
              stock_location_id: euWarehouse.id,
            },
            [Modules.FULFILLMENT]: {
              fulfillment_set_id: fulfillmentSet.id,
            },
          },
        ])

        const linkQuery = remoteQueryObjectFromString({
          entryPoint: "stock_locations",
          fields: ["id", "fulfillment_sets.id"],
        })

        const link = await remoteQuery(linkQuery)

        expect(link).toHaveLength(1)
        expect(link).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: euWarehouse.id,
              fulfillment_sets: expect.arrayContaining([
                expect.objectContaining({
                  id: fulfillmentSet.id,
                }),
              ]),
            }),
          ])
        )
      })
    })
  },
})
