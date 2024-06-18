import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService, IRegionModuleService } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Link: Cart Region", () => {
      let appContainer
      let cartModuleService: ICartModuleService
      let regionModule: IRegionModuleService
      let remoteQuery

      beforeAll(async () => {
        appContainer = getContainer()
        cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
        regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
        remoteQuery = appContainer.resolve("remoteQuery")
      })

      it("should query carts and regions with remote query", async () => {
        const region = await regionModule.createRegions({
          name: "Region",
          currency_code: "usd",
        })

        const cart = await cartModuleService.createCarts({
          email: "tony@stark.com",
          currency_code: "usd",
          region_id: region.id,
        })

        const carts = await remoteQuery({
          cart: {
            fields: ["id"],
            region: {
              fields: ["id"],
            },
          },
        })

        const regions = await remoteQuery({
          region: {
            fields: ["id"],
            carts: {
              fields: ["id"],
            },
          },
        })

        expect(carts).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: cart.id,
              region: expect.objectContaining({ id: region.id }),
            }),
          ])
        )

        expect(regions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: region.id,
              carts: expect.arrayContaining([
                expect.objectContaining({ id: cart.id }),
              ]),
            }),
          ])
        )
      })
    })
  },
})
