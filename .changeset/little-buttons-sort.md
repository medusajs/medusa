---
"@medusajs/ui": major
---

feat(ui): Re-work `<Toaster />` and `<Toast />` based on `sonner`.

This update contains breaking changes to how toasts work in `@medusajs/ui`. This update has been made to provide a better user experience and to make it easier to use toasts in your Medusa application.

### BREAKING CHANGES

The `useToast` hook has been removed. Users should instead use the `toast` function that is exported from the `@medusajs/ui` package. This function can be used to show toasts in your application. For more information on how to use the `toast` function, please refer to the documentation.

The `Toaster` component is still available but the options for the component have changed. The default position has been changed to `bottom-right`. For more information on the `Toaster` component, please refer to the documentation.
