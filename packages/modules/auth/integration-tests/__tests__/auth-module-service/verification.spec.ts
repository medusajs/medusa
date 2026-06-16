import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityDTO,
  AuthIdentityProviderService,
  AuthTypes,
  IAuthModuleService,
} from "@medusajs/framework/types"
import {
  AbstractAuthModuleProvider,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { generateTotpCode } from "../../../src/utils/totp"

jest.setTimeout(30000)

const mockCache = new Map()
const inMemoryCache = {
  get: async (key: string) => mockCache.get(key) ?? null,
  set: async (key: string, data: unknown) => {
    mockCache.set(key, data)
  },
  invalidate: async (key: string) => {
    mockCache.delete(key)
  },
}

class EmailPassFixtureProvider extends AbstractAuthModuleProvider {
  static identifier = "emailpass"

  constructor() {
    super({}, { provider: "emailpass", displayName: "Emailpass Fixture" })
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
      })

      const providerIdentity = authIdentity.provider_identities?.find(
        (pi) => pi.provider === this.provider
      )!

      if (providerIdentity.provider_metadata?.password === password) {
        return {
          success: true,
          authIdentity,
        }
      }
    } catch (error) {
      if (error.type !== MedusaError.Types.NOT_FOUND) {
        return { success: false, error: error.message }
      }
    }

    return {
      success: false,
      error: "Invalid email or password",
    }
  }
}

const parseJson = (value: unknown) =>
  typeof value === "string" ? JSON.parse(value) : value

const createUnverifiedIdentity = async (service: IAuthModuleService) => {
  return await service.createAuthIdentities({
    id: "auth-id",
    provider_identities: [
      {
        id: "provider-id",
        entity_id: "verify@test.com",
        provider: "emailpass",
        provider_metadata: {
          password: "plaintext",
        },
      },
    ],
  })
}

moduleIntegrationTestRunner<IAuthModuleService>({
  moduleName: Modules.AUTH,
  testSuite: ({ MikroOrmWrapper, service }) => {
    describe("AuthModuleService - verification providers", () => {
      beforeEach(async () => {
        jest.spyOn(Date, "now").mockReturnValue(1_710_000_000_000)
        await createUnverifiedIdentity(service)
      })

      afterEach(() => {
        jest.restoreAllMocks()
      })

      it("generates an opaque token and stores only its hash in provider_metadata", async () => {
        const result = await service.requestAuthVerification({
          entity_type: "email",
          code_provider: "token",
          auth_identity_id: "auth-id",
          entity_id: "verify@test.com",
          metadata: {
            source: "test",
          },
        })

        expect(result).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            expires_at: new Date(1_710_000_900_000),
            entity_id: "verify@test.com",
            auth_identity_id: "auth-id",
            entity_type: "email",
            code_provider: "token",
            metadata: {
              source: "test",
            },
            requested_at: new Date(1_710_000_000_000),
            provider_metadata: {
              token_hash: expect.stringMatching(/^[a-f0-9]{64}$/),
            },
          })
        )
        expect(result.provider_metadata?.token_hash).not.toEqual(result.code)

        const [storedVerification] =
          await MikroOrmWrapper.forkManager().execute(
            "select * from auth_verification where auth_identity_id = ?",
            ["auth-id"]
          )

        expect(
          parseJson(storedVerification.provider_metadata).token_hash
        ).toEqual(result.provider_metadata?.token_hash)
        expect(storedVerification).not.toHaveProperty("token_hash")
      })

      it("reuses the same verification record when requesting again", async () => {
        const first = await service.requestAuthVerification({
          entity_type: "email",
          code_provider: "token",
          auth_identity_id: "auth-id",
          entity_id: "verify@test.com",
        })
        const second = await service.requestAuthVerification({
          entity_type: "email",
          code_provider: "token",
          auth_identity_id: "auth-id",
          entity_id: "verify@test.com",
        })

        const storedVerifications = await MikroOrmWrapper.forkManager().execute(
          "select * from auth_verification where auth_identity_id = ?",
          ["auth-id"]
        )

        expect(first.code).not.toEqual(second.code)
        expect(storedVerifications).toHaveLength(1)
        expect(storedVerifications[0].deleted_at).toBeNull()

        await expect(
          service.confirmAuthVerification({ code: first.code })
        ).rejects.toThrow("Verification code is invalid or already used")
      })

      it("confirms a token without requiring auth identity context", async () => {
        const { code } = await service.requestAuthVerification({
          entity_type: "email",
          code_provider: "token",
          auth_identity_id: "auth-id",
          entity_id: "verify@test.com",
        })

        await expect(
          service.confirmAuthVerification({ code })
        ).resolves.toEqual(
          expect.objectContaining({
            auth_identity_id: "auth-id",
            entity_id: "verify@test.com",
            entity_type: "email",
            code_provider: "token",
            verified_at: new Date(1_710_000_000_000),
          })
        )
      })

      it("rejects an unregistered verification provider", async () => {
        const { code } = await service.requestAuthVerification({
          entity_type: "email",
          code_provider: "token",
          auth_identity_id: "auth-id",
          entity_id: "verify@test.com",
        })

        await expect(
          service.confirmAuthVerification({
            code,
            code_provider: "unknown",
          })
        ).rejects.toThrow(
          "Unable to retrieve the verification provider with id: unknown"
        )

        await expect(
          service.confirmAuthVerification({
            code,
            code_provider: "token",
          })
        ).resolves.toEqual(
          expect.objectContaining({
            auth_identity_id: "auth-id",
            entity_id: "verify@test.com",
            entity_type: "email",
            code_provider: "token",
            verified_at: new Date(1_710_000_000_000),
          })
        )
      })

      it("rejects expired, used, and unknown tokens", async () => {
        const { code: expiredCode } = await service.requestAuthVerification({
          entity_type: "email",
          code_provider: "token",
          auth_identity_id: "auth-id",
          entity_id: "verify@test.com",
        })

        await MikroOrmWrapper.forkManager().execute(
          "update auth_verification set requested_at = ? where auth_identity_id = ?",
          [new Date(1_709_999_000_000), "auth-id"]
        )

        await expect(
          service.confirmAuthVerification({ code: expiredCode })
        ).rejects.toThrow("Verification code has expired")

        const active = await service.requestAuthVerification({
          entity_type: "email",
          code_provider: "token",
          auth_identity_id: "auth-id",
          entity_id: "verify@test.com",
        })

        await service.confirmAuthVerification({ code: active.code })
        await expect(
          service.confirmAuthVerification({ code: active.code })
        ).rejects.toThrow("Verification code is invalid or already used")
        await expect(
          service.confirmAuthVerification({ code: "missing" })
        ).rejects.toThrow("Verification code is invalid or already used")
      })
    })
  },
})

