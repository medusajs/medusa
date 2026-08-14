import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

const token = await sdk.auth.callback("user", "okta", queryParams)
await sdk.auth.createUser("okta", { Authorization: `Bearer ${token}` })
await sdk.auth.refresh()