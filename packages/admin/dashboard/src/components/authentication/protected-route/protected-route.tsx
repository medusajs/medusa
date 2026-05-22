import { Spinner } from "@medusajs/icons"
import { useMemo } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useMePermissions } from "../../../hooks/api/rbac-roles"
import { useMe } from "../../../hooks/api/users"
import type { Permission, UserPolicy } from "../../../lib/permissions"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { PermissionsProvider } from "../../../providers/permissions-provider"
import { SearchProvider } from "../../../providers/search-provider"
import { SidebarProvider } from "../../../providers/sidebar-provider"

export const ProtectedRoute = () => {
  const location = useLocation()
  const isRbacEnabled = useFeatureFlag("rbac")

  const { user, isLoading: isLoadingUser } = useMe()
  const { data: permissionsResponse, isLoading: isLoadingPermissions } =
    useMePermissions({
      // Don't fetch permissions until we know the user is authenticated.
      enabled: !!user && isRbacEnabled,
    })

  const policy: UserPolicy | null = useMemo(() => {
    if (!permissionsResponse) {
      return null
    }
    return {
      permissions: permissionsResponse.permissions as Permission[],
    }
  }, [permissionsResponse])

  if (isLoadingUser) {
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
