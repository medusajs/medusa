import { IAuthModuleService, IUserModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import jwt from "jsonwebtoken"
import path from "path"
import { generateTotpCode } from "../../../../../packages/modules/auth/src/utils/totp"

jest.setTimeout(100000)

const createUserWithMfa = async (
  api,
  container,
  email: string,
  password: string
) => {
  const signup = await api.post("/auth/user/emailpass/register", {
    email,
    password,
  })

  expect(signup.status).toEqual(200)

  const { auth_identity_id } = jwt.decode(signup.data.token) as {
    auth_identity_id: string
  }

  const userModule: IUserModuleService = container.resolve(Modules.USER)
  const authModule: IAuthModuleService = container.resolve(Modules.AUTH)

  const user = await userModule.createUsers({
    email,
    first_name: "MFA",
    last_name: "User",
  })

  await authModule.updateAuthIdentities({
    id: auth_identity_id,
    app_metadata: { user_id: user.id },
  })

  const authHeader = {
    headers: { authorization: `Bearer ${signup.data.token}` },
  }

  const setup = await api.post(
    "/auth/mfa/factors",
    { provider: "totp", label: "Authenticator app" },
    authHeader
  )

  const code = generateTotpCode({ secret: setup.data.secret })
  await api.post(
    `/auth/mfa/factors/${setup.data.mfa_factor.id}/verify`,
    { code },
    authHeader
  )

  return {
    email,
    password,
    secret: setup.data.secret as string,
  }
}

medusaIntegrationTestRunner({
  medusaConfigFile: path.join(
    __dirname,
    "../../../__fixtures__/auth-mfa-verification"
  ),
  testSuite: ({ getContainer, api }) => {
    describe("MFA with email verification", () => {
      it("requires email verification before MFA during login", async () => {
        const container = getContainer()
        const email = "mfa-verify@medusa.js"
        const password = "secret_password"
        const { secret } = await createUserWithMfa(
          api,
          container,
          email,
          password
        )

        const login = await api.post("/auth/user/emailpass", {
          email,
          password,
        })

        expect(login.status).toEqual(200)
        expect(login.data.verification_required).toEqual(true)
        expect(login.data.token).toEqual(expect.any(String))
        expect(login.data.mfa_required).toBeUndefined()
        expect(login.data.mfa_challenge).toBeUndefined()

        const loginToken = jwt.decode(login.data.token) as Record<
          string,
          unknown
        >
        expect(loginToken.actor_id).toEqual("")

        const authModule: IAuthModuleService = container.resolve(Modules.AUTH)
        const verification = await authModule.requestAuthVerification({
          auth_identity_id: loginToken.auth_identity_id as string,
          entity_id: email,
          entity_type: "email",
          code_provider: "token",
        })

        const confirmed = await api.post(
          "/auth/verification/confirm",
          { code: verification.code },
          { headers: { authorization: `Bearer ${login.data.token}` } }
        )

        expect(confirmed.status).toEqual(200)
        expect(confirmed.data.verified_at).toEqual(expect.any(String))

        const refresh = await api.post(
          "/auth/token/refresh",
          {},
          { headers: { authorization: `Bearer ${login.data.token}` } }
        )

        expect(refresh.status).toEqual(200)
        expect(refresh.data).toEqual({
          mfa_required: true,
          mfa_challenge: expect.objectContaining({
            auth_identity_id: loginToken.auth_identity_id,
            methods: expect.arrayContaining(["totp"]),
          }),
          token: expect.any(String),
        })

        const totpCode = generateTotpCode({ secret })
        const authenticated = await api.post(
          `/auth/mfa/challenges/${refresh.data.mfa_challenge.id}/verify`,
          { method: "totp", code: totpCode },
          { headers: { authorization: `Bearer ${refresh.data.token}` } }
        )

        expect(authenticated.status).toEqual(200)

        const decoded = jwt.decode(authenticated.data.token) as Record<
          string,
          unknown
        >
        expect(decoded).toEqual(
          expect.objectContaining({
            actor_id: expect.any(String),
            actor_type: "user",
            auth_identity_id: loginToken.auth_identity_id,
            auth_provider: "emailpass",
          })
        )
        expect(decoded.actor_id).not.toEqual("")
      })
    })
  },
})
