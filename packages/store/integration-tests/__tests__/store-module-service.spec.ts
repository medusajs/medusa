import { Modules } from "@medusajs/modules-sdk"
import { IStoreModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  moduleName: Modules.STORE,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IStoreModuleService>) => {
    describe("Store Module Service", () => {
      describe("noop", function () {
        it("should run", function () {
          expect(true).toBe(true)
        })
      })
    })
  },
})
