import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.views.retrieveActiveConfiguration("orders")
.then(({ view_configuration, active_view_configuration_id }) => {
  console.log(view_configuration)
})