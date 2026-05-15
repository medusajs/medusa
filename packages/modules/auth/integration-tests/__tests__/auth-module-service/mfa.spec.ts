import { AuthTypes, IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { resolve } from "path"
import { createAuthIdentities } from "../../__fixtures__/auth-identity"
import { generateTotpCode } from "../../../src/utils/totp"

jest.setTimeout(30000)

const mockCache = new Map()
const inMemoryCache = {
  get: async (key: string) => mockCache.get(key) ?? null,
  set: async (key: string, data: any) => {
    mockCache.set(key, data)
  },
  invalidate: async (key: string) => {
    mockCache.delete(key)
  },
}

class TestMfaProvider {
  static identifier = "test_mfa"

  readonly method = TestMfaProvider.identifier

  constructor(
    _container: unknown,
    private readonly options_: Record<string, unknown> = {}
  ) {}

  async canVerifyForAuthIdentity(): Promise<boolean> {
    return true
  }

  async verify(data: { code: string }): Promise<boolean> {
    return data.code === "123456"
  }

  async start(
    data: AuthTypes.AuthMfaStartDTO
  ): Promise<AuthTypes.AuthMfaStartResponse> {
    return {
      mfa: {
        id: "test-mfa-factor",
        auth_identity_id: data.auth_identity_id,
        provider: this.method,
        status: "pending",
        metadata: {
          option: this.options_.option,
        },
      },
      secret: "test-secret",
    }
  }

  async verifySetup(
    data: AuthTypes.AuthMfaVerifyDTO
  ): Promise<AuthTypes.AuthMfaDTO> {
    return {
      id: data.id,
      provider: this.method,
      status: "enabled",
    }
  }
}

moduleIntegrationTestRunner<IAuthModuleService>({
  moduleName: Modules.AUTH,
  moduleOptions: {
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
  testSuite: ({ MikroOrmWrapper, service }) => {
    describe("AuthModuleService - MFA", () => {
      beforeEach(async () => {
        jest.spyOn(Date, "now").mockReturnValue(1_710_000_000_000)
        await createAuthIdentities(service)
      })

      afterEach(() => {
        mockCache.clear()
        jest.restoreAllMocks()
      })

      it("provisions a pending TOTP factor without exposing the encrypted secret", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "test-id",
          provider: "totp",
          label: "Authenticator app",
        })

        expect(setup).toEqual({
          mfa: expect.objectContaining({
            auth_identity_id: "test-id",
            metadata: expect.objectContaining({
              label: "Authenticator app",
            }),
            provider: "totp",
            status: "pending",
          }),
          otpauth_url: expect.stringContaining("otpauth://totp/"),
          secret: expect.any(String),
        })
        expect(setup.otpauth_url).toContain(
          "Medusa%20Test:Authenticator%20app"
        )
        expect(setup.otpauth_url).toContain("issuer=Medusa%20Test")
        expect(setup.mfa).not.toHaveProperty("secret")
        expect(setup.mfa).not.toHaveProperty("provider_metadata")

        const [storedFactor] = await MikroOrmWrapper.forkManager().execute(
          "select provider_metadata from auth_mfa_factor where id = ?",
          [setup.mfa.id]
        )
        const providerMetadata =
          typeof storedFactor.provider_metadata === "string"
            ? JSON.parse(storedFactor.provider_metadata)
            : storedFactor.provider_metadata

        expect(providerMetadata.secret).not.toEqual(setup.secret)
        expect(providerMetadata.secret).toMatch(/^v1:/)
        expect(providerMetadata.issuer).toEqual("Medusa Test")

        const factors = await service.listAuthMfa({
          auth_identity_id: "test-id",
        })

        expect(factors).toEqual([
          expect.objectContaining({
            id: setup.mfa.id,
            provider: "totp",
            status: "pending",
          }),
        ])
        expect(factors[0]).not.toHaveProperty("secret")
        expect(factors[0]).not.toHaveProperty("provider_metadata")
      })

      it("enables a pending TOTP factor after a valid code", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "test-id",
          provider: "totp",
        })
        const code = generateTotpCode({
          secret: setup.secret,
          timestamp: Date.now(),
        })

        const factor = await service.verifyAuthMfa({
          id: setup.mfa.id,
          code,
        })

        expect(factor).toEqual(
          expect.objectContaining({
            id: setup.mfa.id,
            provider: "totp",
            status: "enabled",
          })
        )
        expect(factor).not.toHaveProperty("secret")
        expect(factor).not.toHaveProperty("provider_metadata")
      })

      it("rejects invalid TOTP codes", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "test-id",
          provider: "totp",
        })

        await expect(
          service.verifyAuthMfa({
            id: setup.mfa.id,
            code: "000000",
          })
        ).rejects.toThrow("Invalid TOTP code")
      })

      it("prevents duplicate active TOTP factors", async () => {
        await service.startAuthMfa({
          auth_identity_id: "test-id",
          provider: "totp",
        })

        await expect(
          service.startAuthMfa({
            auth_identity_id: "test-id",
            provider: "totp",
          })
        ).rejects.toThrow(
          "An active TOTP factor already exists for this auth identity"
        )
      })

      it("generates hashed single-use recovery codes", async () => {
        const { codes } = await service.generateAuthMfaRecoveryCodes({
          auth_identity_id: "test-id",
        })

        expect(codes).toHaveLength(2)

        const storedCodes = await MikroOrmWrapper.forkManager().execute(
          "select * from auth_mfa_recovery_code where auth_identity_id = ? and deleted_at is null",
          ["test-id"]
        )

        expect(storedCodes).toHaveLength(2)
        expect(storedCodes.map((code) => code.code_hash)).not.toContain(
          codes[0]
        )
        expect(storedCodes.every((code) => !("salt" in code))).toBe(true)

        await service.useAuthMfaRecoveryCode({
          auth_identity_id: "test-id",
          code: codes[0],
        })

        const remainingCodes = await MikroOrmWrapper.forkManager().execute(
          "select id from auth_mfa_recovery_code where auth_identity_id = ? and deleted_at is null",
          ["test-id"]
        )

        expect(remainingCodes).toHaveLength(1)

        await expect(
          service.useAuthMfaRecoveryCode({
            auth_identity_id: "test-id",
            code: codes[0],
          })
        ).rejects.toThrow("Recovery code is invalid or already used")
      })

      it("disables MFA factors", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "test-id",
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

        const factor = await service.disableAuthMfa({
          id: setup.mfa.id,
          method: "totp",
          code,
        })

        expect(factor).toEqual(
          expect.objectContaining({
            id: setup.mfa.id,
            status: "disabled",
          })
        )
      })

      it("disables MFA factors without an MFA challenge by default", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "test-id",
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

        const factor = await service.disableAuthMfa({
          id: setup.mfa.id,
        })

        expect(factor).toEqual(
          expect.objectContaining({
            id: setup.mfa.id,
            status: "disabled",
          })
        )
      })

      it("creates an MFA challenge for enabled methods", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "test-id",
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
        await service.generateAuthMfaRecoveryCodes({
          auth_identity_id: "test-id",
        })

        const challenge = await service.createAuthMfaChallenge({
          auth_identity_id: "test-id",
          metadata: {
            source: "auth",
          },
        })

        expect(challenge).toEqual(
          expect.objectContaining({
            auth_identity_id: "test-id",
            attempts: 0,
            max_attempts: 2,
            methods: ["totp", "recovery_code"],
            completed_at: null,
            metadata: {
              source: "auth",
            },
          })
        )
        expect(new Date(challenge.expires_at).getTime()).toBe(
          Date.now() + 60_000
        )
      })

      it("does not create an MFA challenge from recovery codes alone", async () => {
        await service.generateAuthMfaRecoveryCodes({
          auth_identity_id: "test-id",
        })

        await expect(
          service.createAuthMfaChallenge({
            auth_identity_id: "test-id",
          })
        ).rejects.toThrow("Auth identity does not have any enabled MFA methods")
      })

      it("completes an MFA challenge with a valid method code", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "test-id",
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
        const challenge = await service.createAuthMfaChallenge({
          auth_identity_id: "test-id",
        })

        const completed = await service.verifyAuthMfaChallenge({
          id: challenge.id,
          method: "totp",
          code,
        })

        expect(completed).toEqual(
          expect.objectContaining({
            id: challenge.id,
            attempts: 0,
            completed_at: expect.any(Date),
          })
        )

        await expect(
          service.verifyAuthMfaChallenge({
            id: challenge.id,
            method: "totp",
            code,
          })
        ).rejects.toThrow("MFA challenge has already been completed")
      })

      it("tracks failed MFA challenge attempts", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "test-id",
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
        const challenge = await service.createAuthMfaChallenge({
          auth_identity_id: "test-id",
        })

        await expect(
          service.verifyAuthMfaChallenge({
            id: challenge.id,
            method: "totp",
            code: "000000",
          })
        ).rejects.toThrow("Invalid MFA challenge code")

        await expect(
          service.verifyAuthMfaChallenge({
            id: challenge.id,
            method: "totp",
            code: "000000",
          })
        ).rejects.toThrow("MFA challenge has too many failed attempts")

        await expect(
          service.verifyAuthMfaChallenge({
            id: challenge.id,
            method: "totp",
            code,
          })
        ).rejects.toThrow("MFA challenge has too many failed attempts")
      })

      it("rejects expired MFA challenges", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "test-id",
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
        const challenge = await service.createAuthMfaChallenge({
          auth_identity_id: "test-id",
        })

        jest.spyOn(Date, "now").mockReturnValue(1_710_000_061_000)

        await expect(
          service.verifyAuthMfaChallenge({
            id: challenge.id,
            method: "totp",
            code,
          })
        ).rejects.toThrow("MFA challenge has expired")
      })
    })
  },
})

