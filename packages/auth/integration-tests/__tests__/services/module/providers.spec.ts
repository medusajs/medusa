import { MedusaModule, Modules } from "@medusajs/modules-sdk"

import { IAuthModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.AUTH,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IAuthModuleService>) => {
    describe("AuthModuleService - AuthProvider", () => {
      describe("authenticate", () => {
        it("authenticate validates that a provider is registered in container", async () => {
          const { success, error } = await service.authenticate(
            "notRegistered",
            {} as any
          )

          expect(success).toBe(false)
          expect(error).toEqual(
            "AuthenticationProvider: notRegistered wasn't registered in the module. Have you configured your options correctly?"
          )
        })

        it("fails to authenticate using a valid provider with an invalid scope", async () => {
          const { success, error } = await service.authenticate("emailpass", {
            authScope: "non-existing",
          } as any)

          expect(success).toBe(false)
          expect(error).toEqual(
            `Scope "non-existing" is not valid for provider emailpass`
          )
        })
      })
    })
  },
})
