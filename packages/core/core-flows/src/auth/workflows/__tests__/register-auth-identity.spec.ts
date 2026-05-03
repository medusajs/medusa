import { registerAuthIdentityWorkflow } from "../register-auth-identity"
import { Modules } from "@medusajs/framework/utils"

describe("registerAuthIdentityWorkflow", () => {
  it("should successfully register auth identity", async () => {
    const authModuleService = {
      register: jest.fn().mockResolvedValue({
        success: true,
        authIdentity: { id: "auth_1" },
      }),
    }

    const container = {
      resolve: jest.fn().mockReturnValue(authModuleService),
    }

    const input = {
      provider: "emailpass",
      providerData: { email: "test@test.com", password: "password" },
    }

    const { result } = await registerAuthIdentityWorkflow(container as any).run({
      input,
    })

    expect(authModuleService.register).toHaveBeenCalledWith(input.provider, input.providerData)
    expect(result).toEqual({ id: "auth_1" })
  })
})
