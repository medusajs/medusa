import { Modules } from "@medusajs/modules-sdk"
import { ICurrencyModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  moduleName: Modules.CURRENCY,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<ICurrencyModuleService>) => {
    describe("Currency Module Service", () => {
      describe("noop", function () {
        it("should run", function () {
          expect(true).toBe(true)
        })
      })
    })
  },
})
