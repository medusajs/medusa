import {
  AuthIdentityDTO,
  AuthIdentityProviderService,
  AuthenticationInput,
  AuthenticationResponse,
} from "@medusajs/types"
import { AbstractAuthModuleProvider, MedusaError } from "@medusajs/utils"

export class AuthServiceFixtures extends AbstractAuthModuleProvider {
  constructor() {
    super(
      {},
      { provider: "plaintextpass", displayName: "plaintextpass Fixture" }
    )
  }

  async authenticate(
    authenticationData: AuthenticationInput,
    service: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const { email, password } = authenticationData.body ?? {}
    let authIdentity: AuthIdentityDTO | undefined
    try {
      authIdentity = await service.retrieve({
        entity_id: email,
        provider: this.provider,
      })

      if (authIdentity.provider_metadata?.password === password) {
        return {
          success: true,
          authIdentity,
        }
      }
    } catch (error) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        const createdAuthIdentity = await service.create({
          entity_id: email,
          provider: this.provider,
          provider_metadata: {
            password,
          },
        })

        return {
          success: true,
          authIdentity: createdAuthIdentity,
        }
      }

      return { success: false, error: error.message }
    }

    return {
      success: false,
      error: "Invalid email or password",
    }
  }
}

export const services = [AuthServiceFixtures]
