import { IAuthModuleService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { AuthModuleService } from "@services"
import { moduleIntegrationTestRunner, SuiteOptions } from "@medusajs/test-utils"
import { resolve } from "path"

let moduleOptions = {
  providers: [
    {
      resolve: resolve(
        process.cwd() +
          "/integration-tests/__fixtures__/providers/default-provider"
      ),
      id: "plaintextpass",
    },
  ],
}

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.AUTH,
  moduleOptions,
  testSuite: ({ service }: SuiteOptions<IAuthModuleService>) =>
    describe("Auth Module Service", () => {
      beforeEach(async () => {
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

      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.AUTH, {
          service: AuthModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual([
          "authIdentity",
          "providerIdentity",
        ])

        linkable.authIdentity.toJSON = undefined

        expect(linkable.authIdentity).toEqual({
          id: {
            linkable: "auth_identity_id",
            entity: "AuthIdentity",
            primaryKey: "id",
            serviceName: "auth",
            field: "authIdentity",
          },
        })

        linkable.providerIdentity.toJSON = undefined

        expect(linkable.providerIdentity).toEqual({
          id: {
            linkable: "provider_identity_id",
            entity: "ProviderIdentity",
            primaryKey: "id",
            serviceName: "auth",
            field: "providerIdentity",
          },
        })
      })

      it("it fails if the provider does not exist", async () => {
        const err = await service
          .authenticate("facebook", {
            body: {
              email: "test@admin.com",
              password: "password",
            },
          })
          .catch((e) => e)

        expect(err).toEqual({
          success: false,
          error: `
Unable to retrieve the auth provider with id: facebook
Please make sure that the provider is registered in the container and it is configured correctly in your project configuration file.`,
        })
      })

      describe("getCredentialsUpdatedAt", () => {
        const passwordUpdatedAt = "2026-01-01T00:00:00.000Z"

        it("returns the date the provider reports", async () => {
          const result = await service.getCredentialsUpdatedAt(
            "plaintextpass",
            {
              provider: "plaintextpass",
              provider_metadata: { password_updated_at: passwordUpdatedAt },
            } as any
          )

          expect(result).toEqual(new Date(passwordUpdatedAt))
        })

        it("returns null when the provider has no update date", async () => {
          const [providerIdentity] = await service.listProviderIdentities({
            entity_id: "test@admin.com",
          })

          const result = await service.getCredentialsUpdatedAt(
            "plaintextpass",
            providerIdentity
          )

          expect(result).toBeNull()
        })

        it("returns null when the provider is not registered", async () => {
          const result = await service.getCredentialsUpdatedAt("facebook", {
            provider: "facebook",
            provider_metadata: { password_updated_at: passwordUpdatedAt },
          } as any)

          expect(result).toBeNull()
        })
      })

      it("successfully calls the provider for authentication if correct password", async () => {
        const result = await service.authenticate("plaintextpass", {
          body: {
            email: "test@admin.com",
            password: "plaintext",
          },
        })

        expect(result).toEqual(
          expect.objectContaining({
            success: true,
            authIdentity: expect.objectContaining({
              id: expect.any(String),
              provider_identities: [
                expect.objectContaining({ entity_id: "test@admin.com" }),
              ],
            }),
          })
        )
      })

      it("should fail if the password is incorrect", async () => {
        const result = await service
          .authenticate("plaintextpass", {
            body: {
              email: "test@admin.com",
              password: "incorrect",
            },
          })
          .catch((e) => e)

        expect(result).toEqual(
          expect.objectContaining({
            success: false,
            error: "Invalid email or password",
          })
        )
      })

      it("successfully create a new entity if nonexistent", async () => {
        const result = await service.authenticate("plaintextpass", {
          body: {
            email: "new@admin.com",
            password: "newpass",
          },
        })

        const dbAuthIdentity = await service.retrieveAuthIdentity(
          result.authIdentity?.id!,
          { relations: ["provider_identities"] }
        )

        expect(dbAuthIdentity).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            provider_identities: [
              expect.objectContaining({ entity_id: "new@admin.com" }),
            ],
          })
        )
      })
    }),
})
