import { useContext } from "react"
import { PermissionsContext } from "./permissions-context"

/**
 * Hook to access permission checking utilities.
 *
 * @returns PermissionsContextValue with permission checking methods
 * @throws Error if used outside of PermissionsProvider
 *
 * @example
 * ```tsx
 * const { can, hasPermission } = usePermissions()
 *
 * // Check using resource and operation
 * if (can("customer", "create")) {
 *   // Show create button
 * }
 *
 * // Check using permission string
 * if (hasPermission("customer:read")) {
 *   // Show customer list
 * }
 * ```
 */
export const usePermissions = () => {
  const context = useContext(PermissionsContext)

  if (!context) {
    throw new Error(
      "usePermissions must be used within a PermissionsProvider"
    )
  }

  return context
}
