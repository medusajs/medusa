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
          requires_verification: true,
        },
      },
    ],
  })
}

moduleIntegrationTestRunner<IAuthModuleService>({
  moduleName: Modules.AUTH,
  testSuite: ({ MikroOrmWrapper, service }) => {
    describe("AuthModuleService - verification tokens", () => {
      beforeEach(async () => {
        jest.spyOn(Date, "now").mockReturnValue(1_710_000_000_000)
        await createUnverifiedIdentity(service)
      })

      afterEach(() => {
        jest.restoreAllMocks()
      })

      it("generates an opaque token and stores only its hash", async () => {
        const result = await service.requestAuthVerification({
          actor_type: "user",
          provider: "emailpass",
          entity_id: "verify@test.com",
          ttl_seconds: 60,
          metadata: {
            source: "test",
          },
        })

        expect(result).toEqual({
          token: expect.any(String),
          verification: expect.objectContaining({
            actor_type: "user",
            provider: "emailpass",
            auth_identity_id: "auth-id",
            provider_identity_id: "provider-id",
            entity_id: "verify@test.com",
            expires_at: new Date(1_710_000_060_000),
            metadata: {
              source: "test",
            },
          }),
        })
        expect(result.verification).not.toHaveProperty("token")

        const [storedToken] = await MikroOrmWrapper.forkManager().execute(
          "select * from auth_verification_token where provider_identity_id = ?",
          ["provider-id"]
        )

        expect(storedToken.token_hash).not.toEqual(result.token)
        expect(storedToken.token_hash).toMatch(/^[a-f0-9]{64}$/)
      })

      it("uses a short default token TTL", async () => {
        const result = await service.requestAuthVerification({
          provider: "emailpass",
          entity_id: "verify@test.com",
        })

        expect(result.verification.expires_at).toEqual(
          new Date(1_710_000_900_000)
        )
      })

      it("invalidates existing unused tokens when requesting a new token", async () => {
        const first = await service.requestAuthVerification({
          provider: "emailpass",
          entity_id: "verify@test.com",
        })
        const second = await service.requestAuthVerification({
          provider: "emailpass",
          entity_id: "verify@test.com",
        })

        const storedTokens = await MikroOrmWrapper.forkManager().execute(
          "select * from auth_verification_token where provider_identity_id = ?",
          ["provider-id"]
        )

        expect(first.token).not.toEqual(second.token)
        expect(storedTokens).toHaveLength(1)
        expect(storedTokens[0].deleted_at).toBeNull()

        await expect(
          service.confirmAuthVerification({ token: first.token })
        ).rejects.toThrow("Verification token is invalid or already used")
      })

      it("confirms a token, consumes it, and marks the provider identity verified", async () => {
        const { token } = await service.requestAuthVerification({
          provider: "emailpass",
          entity_id: "verify@test.com",
        })

        await expect(
          service.confirmAuthVerification({ token })
        ).resolves.toEqual({
          verified: true,
          auth_identity_id: "auth-id",
          provider_identity_id: "provider-id",
          entity_id: "verify@test.com",
        })

        const [providerIdentity] = await MikroOrmWrapper.forkManager().execute(
          "select provider_metadata from provider_identity where id = ?",
          ["provider-id"]
        )
        const storedTokens = await MikroOrmWrapper.forkManager().execute(
          "select * from auth_verification_token where provider_identity_id = ?",
          ["provider-id"]
        )

        expect(
          parseJson(providerIdentity.provider_metadata).verified_at
        ).toEqual(new Date(1_710_000_000_000).toISOString())
        expect(
          parseJson(providerIdentity.provider_metadata).requires_verification
        ).toBe(false)
        expect(storedTokens).toHaveLength(0)
      })

      it("rejects the wrong provider without consuming the token", async () => {
        const { token } = await service.requestAuthVerification({
          provider: "emailpass",
          entity_id: "verify@test.com",
        })

        await expect(
          service.confirmAuthVerification({
            token,
            provider: "google",
          })
        ).rejects.toThrow(
          'Verification token does not belong to provider "google"'
        )

        const [providerIdentity] = await MikroOrmWrapper.forkManager().execute(
          "select provider_metadata from provider_identity where id = ?",
          ["provider-id"]
        )
        const [storedToken] = await MikroOrmWrapper.forkManager().execute(
          "select * from auth_verification_token where provider_identity_id = ?",
          ["provider-id"]
        )

        expect(
          parseJson(providerIdentity.provider_metadata).verified_at
        ).toBeUndefined()
        expect(parseJson(providerIdentity.provider_metadata)).toEqual(
          expect.objectContaining({
            requires_verification: true,
          })
        )
        expect(storedToken).toBeDefined()

        await expect(
          service.confirmAuthVerification({
            token,
            provider: "emailpass",
          })
        ).resolves.toEqual({
          verified: true,
          auth_identity_id: "auth-id",
          provider_identity_id: "provider-id",
          entity_id: "verify@test.com",
        })
      })

      it("rejects expired, used, and unknown tokens", async () => {
        const expired = await service.createAuthVerificationToken({
          auth_identity_id: "auth-id",
          provider_identity_id: "provider-id",
          entity_id: "verify@test.com",
          expires_at: new Date(1_709_999_999_000),
        })

        await expect(
          service.confirmAuthVerification({ token: expired.token })
        ).rejects.toThrow("Verification token has expired")

        const active = await service.requestAuthVerification({
          provider: "emailpass",
          entity_id: "verify@test.com",
        })

        await service.confirmAuthVerification({ token: active.token })
        await expect(
          service.confirmAuthVerification({ token: active.token })
        ).rejects.toThrow("Verification token is invalid or already used")
        await expect(
          service.confirmAuthVerification({ token: "missing" })
        ).rejects.toThrow("Verification token is invalid or already used")
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

      it("returns verification required before MFA challenge creation", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "auth-id",
          provider: "totp",
        })
        const code = generateTotpCode({
          secret: setup.secret,
          timestamp: Date.now(),
        })

        await service.verifyAuthMfa({
          id: setup.mfa.id,
          code,
        })

        const result = await service.authenticate("emailpass", {
          actor_type: "user",
          body: {
            email: "verify@test.com",
            password: "plaintext",
          },
        })

        expect(result).toEqual({
          success: true,
          verification: {
            actor_type: "user",
            provider: "emailpass",
            entity_id: "verify@test.com",
          },
        })
        expect(result.authIdentity).toBeUndefined()
        expect(result.mfa_challenge).toBeUndefined()
      })

      it("continues to MFA once the emailpass identity is verified", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "auth-id",
          provider: "totp",
        })
        const code = generateTotpCode({
          secret: setup.secret,
          timestamp: Date.now(),
        })
        const verification = await service.requestAuthVerification({
          provider: "emailpass",
          entity_id: "verify@test.com",
        })

        await service.verifyAuthMfa({
          id: setup.mfa.id,
          code,
        })
        await service.confirmAuthVerification({
          token: verification.token,
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
            mfa_challenge: expect.objectContaining({
              auth_identity_id: "auth-id",
              actor_type: "user",
              auth_provider: "emailpass",
            }),
          })
        )
        expect(result.authIdentity).toBeUndefined()
        expect(result.verification).toBeUndefined()
      })
    })
  },
})
