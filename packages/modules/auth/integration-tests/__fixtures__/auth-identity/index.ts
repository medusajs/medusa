import { IAuthModuleService } from "@medusajs/types"
import { AuthIdentity } from "@models"

export async function createAuthIdentities(
  service: IAuthModuleService,
  userData: any[] = [
    {
      id: "test-id",
      provider_identities: [
        {
          entity_id: "test-id",
          provider: "manual",
        },
      ],
    },
    {
      id: "test-id-1",
      provider_identities: [
        {
          entity_id: "test-id-1",
          provider: "manual",
        },
      ],
    },
    {
      provider_identities: [
        {
          entity_id: "test-id-2",
          provider: "store",
        },
      ],
    },
  ]
): Promise<AuthIdentity[]> {
  return await service.createAuthIdentities(userData)
}
