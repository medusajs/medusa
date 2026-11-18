import { useEffect, useMemo } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

import { DEFAULT_LANDING_ROUTES } from "../../lib/permissions"
import { usePermissions } from "../../providers/permissions-provider"

const SETTINGS_LANDING_ROUTES = DEFAULT_LANDING_ROUTES.filter((route) =>
  route.to.startsWith("/settings/")
)

export const Settings = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { hasPermission, isLoading } = usePermissions()

  const destination = useMemo(() => {
    const accessible = SETTINGS_LANDING_ROUTES.find((route) =>
      hasPermission(route.permission)
    )

    return accessible?.to ?? "/settings/profile"
  }, [hasPermission])

  useEffect(() => {
    if (isLoading || location.pathname !== "/settings") {
      return
    }

    navigate(destination, { replace: true })
  }, [isLoading, location.pathname, destination, navigate])

  return <Outlet />
}
