import { Modules } from "@medusajs/modules-sdk"
import { IApiKeyModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  moduleName: Modules.API_KEY,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IApiKeyModuleService>) => {
    describe("API Key Module Service", () => {
      describe("noop", () => {
        it("should run", function () {
          expect(true).toBe(true)
        })
      })
    })
  },
})
