import { Spinner } from "@medusajs/icons"

/**
 * Rendered by the root route while react-router resolves loaders on the initial
 * page load.
 *
 * Required from react-router 7 onwards: partial hydration is the default there
 * (it was the opt-in `v7_partialHydration` flag in v6), and a data router with
 * loaders but no `HydrateFallback` warns on every initial load.
 *
 * Deliberately identical to `ProtectedRoute`'s loading state, so the two phases
 * of startup look like one continuous spinner rather than two.
 */
export const HydrateFallback = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="text-ui-fg-interactive animate-spin" />
    </div>
  )
}
