import { createAuthIdentitiesWorkflow } from "../create-auth-identities"
import { Modules } from "@medusajs/framework/utils"

describe("createAuthIdentitiesWorkflow", () => {
  it("should successfully create auth identities", async () => {
    const authModuleService = {
      createAuthIdentities: jest.fn().mockResolvedValue([{ id: "auth_1" }]),
    }

    const container = {
      resolve: jest.fn().mockReturnValue(authModuleService),
    }

    const input = [
      {
        provider_identities: [
          {
            provider: "emailpass",
            entity_id: "test@test.com",
          },
        ],
      },
    ]

    const { result } = await createAuthIdentitiesWorkflow(container as any).run({
      input,
    })

    expect(authModuleService.createAuthIdentities).toHaveBeenCalledWith(input)
    expect(result).toEqual([{ id: "auth_1" }])
  })
})