moduleIntegrationTestRunner<IAuthModuleService>({
  moduleName: Modules.AUTH,
  moduleOptions: {
    mfa: {
      encryption_key: "test-mfa-encryption-key",
      disable_policy: "challenge",
    },
  },
  testSuite: ({ service }) => {
    describe("AuthModuleService - challenge MFA disable policy", () => {
      beforeEach(async () => {
        await createAuthIdentities(service)
      })

      it("requires an MFA challenge when disabling MFA factors", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "test-id",
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

        await expect(
          service.disableAuthMfa({
            id: setup.mfa.id,
          })
        ).rejects.toThrow("MFA verification code is required to disable MFA")
      })
    })
  },
})

moduleIntegrationTestRunner<IAuthModuleService>({
  moduleName: Modules.AUTH,
  moduleOptions: {
    providers: [
      {
        resolve: resolve(
          process.cwd() +
            "/integration-tests/__fixtures__/providers/default-provider"
        ),
        id: "plaintextpass",
      },
    ],
    mfa: {
      encryption_key: "test-mfa-encryption-key",
      challenge_ttl_seconds: 60,
      challenge_max_attempts: 2,
    },
  },
  moduleDependencies: [Modules.CACHE],
  injectedDependencies: {
    [Modules.CACHE]: inMemoryCache,
  },
  testSuite: ({ service }) => {
    describe("AuthModuleService - MFA authentication flow", () => {
      beforeEach(async () => {
        jest.spyOn(Date, "now").mockReturnValue(1_710_000_000_000)
        await service.createAuthIdentities({
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "plaintextpass",
              provider_metadata: {
                password: "plaintext",
              },
            },
          ],
        })
      })

      afterEach(() => {
        mockCache.clear()
        jest.restoreAllMocks()
      })

      it("returns the auth identity when MFA is not enabled", async () => {
        const result = await service.authenticate("plaintextpass", {
          actor_type: "user",
          body: {
            email: "test@admin.com",
            password: "plaintext",
          },
        })

        expect(result).toEqual(
          expect.objectContaining({
            success: true,
            authIdentity: expect.objectContaining({
              provider_identities: [
                expect.objectContaining({ entity_id: "test@admin.com" }),
              ],
            }),
          })
        )
        expect(result.mfa_challenge).toBeUndefined()
      })

      it("returns an MFA challenge instead of the auth identity when MFA is enabled", async () => {
        const initial = await service.authenticate("plaintextpass", {
          actor_type: "user",
          body: {
            email: "test@admin.com",
            password: "plaintext",
          },
        })
        const setup = await service.startAuthMfa({
          auth_identity_id: initial.authIdentity!.id,
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

        const result = await service.authenticate("plaintextpass", {
          actor_type: "user",
          body: {
            email: "test@admin.com",
            password: "plaintext",
          },
        })

        expect(result).toEqual(
          expect.objectContaining({
            success: true,
            mfa_challenge: expect.objectContaining({
              auth_identity_id: initial.authIdentity!.id,
              actor_type: "user",
              auth_provider: "plaintextpass",
              methods: ["totp"],
              attempts: 0,
              max_attempts: 2,
            }),
          })
        )
        expect(result.authIdentity).toBeUndefined()
      })
    })
  },
})

