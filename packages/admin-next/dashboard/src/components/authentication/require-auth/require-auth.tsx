import { Spinner } from "@medusajs/icons"
import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAdminGetSession } from "medusa-react"
import { SearchProvider } from "../../../providers/search-provider"
import { SidebarProvider } from "../../../providers/sidebar-provider"

/**
 * @deprecated - Delete once all V1 domains have been migrated to V2.
 */
export const ProtectedRoute = () => {
  const { user, isLoading } = useAdminGetSession()
  const location = useLocation()

  if (isLoading) {
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
    <SidebarProvider>
      <SearchProvider>
        <Outlet />
      </SearchProvider>
    </SidebarProvider>
  )
}
