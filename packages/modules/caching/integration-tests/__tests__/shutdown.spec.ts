import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { ICachingModuleService } from "@medusajs/framework/types"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import NodeCache from "node-cache"

jest.setTimeout(10000)

jest.spyOn(MedusaModule, "getAllJoinerConfigs").mockReturnValue([
  {
    schema: `
  type Product {
    id: ID
    title: String
  }
`,
  },
])

moduleIntegrationTestRunner<ICachingModuleService>({
  moduleName: Modules.CACHING,
  moduleOptions: {
    in_memory: {
      enable: true,
    },
  },
  testSuite: ({ service }) => {
    describe("Caching Module Service shutdown", () => {
      it("should close the in-memory cache client on application shutdown", async () => {
        await service.set({ key: "shutdown-key", data: { id: "prod_1" } })

        const cacheClient: NodeCache = (service as any).providerService
          .retrieveProvider("cache-memory").cacheClient
        const closeSpy = jest.spyOn(cacheClient, "close")

        await (service as any).__hooks?.onApplicationShutdown?.()

        expect(closeSpy).toHaveBeenCalledTimes(1)
      })
    })
  },
})
