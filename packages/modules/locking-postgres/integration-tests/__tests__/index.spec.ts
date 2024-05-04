import { Modules } from "@medusajs/modules-sdk"
import { ILockingModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.LOCKING,
  testSuite: ({ service }: SuiteOptions<ILockingModuleService>) => {
    describe("Locking Module Service", () => {
      describe("create", () => {
        it("should acquire lock to perform an action", async () => {
          await service.execute("test", async () => {
            // execute some action
          })
        })
      })
    })
  },
})
