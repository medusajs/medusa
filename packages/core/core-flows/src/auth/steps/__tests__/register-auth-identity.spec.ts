import { registerAuthIdentityStep } from "../register-auth-identity"
import { Modules, MedusaError } from "@medusajs/framework/utils"

describe("registerAuthIdentityStep", () => {
  it("should register auth identity", async () => {
    const authModuleService = {
      register: jest.fn().mockResolvedValue({
        success: true,
        authIdentity: { id: "auth_1" },
      }),
    }

    const container = {
      resolve: jest.fn().mockReturnValue(authModuleService),
    }

    const data = {
      provider: "emailpass",
      providerData: { email: "test@test.com", password: "password" },
    }

    const result = await registerAuthIdentityStep.run(data, {
      container: container as any,
    } as any)

    expect(container.resolve).toHaveBeenCalledWith(Modules.AUTH)
    expect(authModuleService.register).toHaveBeenCalledWith(data.provider, data.providerData)
    expect(result.output).toEqual({ id: "auth_1" })
    expect(result.compensationData).toEqual("auth_1")
  })

  it("should throw MedusaError on failure", async () => {
    const authModuleService = {
      register: jest.fn().mockResolvedValue({
        success: false,
        error: "Registration failed",
      }),
    }

    const container = {
      resolve: jest.fn().mockReturnValue(authModuleService),
    }

    const data = {
      provider: "emailpass",
      providerData: { email: "test@test.com", password: "password" },
    }

    const run = registerAuthIdentityStep.run(data, {
      container: container as any,
    } as any)

    await expect(run).rejects.toThrow(
      new MedusaError(MedusaError.Types.INVALID_DATA, "Registration failed")
    )
  })

  it("should call deleteAuthIdentities on rollback", async () => {
    const authModuleService = {
      deleteAuthIdentities: jest.fn().mockResolvedValue(undefined),
    }

    const container = {
      resolve: jest.fn().mockReturnValue(authModuleService),
    }

    const id = "auth_1"

    await registerAuthIdentityStep.rollback(id, {
      container: container as any,
    } as any)

    expect(container.resolve).toHaveBeenCalledWith(Modules.AUTH)
    expect(authModuleService.deleteAuthIdentities).toHaveBeenCalledWith([id])
  })
})
