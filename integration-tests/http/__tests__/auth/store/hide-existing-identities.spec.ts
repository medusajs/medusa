import { IAuthModuleService } from "@medusajs/framework/types"
import { AuthWorkflowEvents, Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import jwt from "jsonwebtoken"
import path from "path"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  medusaConfigFile: path.join(
    __dirname,
    "../../../__fixtures__/auth-hide-existing-identities"
  ),
  testSuite: ({ getContainer, api }) => {
    const register = (email: string, password: string) =>
      api.post(
        "/auth/customer/emailpass/register",
        { email, password },
        { validateStatus: () => true }
      )

    const login = (email: string, password: string) =>
      api.post(
        "/auth/customer/emailpass",
        { email, password },
        { validateStatus: () => true }
      )

    const confirmEmail = async (email: string) => {
      const authModule: IAuthModuleService = getContainer().resolve(
        Modules.AUTH
      )
      const [providerIdentity] = await authModule.listProviderIdentities({
        provider: "emailpass",
        entity_id: email,
      })
      const { code } = await authModule.requestAuthVerification({
        auth_identity_id: providerIdentity.auth_identity_id!,
        entity_id: email,
        entity_type: "email",
        code_provider: "token",
      })

      const confirmed = await api.post("/auth/verification/confirm", { code })
      expect(confirmed.status).toEqual(200)
    }

    describe("Registering with hide_existing_identities", () => {
      it("answers the same way for new and existing identities", async () => {
        const emit = jest.spyOn(
          getContainer().resolve(Modules.EVENT_BUS),
          "emit"
        )

        const created = await register("new@medusa.js", "secret_password")
        const existing = await register("new@medusa.js", "other_password")

        expect(created.status).toEqual(200)
        expect(existing.status).toEqual(200)
        expect(created.data).toEqual({ verification_required: true })
        expect(existing.data).toEqual(created.data)
        expect(emit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: AuthWorkflowEvents.REGISTRATION_WITH_EXISTING_IDENTITY,
            data: {
              entity_id: "new@medusa.js",
              actor_type: "customer",
              auth_provider: "emailpass",
            },
          })
        )

        emit.mockRestore()
      })

      it("fails a login before the email is verified like a wrong password", async () => {
        await register("unverified@medusa.js", "secret_password")

        const rightPassword = await login(
          "unverified@medusa.js",
          "secret_password"
        )
        const wrongPassword = await login(
          "unverified@medusa.js",
          "wrong_password"
        )
        const unknownEmail = await login("nobody@medusa.js", "secret_password")

        for (const response of [rightPassword, wrongPassword, unknownEmail]) {
          expect(response.status).toEqual(401)
          expect(response.data.message).toEqual("Authentication failed")
        }
      })

      it("logs in without an actor once the email is verified", async () => {
        await register("verified@medusa.js", "secret_password")
        await confirmEmail("verified@medusa.js")

        const response = await login("verified@medusa.js", "secret_password")

        expect(response.status).toEqual(200)
        expect(response.data.verification_required).toBeUndefined()
        const token = jwt.decode(response.data.token) as Record<string, unknown>
        expect(token).toEqual(
          expect.objectContaining({ actor_id: "", actor_type: "customer" })
        )
      })
    })
  },
})
