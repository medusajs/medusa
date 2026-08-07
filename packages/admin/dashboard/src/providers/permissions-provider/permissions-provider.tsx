import { PropsWithChildren, useCallback, useMemo } from "react"
import {
  buildPermission,
  buildPermissionLookup,
  type Permission,
  type PermissionOperation,
  type PermissionResource,
  type PermissionsContextValue,
  type ActorPolicy,
  ActorRole,
} from "../../lib/permissions"
import { PermissionsContext } from "./permissions-context"

interface PermissionsProviderProps extends PropsWithChildren {
  /**
   * The actor's policy containing their permissions.
   */
  policy: ActorPolicy | null
  /**
   * Whether the policy is currently being loaded.
   */
  isLoading?: boolean
  /**
   * Whether the RBAC feature flag is enabled. When `false`, every permission
   * check resolves to `true`.
   */
  isRbacEnabled?: boolean
}

export const PermissionsProvider = ({
  policy,
  isLoading = false,
  isRbacEnabled = true,
  children,
}: PermissionsProviderProps) => {
  const permissionsMap = useMemo(
    () => buildPermissionLookup(policy?.permissions ?? []),
    [policy]
  )

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!isRbacEnabled) {
        return true
      }
      return !!permissionsMap[permission]
    },
    [isRbacEnabled, permissionsMap]
  )

  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      if (!isRbacEnabled) {
        return true
      }
      if (!permissions?.length) {
        return false
      }

      return permissions.some(hasPermission)
    },
    [isRbacEnabled, hasPermission]
  )

  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      if (!isRbacEnabled) {
        return true
      }
      if (!permissions?.length) {
        return false
      }

      return permissions.every(hasPermission)
    },
    [isRbacEnabled, hasPermission]
  )

  const can = useCallback(
    (resource: PermissionResource, operation: PermissionOperation): boolean => {
      if (!isRbacEnabled) {
        return true
      }
      return !!permissionsMap[buildPermission(resource, operation)]
    },
    [isRbacEnabled, permissionsMap]
  )

  const roles: ActorRole[] = useMemo(() => policy?.roles ?? [], [policy])

  const roleNames = useMemo(
    () => new Set(roles.map((role) => role.name)),
    [roles]
  )

  const hasRole = useCallback(
    (role: string): boolean => {
      if (!isRbacEnabled) {
        return true
      }
      return roleNames.has(role)
    },
    [isRbacEnabled, roleNames]
  )

  const hasAnyRole = useCallback(
    (requiredRoles: string[]): boolean => {
      if (!isRbacEnabled) {
        return true
      }
      if (!requiredRoles?.length) {
        return false
      }

      return requiredRoles.some(hasRole)
    },
    [isRbacEnabled, hasRole]
  )

  const hasAllRoles = useCallback(
    (requiredRoles: string[]): boolean => {
      if (!isRbacEnabled) {
        return true
      }
      if (!requiredRoles?.length) {
        return false
      }

      return requiredRoles.every(hasRole)
    },
    [isRbacEnabled, hasRole]
  )

  const value: PermissionsContextValue = useMemo(
    () => ({
      policy,
      isLoading,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      can,
      roles,
      hasRole,
      hasAnyRole,
      hasAllRoles,
    }),
    [
      policy,
      isLoading,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      can,
      roles,
      hasRole,
      hasAnyRole,
      hasAllRoles,
    ]
  )

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  )
}
