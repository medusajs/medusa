import { useContext } from "react"
import { PermissionsRequirementsContext } from "./permissions-requirements-context"

/**
 * Hook to access collected permission requirements for the current subtree.
 */
export const useRequiredPermissions = () => {
  const context = useContext(PermissionsRequirementsContext)

  return context?.requiredPermissions ?? []
}
