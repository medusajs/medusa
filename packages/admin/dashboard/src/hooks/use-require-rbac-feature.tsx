import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { useFeatureFlag } from "../providers/feature-flag-provider"

/**
 * Guards a route/component on the `rbac` feature flag. When the flag is
 * disabled the consumer is navigated back. Returns the boolean so callers can
 * short-circuit JSX (and reuse it in other gates like react-query's
 * `enabled` option) without redeclaring the flag.
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
  const isRbacEnabled = useFeatureFlag("rbac")
  const navigate = useNavigate()

  useEffect(() => {
    if (!isRbacEnabled) {
      navigate(-1)
    }
  }, [isRbacEnabled, navigate])

  return isRbacEnabled
}
