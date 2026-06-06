import { ITaxModuleService } from "@zjedene-medusa/framework/types"

import { Modules } from "@zjedene-medusa/framework/utils"
import { moduleIntegrationTestRunner } from "@zjedene-medusa/test-utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner<ITaxModuleService>({
  moduleName: Modules.TAX,
  testSuite: ({ service }) => {
    describe("Tax Module Service", () => {
      describe("providers", () => {
        it("should have loaded local tax provider successfully", async () => {
          const providers = await service.listTaxProviders()

          expect(providers).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "tp_system",
                is_enabled: true,
              }),
            ])
          )
        })
      })
    })
  },
})
