import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import jwt from "jsonwebtoken"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { generateTotpCode } from "../../../../../packages/modules/auth/src/utils/totp"

jest.setTimeout(100000)

const enrollTotpFactor = async (api) => {
  const setup = await api.post(
    "/auth/mfa/factors",
    { provider: "totp", label: "Authenticator app" },
    adminHeaders
  )

  expect(setup.status).toEqual(200)
  expect(setup.data).toEqual({
    mfa_factor: expect.objectContaining({
      provider: "totp",
      status: "pending",
    }),
    secret: expect.any(String),
    otpauth_url: expect.stringContaining("otpauth://totp/"),
  })

  const code = generateTotpCode({ secret: setup.data.secret })
  const verified = await api.post(
    `/auth/mfa/factors/${setup.data.mfa_factor.id}/verify`,
    { code },
    adminHeaders
  )

  expect(verified.status).toEqual(200)
  expect(verified.data.mfa_factor.status).toEqual("enabled")

  return {
    secret: setup.data.secret as string,
    factorId: setup.data.mfa_factor.id as string,
  }
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    beforeAll(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      await dbUtils.snapshot()
    })

    describe("MFA HTTP routes", () => {
      it("enrolls and verifies a TOTP factor", async () => {
        const { factorId } = await enrollTotpFactor(api)

        const factors = await api.get("/auth/mfa/factors", adminHeaders)

        expect(factors.status).toEqual(200)
        expect(factors.data.mfa_factors).toEqual([
          expect.objectContaining({
            id: factorId,
            provider: "totp",
            status: "enabled",
          }),
        ])
      })

      it("requires an MFA challenge when logging in with an enabled factor", async () => {
        await enrollTotpFactor(api)

        const login = await api.post("/auth/user/emailpass", {
          email: "admin@medusa.js",
          password: "somepassword",
        })

        expect(login.status).toEqual(200)
        expect(login.data).toEqual({
          mfa_required: true,
          mfa_challenge: expect.objectContaining({
            auth_identity_id: expect.any(String),
            methods: expect.arrayContaining(["totp"]),
            attempts: 0,
          }),
          token: expect.any(String),
        })

        const decoded = jwt.decode(login.data.token) as Record<string, unknown>
        expect(decoded.actor_id).toEqual("")
      })

      it("completes an MFA challenge and issues an authenticated token", async () => {
        const { secret } = await enrollTotpFactor(api)

        const login = await api.post("/auth/user/emailpass", {
          email: "admin@medusa.js",
          password: "somepassword",
        })

        const code = generateTotpCode({ secret })
        const verified = await api.post(
          `/auth/mfa/challenges/${login.data.mfa_challenge.id}/verify`,
          { method: "totp", code },
          { headers: { authorization: `Bearer ${login.data.token}` } }
        )

        expect(verified.status).toEqual(200)
        expect(verified.data).toEqual({ token: expect.any(String) })

        const decoded = jwt.decode(verified.data.token) as Record<
          string,
          unknown
        >
        expect(decoded).toEqual(
          expect.objectContaining({
            actor_id: expect.any(String),
            actor_type: "user",
            auth_identity_id: login.data.mfa_challenge.auth_identity_id,
            auth_provider: "emailpass",
          })
        )
      })

      it("rejects an invalid TOTP code during challenge verification", async () => {
        await enrollTotpFactor(api)

        const login = await api.post("/auth/user/emailpass", {
          email: "admin@medusa.js",
          password: "somepassword",
        })

        const err = await api
          .post(
            `/auth/mfa/challenges/${login.data.mfa_challenge.id}/verify`,
            { method: "totp", code: "000000" },
            { headers: { authorization: `Bearer ${login.data.token}` } }
          )
          .catch((e) => e)

        expect(err.response.status).toEqual(400)
      })
    })
  },
})
