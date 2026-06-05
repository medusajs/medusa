import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

const setup = await sdk.auth.mfa.start({
  provider: "totp",
  label: "Authenticator app"
})

// Render setup.otpauth_url as a QR code or show setup.secret manually.