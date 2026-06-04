import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

const result = await sdk.auth.login("user", "emailpass", {
  email: "user@example.com",
  password: "secret"
})

if (typeof result === "object" && "mfa_challenge" in result) {
  await sdk.auth.mfa.verifyChallenge(result.mfa_challenge.id, {
    method: "totp",
    code: "123456"
  })
}