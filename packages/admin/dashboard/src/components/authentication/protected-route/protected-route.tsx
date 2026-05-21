import { Spinner } from "@medusajs/icons"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useMe } from "../../../hooks/api/users"
import { buildPermissionsResponse } from "../../../lib/permissions"
import { PermissionsProvider } from "../../../providers/permissions-provider"
import { SearchProvider } from "../../../providers/search-provider"
import { SidebarProvider } from "../../../providers/sidebar-provider"
import { HttpTypes } from "@medusajs/types"

export const ProtectedRoute = () => {
  const location = useLocation()

  const { user, isLoading: isLoadingUser } = useMe({
    fields: "rbac_roles.*,rbac_roles.policies.*",
  })

  const policy = user
    ? buildPermissionsResponse(
        user as HttpTypes.AdminUser & { rbac_roles: HttpTypes.AdminRbacRole[] }
      ).policy
    : null

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
    <PermissionsProvider policy={policy} isLoading={isLoadingUser}>
      <SidebarProvider>
        <SearchProvider>
          <Outlet />
        </SearchProvider>
      </SidebarProvider>
    </PermissionsProvider>
  )
}
