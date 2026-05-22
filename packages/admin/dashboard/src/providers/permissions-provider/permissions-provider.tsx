import { PropsWithChildren, useCallback, useMemo } from "react"
import {
  buildPermission,
  OPERATION_IMPLICATIONS,
  parsePermission,
  type Permission,
  type PermissionOperation,
  type PermissionResource,
  type PermissionsContextValue,
  type UserPolicy,
} from "../../lib/permissions"
import { PermissionsContext } from "./permissions-context"

interface PermissionsProviderProps extends PropsWithChildren {
  /**
   * The user's policy containing their permissions.
   */
  policy: UserPolicy | null
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
  const permissionsMap = useMemo(() => {
    const index: Record<Permission, true> = Object.create(null)

    for (const granted of policy?.permissions ?? []) {
      const parsed = parsePermission(granted)
      if (!parsed) {
        continue
      }

      const { resource, operation } = parsed
      const impliedOperations = OPERATION_IMPLICATIONS[operation] || [operation]

      for (const impliedOperation of impliedOperations) {
        index[buildPermission(resource, impliedOperation)] = true
      }
    }

    return index
  }, [policy])

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

  const value: PermissionsContextValue = useMemo(
    () => ({
      policy,
      isLoading,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      can,
    }),
    [policy, isLoading, hasPermission, hasAnyPermission, hasAllPermissions, can]
  )

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  )
}
