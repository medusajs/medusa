import { useMemo } from "react"
import type { PermissionResource } from "../lib/permissions"
import { usePermissions } from "../providers/permissions-provider"

/**
 * Hook that provides convenient permission checks for a specific resource.
 * Returns boolean flags for common CRUD operations.
 *
 * @param resource - The resource to check permissions for
 * @returns Object with permission flags and utility methods
 *
 * @example
 * ```tsx
 * const { canRead, canCreate, canUpdate, canDelete } = useResourcePermissions("customer")
 *
 * return (
 *   <div>
 *     {canRead && <CustomerList />}
 *     {canCreate && <Button>Create Customer</Button>}
 *   </div>
 * )
 * ```
 */
export const useResourcePermissions = (resource: PermissionResource) => {
  const { can, isLoading } = usePermissions()

  return useMemo(
    () => ({
      /**
       * Whether the user can view/list this resource.
       */
      canRead: can(resource, "read"),

      /**
       * Whether the user can create new instances of this resource.
       */
      canCreate: can(resource, "create"),

      /**
       * Whether the user can update existing instances of this resource.
       */
      canUpdate: can(resource, "update"),

      /**
       * Whether the user can delete instances of this resource.
       */
      canDelete: can(resource, "delete"),

      /**
       * Check a specific operation on this resource.
       */
      can: (operation: "read" | "create" | "update" | "delete") =>
        can(resource, operation),

      /**
       * The resource being checked.
       */
      resource,

      /**
       * Whether permissions are still loading.
       */
      isLoading,
    }),
    [can, resource, isLoading]
  )
}

/**
 * Hook for checking customer-specific permissions.
 */
export const useCustomerPermissions = () => useResourcePermissions("customer")

/**
 * Hook for checking order-specific permissions.
 */
export const useOrderPermissions = () => useResourcePermissions("order")

/**
 * Hook for checking product-specific permissions.
 */
export const useProductPermissions = () => useResourcePermissions("product")

/**
 * Hook for checking inventory-specific permissions.
 */
export const useInventoryPermissions = () => useResourcePermissions("inventory")

/**
 * Hook for checking user management permissions.
 */
export const useUserPermissions = () => useResourcePermissions("user")
