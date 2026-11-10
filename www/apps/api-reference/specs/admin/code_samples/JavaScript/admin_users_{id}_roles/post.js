import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.user.addRoles("user_123", {
  assignments: [{ role_id: "role_123" }]
})
.then(({ roles }) => {
  console.log(roles)
})