import { Modules } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(100000)

// TODO: Temporary until the providers are sorted out
const createProvider = async (MikroOrmWrapper, providerId: string) => {
  const [{ id }] = await MikroOrmWrapper.forkManager().execute(
    `insert into service_provider (id) values ('${providerId}') returning id`
  )

  return id
}

moduleIntegrationTestRunner({
  moduleName: Modules.FULFILLMENT,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IFulfillmentModuleService>) => {
    describe("Fulfillment Module Service", () => {
      describe("read", () => {})

      describe("mutations", () => {})
    })
  },
})
