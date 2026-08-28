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

    describe("An identity without MFA enabled", () => {
      it("authenticates and manages factors without completing a challenge", async () => {
        const login = await api.post("/auth/user/emailpass", {
          email: EMAIL,
          password: PASSWORD,
        })

        expect(login.data.mfa_required).toBeUndefined()

        const decoded = jwt.decode(login.data.token) as Record<string, unknown>
        expect(decoded.mfa_enabled).toBe(false)
        expect(decoded.mfa_challenge_completed_at).toBeNull()

        const headers = {
          headers: { authorization: `Bearer ${login.data.token}` },
        }

        const me = await api.get("/admin/users/me", headers)
        expect(me.status).toEqual(200)

        const factors = await api.get("/auth/mfa/factors", headers)
        expect(factors.status).toEqual(200)
        expect(factors.data.mfa_factors).toEqual([])

        // Enrolling the first factor has no challenge to complete first.
        const setup = await api.post(
          "/auth/mfa/factors",
          { provider: "totp", label: "Authenticator app" },
          headers
        )
        expect(setup.status).toEqual(200)

        const verified = await api.post(
          `/auth/mfa/factors/${setup.data.mfa_factor.id}/verify`,
          { code: generateTotpCode({ secret: setup.data.secret }) },
          headers
        )
        expect(verified.data.mfa_factor.status).toEqual("enabled")

        // The session that enabled MFA can still read its recovery codes.
        const codes = await api.post(
          "/auth/mfa/recovery-codes",
          { count: 10 },
          headers
        )
        expect(codes.status).toEqual(200)
        expect(codes.data.recovery_codes).toHaveLength(10)
      })
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

    describe("The token issued before an MFA challenge is completed", () => {
      it("still refreshes into a token that requires the challenge", async () => {
        await enrollTotpFactor(api)

        const pending = await loginWithoutCompletingMfa(api)

        const refreshed = await api.post(
          "/auth/token/refresh",
          {},
          pending.headers
        )

        expect(refreshed.status).toEqual(200)
        expect(refreshed.data.mfa_required).toBe(true)
        expect(
          (jwt.decode(refreshed.data.token) as Record<string, unknown>)
            .mfa_challenge_completed_at
        ).toBeNull()

        const err = await api
          .post(
            "/auth/mfa/recovery-codes",
            { count: 10 },
            { headers: { authorization: `Bearer ${refreshed.data.token}` } }
          )
          .catch((e) => e)

        expect(err.response.status).toEqual(401)
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

      it("records when the challenge was completed and preserves it on refresh", async () => {
        const { secret } = await enrollTotpFactor(api)

        const session = await completeMfa(api, secret)

        const completedAt = (
          jwt.decode(
            session.headers.headers.authorization.replace("Bearer ", "")
          ) as Record<string, unknown>
        ).mfa_challenge_completed_at

        expect(completedAt).toEqual(expect.any(String))

        const refreshed = await api.post(
          "/auth/token/refresh",
          {},
          session.headers
        )

        expect(
          (jwt.decode(refreshed.data.token) as Record<string, unknown>)
            .mfa_challenge_completed_at
        ).toEqual(completedAt)

        const codes = await api.post(
          "/auth/mfa/recovery-codes",
          { count: 10 },
          { headers: { authorization: `Bearer ${refreshed.data.token}` } }
        )

        expect(codes.status).toEqual(200)
      })

      it("generates recovery codes for an identity that has no actor yet", async () => {
        const email = "no-actor@medusa.js"
        const password = "somepassword"

        // Registering yields a token for an auth identity with no actor behind
        // it, which is enough to enroll the first factor.
        const registered = await api.post("/auth/user/emailpass/register", {
          email,
          password,
        })

        const registrationHeaders = {
          headers: { authorization: `Bearer ${registered.data.token}` },
        }

        expect(
          (jwt.decode(registered.data.token) as Record<string, unknown>)
            .actor_id
        ).toEqual("")

        const setup = await api.post(
          "/auth/mfa/factors",
          { provider: "totp", label: "Authenticator app" },
          registrationHeaders
        )

        await api.post(
          `/auth/mfa/factors/${setup.data.mfa_factor.id}/verify`,
          { code: generateTotpCode({ secret: setup.data.secret }) },
          registrationHeaders
        )

        const login = await api.post("/auth/user/emailpass", {
          email,
          password,
        })

        const completed = await api.post(
          `/auth/mfa/challenges/${login.data.mfa_challenge.id}/verify`,
          {
            method: "totp",
            code: generateTotpCode({ secret: setup.data.secret }),
          },
          { headers: { authorization: `Bearer ${login.data.token}` } }
        )

        // Still no actor, but the MFA challenge is completed.
        expect(
          (jwt.decode(completed.data.token) as Record<string, unknown>).actor_id
        ).toEqual("")

        const codes = await api.post(
          "/auth/mfa/recovery-codes",
          { count: 10 },
          { headers: { authorization: `Bearer ${completed.data.token}` } }
        )

        expect(codes.status).toEqual(200)
        expect(codes.data.recovery_codes).toHaveLength(10)
      })
    })
  },
})
