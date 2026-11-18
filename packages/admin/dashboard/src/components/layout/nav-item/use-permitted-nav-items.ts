import { useMemo } from "react"
import type { Permission } from "../../../lib/permissions"
import { usePermissions } from "../../../providers/permissions-provider"
import type { INavItem } from "./nav-item"

/**
 * Drops the nav items, and their nested items, whose `permissions` the user
 * doesn't all hold. Items that declare no permissions are always kept.
 */
export const filterPermittedNavItems = (
  items: INavItem[],
  hasAllPermissions: (permissions: Permission[]) => boolean
): INavItem[] => {
  const isPermitted = (item: { permissions?: Permission[] }) =>
    !item.permissions?.length || hasAllPermissions(item.permissions)

  return items.filter(isPermitted).map((item) => ({
    ...item,
    items: item.items?.filter(isPermitted),
  }))
}

export const usePermittedNavItems = (items: INavItem[]): INavItem[] => {
  const { hasAllPermissions } = usePermissions()

  return useMemo(
    () => filterPermittedNavItems(items, hasAllPermissions),
    [items, hasAllPermissions]
  )
}
