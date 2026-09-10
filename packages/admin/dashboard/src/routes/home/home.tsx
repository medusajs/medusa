import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"

import {
  DEFAULT_LANDING_ROUTES,
  NO_PERMISSIONS_ROUTE,
} from "../../lib/permissions"
import { usePermissions } from "../../providers/permissions-provider"

export const Home = () => {
  const navigate = useNavigate()
  const { hasPermission, isLoading } = usePermissions()

  const destination = useMemo(() => {
    const accessible = DEFAULT_LANDING_ROUTES.find((route) =>
      hasPermission(route.permission)
    )

    return accessible?.to ?? NO_PERMISSIONS_ROUTE
  }, [hasPermission])

  useEffect(() => {
    if (isLoading) {
      return
    }

    navigate(destination, { replace: true })
  }, [isLoading, destination, navigate])

  return <div />
}
