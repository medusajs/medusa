import { Modules } from "@medusajs/modules-sdk"
import { IAuthModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import { resolve } from "path"

let moduleOptions = {
  providers: [
    {
      resolve: resolve(
        process.cwd() +
          "/integration-tests/__fixtures__/providers/default-provider"
      ),
      options: {
        config: {
          plaintextpass: {},
        },
      },
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
        await service.create({
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
          error: "Could not find a auth provider with id: facebook",
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

        const dbAuthIdentity = await service.retrieve(
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
