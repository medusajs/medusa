import { useContext, useEffect, useId } from "react"
import type { Permission } from "../../lib/permissions"
import { PermissionsRequirementsContext } from "./permissions-requirements-context"

interface UseRegisterPermissionsOptions {
  /**
   * If true, requires ALL permissions. Default is ANY.
   */
  requireAll?: boolean
  /**
   * Optional source label for debugging or display.
   */
  source?: string
  /**
   * Whether registration is enabled.
   */
  enabled?: boolean
}

const normalizePermissions = (permissions: Permission[]): Permission[] => {
  return Array.from(new Set(permissions)).sort()
}

export const useRegisterPermissions = (
  permissions: Permission[] | null | undefined,
  options: UseRegisterPermissionsOptions = {}
) => {
  const context = useContext(PermissionsRequirementsContext)
  const registerRequiredPermissions =
    context?.registerRequiredPermissions ?? (() => {})
  const unregisterRequiredPermissions =
    context?.unregisterRequiredPermissions ?? (() => {})
  const id = useId()

  const enabled = options.enabled ?? true
  const requireAll = options.requireAll ?? false

  const permissionsKey = permissions?.length
    ? normalizePermissions(permissions).join("|")
    : ""
  const key = `${permissionsKey}::${requireAll}::${options.source || ""}`

  useEffect(() => {
    if (!enabled || !permissionsKey) {
      return
    }

    registerRequiredPermissions(id, {
      permissions: permissionsKey.split("|") as Permission[],
      requireAll,
      source: options.source,
    })

    return () => {
      unregisterRequiredPermissions(id)
    }
  }, [
    enabled,
    id,
    key,
    permissionsKey,
    registerRequiredPermissions,
    requireAll,
    unregisterRequiredPermissions,
    options.source,
  ])
}
