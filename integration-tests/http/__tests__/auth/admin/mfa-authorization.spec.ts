import { generateResetPasswordTokenWorkflow } from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import jwt from "jsonwebtoken"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { generateTotpCode } from "../../../../../packages/modules/auth/src/utils/totp"

// A TOTP code is accepted once, so enrollment uses the previous time step's
// code (still inside the default window) and leaves the current one for the
// MFA challenge that follows.
const enrollmentCode = (secret: string) =>
  generateTotpCode({ secret, timestamp: Date.now() - 30_000 })

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
    { code: enrollmentCode(setup.data.secret) },
    adminHeaders
  )

  expect(verified.data.mfa_factor.status).toEqual("enabled")

  return {
    secret: setup.data.secret as string,
    factorId: setup.data.mfa_factor.id as string,
    recoveryCodes: verified.data.recovery_codes as string[],
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
          { code: enrollmentCode(setup.data.secret) },
          headers
        )
        expect(verified.data.mfa_factor.status).toEqual("enabled")

        // Enabling the factor returns the first set of recovery codes.
        expect(verified.data.recovery_codes).toHaveLength(10)
      })
    })

    describe("A token issued before MFA was enabled", () => {
      const loginBeforeMfa = async () => {
        const login = await api.post("/auth/user/emailpass", {
          email: EMAIL,
          password: PASSWORD,
        })

        expect(login.data.mfa_required).toBeUndefined()

        return {
          headers: { authorization: `Bearer ${login.data.token}` },
        }
      }

      it("refreshes into a token that requires the MFA challenge", async () => {
        const before = await loginBeforeMfa()
        await enrollTotpFactor(api)

        const refreshed = await api.post("/auth/token/refresh", {}, before)
        const decoded = jwt.decode(refreshed.data.token) as Record<
          string,
          unknown
        >

        expect(decoded.mfa_enabled).toBe(true)
        expect(decoded.mfa_challenge_completed_at).toBeNull()

        const err = await api
          .get("/admin/users/me", {
            headers: { authorization: `Bearer ${refreshed.data.token}` },
          })
          .catch((e) => e)

        expect(err.response.status).toEqual(401)
      })

      it("creates a session that requires the MFA challenge", async () => {
        const before = await loginBeforeMfa()
        await enrollTotpFactor(api)

        const session = await api.post("/auth/session", {}, before)
        expect(session.data.user.mfa_enabled).toBe(true)

        const [cookie] = session.headers["set-cookie"][0].split(";")

        const err = await api
          .get("/admin/users/me", { headers: { Cookie: cookie } })
          .catch((e) => e)

        expect(err.response.status).toEqual(401)
      })
    })

    describe("Replacing recovery codes", () => {
      it("requires a current MFA code", async () => {
        const { secret, recoveryCodes } = await enrollTotpFactor(api)
        const session = await completeMfa(api, secret)

        const missingCode = await api
          .post("/auth/mfa/recovery-codes", { count: 10 }, session.headers)
          .catch((e) => e)

        expect(missingCode.response.status).toEqual(400)

        const wrongCode = await api
          .post(
            "/auth/mfa/recovery-codes",
            { method: "recovery_code", code: "not-a-recovery-code" },
            session.headers
          )
          .catch((e) => e)

        expect(wrongCode.response.status).toEqual(400)
        expect(wrongCode.response.data.message).toEqual(
          "Invalid MFA verification code"
        )

        const codes = await api.post(
          "/auth/mfa/recovery-codes",
          { method: "recovery_code", code: recoveryCodes[0] },
          session.headers
        )

        expect(codes.data.recovery_codes).toHaveLength(10)
      })
    })

    describe("MFA routes with an incomplete MFA challenge", () => {
      it("does not generate recovery codes", async () => {
        await enrollTotpFactor(api)

        const pending = await loginWithoutCompletingMfa(api)

        const err = await api
          .post(
            "/auth/mfa/recovery-codes",
            { method: "totp", code: "000000" },
            pending.headers
          )
          .catch((e) => e)

        expect(err.response.status).toEqual(401)
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
            { method: "totp", code: "000000" },
            { headers: { authorization: `Bearer ${refreshed.data.token}` } }
          )
          .catch((e) => e)

        expect(err.response.status).toEqual(401)
      })

      it("does not complete the challenge after the password was reset", async () => {
        const { secret } = await enrollTotpFactor(api)

        const pending = await loginWithoutCompletingMfa(api)

        // JWT issue dates have a one second resolution
        await new Promise((resolve) => setTimeout(resolve, 1100))

        const { result: resetToken } = await generateResetPasswordTokenWorkflow(
          getContainer()
        ).run({
          input: {
            entityId: EMAIL,
            actorType: "user",
            provider: "emailpass",
            secret: "test",
          },
        })

        await api.post(
          "/auth/user/emailpass/update",
          { password: "new_password" },
          { headers: { authorization: `Bearer ${resetToken}` } }
        )

        const err = await api
          .post(
            `/auth/mfa/challenges/${pending.challenge.id}/verify`,
            { method: "totp", code: generateTotpCode({ secret }) },
            pending.headers
          )
          .catch((e) => e)

        expect(err.response.status).toEqual(401)
        expect(err.response.data.token).toBeUndefined()

        const login = await api.post("/auth/user/emailpass", {
          email: EMAIL,
          password: "new_password",
        })

        const verified = await api.post(
          `/auth/mfa/challenges/${login.data.mfa_challenge.id}/verify`,
          { method: "totp", code: generateTotpCode({ secret }) },
          { headers: { authorization: `Bearer ${login.data.token}` } }
        )

        expect(verified.status).toEqual(200)
        expect(verified.data).toEqual({ token: expect.any(String) })
      })
    })

    describe("Reusing a TOTP code", () => {
      it("does not complete a second challenge with a code that was already accepted", async () => {
        const { secret } = await enrollTotpFactor(api)
        const code = generateTotpCode({ secret })

        const first = await loginWithoutCompletingMfa(api)
        await api.post(
          `/auth/mfa/challenges/${first.challenge.id}/verify`,
          { method: "totp", code },
          first.headers
        )

        const second = await loginWithoutCompletingMfa(api)
        const err = await api
          .post(
            `/auth/mfa/challenges/${second.challenge.id}/verify`,
            { method: "totp", code },
            second.headers
          )
          .catch((e) => e)

        expect(err.response.status).toEqual(400)
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

      it("does not verify a challenge with the token of another login", async () => {
        const { secret } = await enrollTotpFactor(api)

        const first = await loginWithoutCompletingMfa(api)
        const second = await loginWithoutCompletingMfa(api)
        const code = generateTotpCode({ secret })

        const err = await api
          .post(
            `/auth/mfa/challenges/${first.challenge.id}/verify`,
            { method: "totp", code },
            second.headers
          )
          .catch((e) => e)

        expect(err.response.status).toEqual(404)

        const verified = await api.post(
          `/auth/mfa/challenges/${first.challenge.id}/verify`,
          { method: "totp", code },
          first.headers
        )

        expect(verified.status).toEqual(200)
        expect(
          (jwt.decode(verified.data.token) as Record<string, unknown>)
            .mfa_challenge_id
        ).toBeUndefined()
      })
    })

    describe("MFA routes with a completed MFA challenge", () => {
      it("lists factors, generates recovery codes and disables a factor", async () => {
        const { secret, factorId, recoveryCodes } = await enrollTotpFactor(api)

        const session = await completeMfa(api, secret)

        const factors = await api.get("/auth/mfa/factors", session.headers)
        expect(factors.status).toEqual(200)
        expect(factors.data.mfa_factors).toEqual([
          expect.objectContaining({ id: factorId, status: "enabled" }),
        ])

        const codes = await api.post(
          "/auth/mfa/recovery-codes",
          { method: "recovery_code", code: recoveryCodes[0], count: 10 },
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
        const { secret, recoveryCodes } = await enrollTotpFactor(api)

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
          { method: "recovery_code", code: recoveryCodes[0] },
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

        const verified = await api.post(
          `/auth/mfa/factors/${setup.data.mfa_factor.id}/verify`,
          { code: enrollmentCode(setup.data.secret) },
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
          {
            method: "recovery_code",
            code: verified.data.recovery_codes[0],
            count: 10,
          },
          { headers: { authorization: `Bearer ${completed.data.token}` } }
        )

        expect(codes.status).toEqual(200)
        expect(codes.data.recovery_codes).toHaveLength(10)
      })
    })
  },
})