moduleIntegrationTestRunner<IAuthModuleService>({
  moduleName: Modules.AUTH,
  moduleOptions: {
    providers: [
      {
        resolve: {
          services: [EmailPassFixtureProvider],
        },
        id: "emailpass",
      },
    ],
    mfa: {
      encryption_key: "test-mfa-encryption-key",
      recovery_code_count: 2,
      challenge_ttl_seconds: 60,
      challenge_max_attempts: 2,
      providers: [
        {
          id: "totp",
          options: {
            issuer: "Medusa Test",
            window: 0,
          },
        },
      ],
    },
  },
  moduleDependencies: [Modules.CACHE],
  injectedDependencies: {
    [Modules.CACHE]: inMemoryCache,
  },
  testSuite: ({ service }) => {
    describe("AuthModuleService - verification authentication flow", () => {
      beforeEach(async () => {
        jest.spyOn(Date, "now").mockReturnValue(1_710_000_000_000)
        await createUnverifiedIdentity(service)
      })

      afterEach(() => {
        mockCache.clear()
        jest.restoreAllMocks()
      })

      it("continues to MFA once the entity is verified", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "auth-id",
          provider: "totp",
        })
        const code = generateTotpCode({
          secret: setup.secret,
          timestamp: Date.now(),
        })
        const verification = await service.requestAuthVerification({
          entity_type: "email",
          code_provider: "token",
          auth_identity_id: "auth-id",
          entity_id: "verify@test.com",
        })

        await service.verifyAuthMfa({
          id: setup.mfa.id,
          code,
        })
        await service.confirmAuthVerification({
          code: verification.code,
        })

        const result = await service.authenticate("emailpass", {
          actor_type: "user",
          body: {
            email: "verify@test.com",
            password: "plaintext",
          },
        })

        expect(result).toEqual(
          expect.objectContaining({
            success: true,
            mfaChallenge: expect.objectContaining({
              auth_identity_id: "auth-id",
              actor_type: "user",
              auth_provider: "emailpass",
            }),
            authIdentity: expect.objectContaining({
              id: "auth-id",
              provider_identities: [
                expect.objectContaining({ entity_id: "verify@test.com" }),
              ],
            }),
          })
        )
        expect(result.verification).toBeUndefined()
      })
    })
  },
})
