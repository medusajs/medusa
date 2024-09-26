import { IAuthModuleService } from "@medusajs/framework/types"
import { AuthIdentity } from "@models"

export async function createAuthIdentities(
  service: IAuthModuleService,
  userData: any[] = [
    {
      id: "test-id",
      provider_identities: [
        {
          entity_id: "provider-test-id",
          provider: "manual",
        },
      ],
      app_metadata: {
        user_id: "user-1",
      },
    },
    {
      id: "test-id-1",
      provider_identities: [
        {
          entity_id: "provider-test-id-1",
          provider: "manual",
        },
      ],
    },
    {
      provider_identities: [
        {
          entity_id: "provider-test-id-2",
          provider: "store",
        },
      ],
    },
  ]
): Promise<AuthIdentity[]> {
  return await service.createAuthIdentities(userData)
}
