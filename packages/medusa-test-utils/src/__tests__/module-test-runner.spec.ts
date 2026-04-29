import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import TestService from "../__fixtures__/test-module/service"
import InternalService from "../__fixtures__/test-module/services/internal"
import { moduleIntegrationTestRunner } from "../module-test-runner"

moduleIntegrationTestRunner<TestService>({
  moduleName: "test",
  resolve: "./__fixtures__/test-module",
  moduleOptions: {
    option1: "value1",
  },
  testSuite: ({ service }) => {
    describe("Module Test Runner", () => {
      it("should inject all basic dependencies on the main service", async () => {
        const dependencies = await service.getDependencies()
        expect(dependencies[ContainerRegistrationKeys.LOGGER]).toBeDefined()
        expect(
          dependencies[ContainerRegistrationKeys.PG_CONNECTION]
        ).toBeDefined()
        expect(dependencies[Modules.EVENT_BUS]).toBeDefined()
        expect(dependencies["baseRepository"]).toBeDefined()

        const configModule =
          dependencies[ContainerRegistrationKeys.CONFIG_MODULE]
        expect(configModule).toBeDefined()
        expect(configModule.modules["test"]?.options?.option1).toBe("value1")
      })

      it("should inject internal services on the main service", async () => {
        const dependencies = await service.getDependencies()
        expect(dependencies["internalService"]).toBeInstanceOf(InternalService)
      })

      it("should inject basic dependencies on internal services", async () => {
        const internalService = (await service.getDependencies())[
          "internalService"
        ] as InternalService
        const dependencies = await internalService.getDependencies()
        expect(dependencies[ContainerRegistrationKeys.LOGGER]).toBeDefined()
        expect(
          dependencies[ContainerRegistrationKeys.PG_CONNECTION]
        ).toBeDefined()
        expect(dependencies[Modules.EVENT_BUS]).toBeDefined()
        expect(dependencies["baseRepository"]).toBeDefined()

        const configModule =
          dependencies[ContainerRegistrationKeys.CONFIG_MODULE]
        expect(configModule).toBeDefined()
        expect(configModule.modules["test"]?.options?.option1).toBe("value1")
      })
    })
  },
})
