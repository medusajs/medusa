import { ICurrencyModuleService, IStoreModuleService } from "@medusajs/types"
import {
  ModuleRegistrationName,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
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
          supported_currencies: [{ currency_code: "usd", is_default: true }],
        })

        const query = remoteQueryObjectFromString({
          entryPoint: "store",
          fields: [
            "id",
            "supported_currencies.*",
            "supported_currencies.currency.*",
          ],
        })
        const stores = await remoteQuery(query)

        expect(stores).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: store.id,
              supported_currencies: expect.arrayContaining([
                expect.objectContaining({
                  currency: expect.objectContaining({ code: "usd" }),
                  currency_code: "usd",
                }),
              ]),
            }),
          ])
        )
      })
    })
  },
})
