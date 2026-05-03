import { createAuthIdentitiesStep } from "../create-auth-identities"
import { Modules } from "@medusajs/framework/utils"

describe("createAuthIdentitiesStep", () => {
  it("should call createAuthIdentities and return the result", async () => {
    const authModuleService = {
      createAuthIdentities: jest.fn().mockResolvedValue([{ id: "auth_1" }]),
    }

    const container = {
      resolve: jest.fn().mockReturnValue(authModuleService),
    }

    const data = [
      {
        provider_identities: [
          {
            provider: "emailpass",
            entity_id: "test@test.com",
          },
        ],
      },
    ]

    const result = await createAuthIdentitiesStep.run(data, {
      container: container as any,
    } as any)

    expect(container.resolve).toHaveBeenCalledWith(Modules.AUTH)
    expect(authModuleService.createAuthIdentities).toHaveBeenCalledWith(data)
    expect(result.output).toEqual([{ id: "auth_1" }])
    expect(result.compensationData).toEqual(["auth_1"])
  })

  it("should call deleteAuthIdentities on rollback", async () => {
    const authModuleService = {
      deleteAuthIdentities: jest.fn().mockResolvedValue(undefined),
    }

    const container = {
      resolve: jest.fn().mockReturnValue(authModuleService),
    }

    const ids = ["auth_1"]

    await createAuthIdentitiesStep.rollback(ids, {
      container: container as any,
    } as any)

    expect(container.resolve).toHaveBeenCalledWith(Modules.AUTH)
    expect(authModuleService.deleteAuthIdentities).toHaveBeenCalledWith(ids)
  })
})
