import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICurrencyModuleService, IStoreModuleService } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    describe("Link: Store Currency", () => {
      let appContainer
      let storeModuleService: IStoreModuleService
      let currencyModuleService: ICurrencyModuleService
      let remoteQuery

      beforeAll(async () => {
        appContainer = getContainer()
        storeModuleService = appContainer.resolve(ModuleRegistrationName.STORE)
        currencyModuleService = appContainer.resolve(
          ModuleRegistrationName.CURRENCY
        )
        remoteQuery = appContainer.resolve("remoteQuery")
      })

      it("should query store and default currency with remote query", async () => {
        const store = await storeModuleService.createStores({
          name: "Store",
          default_currency_code: "usd",
          supported_currency_codes: ["usd"],
        })

        const stores = await remoteQuery({
          store: {
            fields: ["id"],
            default_currency: {
              fields: ["code"],
            },
          },
        })

        expect(stores).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: store.id,
              default_currency: expect.objectContaining({ code: "usd" }),
            }),
          ])
        )
      })
    })
  },
})
