import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import jwt from "jsonwebtoken"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { generateTotpCode } from "../../../../../packages/modules/auth/src/utils/totp"

jest.setTimeout(100000)

const EMAIL = "admin@medusa.js"
const PASSWORD = "somepassword"
const OTHER_EMAIL = "other-admin@medusa.js"

const otherAdminHeaders = { headers: {} } as {
  headers: Record<string, string>
}

const enrollTotpFactor = async (api) => {
  const setup = await api.post(
    "/auth/mfa/factors",
    { provider: "totp", label: "Authenticator app" },
    adminHeaders
  )

  const verified = await api.post(
    `/auth/mfa/factors/${setup.data.mfa_factor.id}/verify`,
    { code: generateTotpCode({ secret: setup.data.secret }) },
    adminHeaders
  )

  expect(verified.data.mfa_factor.status).toEqual("enabled")

  return {
    secret: setup.data.secret as string,
    factorId: setup.data.mfa_factor.id as string,
  }
}

// Logging in with an enabled factor returns an actorless token that is only good
// for completing the MFA challenge.
const loginWithoutCompletingMfa = async (api) => {
  const login = await api.post("/auth/user/emailpass", {
    email: EMAIL,
    password: PASSWORD,
  })

  expect(login.data.mfa_required).toBe(true)

  const decoded = jwt.decode(login.data.token) as Record<string, unknown>
  expect(decoded.actor_id).toEqual("")

  return {
    challenge: login.data.mfa_challenge,
    headers: { headers: { authorization: `Bearer ${login.data.token}` } },
  }
}

const completeMfa = async (api, secret: string) => {
  const pending = await loginWithoutCompletingMfa(api)

  const completed = await api.post(
    `/auth/mfa/challenges/${pending.challenge.id}/verify`,
    { method: "totp", code: generateTotpCode({ secret }) },
    pending.headers
  )

  return {
    headers: { headers: { authorization: `Bearer ${completed.data.token}` } },
  }
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    beforeAll(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      await createAdminUser(dbConnection, otherAdminHeaders, getContainer(), {
        email: OTHER_EMAIL,
      })

      await dbUtils.snapshot()
    })

    describe("MFA routes with an incomplete MFA challenge", () => {
      it("does not generate recovery codes", async () => {
        await enrollTotpFactor(api)

        const pending = await loginWithoutCompletingMfa(api)

        const err = await api
          .post("/auth/mfa/recovery-codes", { count: 10 }, pending.headers)
          .catch((e) => e)

        expect(err.response.status).toEqual(401)

        // No codes exist, so `recovery_code` is not offered on a new challenge.
        const nextLogin = await loginWithoutCompletingMfa(api)
        expect(nextLogin.challenge.methods).toEqual(["totp"])
      })

      it("does not list factors", async () => {
        await enrollTotpFactor(api)

        const pending = await loginWithoutCompletingMfa(api)

        const err = await api
          .get("/auth/mfa/factors", pending.headers)
          .catch((e) => e)

        expect(err.response.status).toEqual(401)
      })

      it("does not enroll an additional factor", async () => {
        await enrollTotpFactor(api)

        const pending = await loginWithoutCompletingMfa(api)

        const err = await api
          .post(
            "/auth/mfa/factors",
            { provider: "totp", label: "Another authenticator" },
            pending.headers
          )
          .catch((e) => e)

        expect(err.response.status).toEqual(401)
      })

      it("does not disable an enabled factor", async () => {
        const { factorId } = await enrollTotpFactor(api)

        const pending = await loginWithoutCompletingMfa(api)

        const err = await api
          .delete(`/auth/mfa/factors/${factorId}`, {
            ...pending.headers,
            data: {},
          })
          .catch((e) => e)

        expect(err.response.status).toEqual(401)

        // The factor is untouched, so MFA is still required on the next login.
        const login = await api.post("/auth/user/emailpass", {
          email: EMAIL,
          password: PASSWORD,
        })

        expect(login.data.mfa_required).toBe(true)
      })
    })

    describe("MFA challenge ownership", () => {
      it("does not verify a challenge belonging to another auth identity", async () => {
        const { secret } = await enrollTotpFactor(api)

        const pending = await loginWithoutCompletingMfa(api)
        const code = generateTotpCode({ secret })

        const err = await api
          .post(
            `/auth/mfa/challenges/${pending.challenge.id}/verify`,
            { method: "totp", code },
            otherAdminHeaders
          )
          .catch((e) => e)

        expect(err.response.status).toEqual(404)

        // The rejected attempt did not consume or complete the challenge.
        const verified = await api.post(
          `/auth/mfa/challenges/${pending.challenge.id}/verify`,
          { method: "totp", code },
          pending.headers
        )

        expect(verified.status).toEqual(200)
      })
    })

    describe("MFA routes with a completed MFA challenge", () => {
      it("lists factors, generates recovery codes and disables a factor", async () => {
        const { secret, factorId } = await enrollTotpFactor(api)

        const session = await completeMfa(api, secret)

        const factors = await api.get("/auth/mfa/factors", session.headers)
        expect(factors.status).toEqual(200)
        expect(factors.data.mfa_factors).toEqual([
          expect.objectContaining({ id: factorId, status: "enabled" }),
        ])

        const codes = await api.post(
          "/auth/mfa/recovery-codes",
          { count: 10 },
          session.headers
        )
        expect(codes.status).toEqual(200)
        expect(codes.data.recovery_codes).toHaveLength(10)

        const disabled = await api.delete(`/auth/mfa/factors/${factorId}`, {
          ...session.headers,
          data: {},
        })
        expect(disabled.data.mfa_factor.status).toEqual("disabled")
      })
    })
  },
})
