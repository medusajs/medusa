import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.module.list()
.then(({ modules }) => {
  const isRbacInstalled = modules.some((module) => module.key === "rbac")
})