moduleIntegrationTestRunner<IAuthModuleService>({
  moduleName: Modules.AUTH,
  moduleOptions: {
    mfa: {
      providers: [
        {
          resolve: {
            services: [TestMfaProvider],
          },
          id: TestMfaProvider.identifier,
          options: {
            option: "configured",
          },
        },
      ],
    },
  },
  testSuite: ({ service }) => {
    describe("AuthModuleService - custom MFA providers", () => {
      beforeEach(async () => {
        await createAuthIdentities(service)
      })

      it("provisions factors through configured MFA providers", async () => {
        const setup = await service.startAuthMfa({
          auth_identity_id: "test-id",
          provider: "test_mfa",
        })

        expect(setup).toEqual({
          mfa: {
            id: "test-mfa-factor",
            auth_identity_id: "test-id",
            provider: "test_mfa",
            status: "pending",
            metadata: {
              option: "configured",
            },
          },
          secret: "test-secret",
        })
      })
    })
  },
})

moduleIntegrationTestRunner<IAuthModuleService>({
  moduleName: Modules.AUTH,
  moduleOptions: {},
  testSuite: ({ service }) => {
    describe("AuthModuleService - MFA configuration", () => {
      beforeEach(async () => {
        await createAuthIdentities(service)
      })

      it("requires an encryption key before provisioning MFA factors", async () => {
        await expect(
          service.startAuthMfa({
            auth_identity_id: "test-id",
            provider: "totp",
          })
        ).rejects.toThrow("MFA encryption key is required to use MFA methods")
      })
    })
  },
})
