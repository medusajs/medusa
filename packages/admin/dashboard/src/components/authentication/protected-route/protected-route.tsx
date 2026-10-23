import { Spinner } from "@medusajs/icons"
import { useMemo } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { RBAC_MODULE_KEY, useIsModuleInstalled } from "../../../hooks/api/modules"
import { useMePermissions } from "../../../hooks/api/rbac-roles"
import { useMe } from "../../../hooks/api/users"
import type { Permission, ActorPolicy } from "../../../lib/permissions"
import { PermissionsProvider } from "../../../providers/permissions-provider"
import { SearchProvider } from "../../../providers/search-provider"
import { SidebarProvider } from "../../../providers/sidebar-provider"

export const ProtectedRoute = () => {
  const location = useLocation()
  const { isInstalled: isRbacEnabled, isLoading: isLoadingModules } =
    useIsModuleInstalled(RBAC_MODULE_KEY)

  const { user, isLoading: isLoadingUser } = useMe()
  const { data: permissionsResponse, isLoading: isLoadingPermissions } =
    useMePermissions({
      // Don't fetch permissions until we know the user is authenticated.
      enabled: !!user && isRbacEnabled,
    })

  const policy: ActorPolicy | null = useMemo(() => {
    if (!permissionsResponse) {
      return null
    }
    return {
      permissions: permissionsResponse.permissions as Permission[],
      roles: permissionsResponse.roles,
      covered_roles: permissionsResponse.covered_roles,
    }
  }, [permissionsResponse])

  // Wait for the RBAC check so permission gates never render ungated.
  if (isLoadingUser || isLoadingModules) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-ui-fg-interactive animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <PermissionsProvider
      policy={policy}
      isLoading={isLoadingPermissions}
      isRbacEnabled={isRbacEnabled}
    >
      <SidebarProvider>
        <SearchProvider>
          <Outlet />
        </SearchProvider>
      </SidebarProvider>
    </PermissionsProvider>
  )
}
