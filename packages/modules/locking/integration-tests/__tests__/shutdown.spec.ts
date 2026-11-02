import { ILockingModule } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { resolve } from "path"
import { ShutdownLockingProviderFixture } from "../__fixtures__/providers/shutdown-provider"

jest.setTimeout(10000)

moduleIntegrationTestRunner<ILockingModule>({
  moduleName: Modules.LOCKING,
  resolve: resolve(process.cwd(), "src"),
  moduleOptions: {
    providers: [
      {
        id: "shutdown-fixture",
        resolve: resolve(
          process.cwd() +
            "/integration-tests/__fixtures__/providers/shutdown-provider"
        ),
        is_default: true,
      },
    ],
  },
  testSuite: ({ service }) => {
    describe("Locking Module Service shutdown", () => {
      it("should shut down the locking providers on application shutdown", async () => {
        const shutdownSpy = jest.spyOn(
          ShutdownLockingProviderFixture.prototype,
          "shutdown"
        )

        await (service as any).__hooks?.onApplicationShutdown?.()

        expect(shutdownSpy).toHaveBeenCalledTimes(1)
      })
    })
  },
})
