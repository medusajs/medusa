import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import {
  IFulfillmentModuleService,
  ISalesChannelModuleService,
  IStockLocationServiceNext,
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
      let locationModule: IStockLocationServiceNext
      let scService: ISalesChannelModuleService
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
        scService = appContainer.resolve(ModuleRegistrationName.SALES_CHANNEL)
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

        const euWarehouse = await locationModule.create({
          name: "EU Warehouse",
        })

        await remoteLink.create([
          {
            [Modules.FULFILLMENT]: {
              fulfillment_set_id: fulfillmentSet.id,
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: euWarehouse.id,
            },
          },
        ])

        const linkQuery = remoteQueryObjectFromString({
          entryPoint: "fulfillment_sets",
          fields: ["id", "stock_locations.id"],
        })

        const link = await remoteQuery(linkQuery)

        expect(link).toHaveLength(1)
        expect(link).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: fulfillmentSet.id,
              stock_locations: expect.arrayContaining([
                expect.objectContaining({
                  id: euWarehouse.id,
                }),
              ]),
            }),
          ])
        )
      })
    })
  },
})
