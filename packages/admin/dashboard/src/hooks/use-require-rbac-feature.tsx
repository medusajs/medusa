import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { RBAC_MODULE_KEY, useIsModuleInstalled } from "./api/modules"

/**
 * Guards a route/component on the RBAC module being installed. When it isn't,
 * the consumer is navigated back. Returns the boolean so callers can
 * short-circuit JSX (and reuse it in other gates like react-query's
 * `enabled` option) without redeclaring the check.
 *
 * @example
 * ```tsx
 * export const RoleList = () => {
 *   const isRbacEnabled = useRequireRbacFeature()
 *   if (!isRbacEnabled) return null
 *   return <RoleListTable />
 * }
 * ```
 */
export const useRequireRbacFeature = (): boolean => {
  const { isInstalled, isLoading } = useIsModuleInstalled(RBAC_MODULE_KEY)
  const navigate = useNavigate()

  useEffect(() => {
    // Don't navigate away while the installed modules are still loading.
    if (!isLoading && !isInstalled) {
      navigate(-1)
    }
  }, [isInstalled, isLoading, navigate])

  return isInstalled
}
