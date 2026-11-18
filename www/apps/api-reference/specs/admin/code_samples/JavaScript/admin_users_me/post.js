import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.user.updateMe({
  first_name: "John",
  last_name: "Doe",
})
.then(({ user }) => {
  console.log(user)
})