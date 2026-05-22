import { ExclamationCircle } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Navigate, Outlet, useMatches } from "react-router-dom"
import { type Permission } from "../../../lib/permissions"
import {
  usePermissions,
  useRegisterPermissions,
} from "../../../providers/permissions-provider"

type PermissionRouteHandle = {
  permission?: Permission
}

const readPermissionFromHandle = (handle: unknown): Permission | undefined => {
  if (!handle || typeof handle !== "object") {
    return undefined
  }
  const candidate = (handle as PermissionRouteHandle).permission
  return typeof candidate === "string" ? (candidate as Permission) : undefined
}

interface RoutePermissionGuardProps {
  /**
   * Optional explicit permissions to check for this route.
   * If not provided, permissions are inferred from the route path.
   */
  permissions?: Permission[]
  /**
   * If true, requires ALL permissions. Default is ANY.
   */
  requireAll?: boolean
  /**
   * Path to redirect to when access is denied.
   * If not provided, shows an access denied page.
   */
  redirectTo?: string
}

/**
 * Route-level permission guard that protects entire routes.
 * Can be used as a route element to wrap protected routes.
 *
 * @example
 * ```tsx
 * // In route definition
 * {
 *   path: "/customers/create",
 *   element: <RoutePermissionGuard permissions={["customer:create"]} />,
 *   children: [
 *     { path: "", lazy: () => import("./customer-create") }
 *   ]
 * }
 *
 * // Or using automatic permission inference
 * {
 *   path: "/customers/create",
 *   element: <RoutePermissionGuard />,
 *   children: [...]
 * }
 * ```
 */
export const RoutePermissionGuard = ({
  permissions,
  requireAll = false, // TODO: should be true by default ?
  redirectTo,
}: RoutePermissionGuardProps) => {
  const matches = useMatches()
  const { hasAnyPermission, hasAllPermissions, hasPermission, isLoading } =
    usePermissions()

  // When no explicit `permissions` prop is passed, infer the requirement from
  // the closest route match that declares `handle.permission`. This lets a parent route declare a default
  // while children override.
  const inferredPermission = useMemo(() => {
    for (let i = matches.length - 1; i >= 0; i--) {
      const permission = readPermissionFromHandle(matches[i].handle)
      if (permission) {
        return permission
      }
    }
    return undefined
  }, [matches])

  const requiredPermissions = permissions?.length
    ? permissions
    : inferredPermission
    ? [inferredPermission]
    : null

  useRegisterPermissions(requiredPermissions, {
    requireAll: permissions?.length ? requireAll : false,
    source: "route",
  })

  // Don't block while loading - TODO: reconsider this
  if (isLoading) {
    return <Outlet />
  }

  let hasAccess = false

  if (permissions?.length) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
  } else if (inferredPermission) {
    hasAccess = hasPermission(inferredPermission)
  } else {
    hasAccess = true
  }

  if (!hasAccess) {
    // TODO: maybe just show button instead of immidate redirect
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />
    }

    // Show access denied page
    return <AccessDenied requiredPermission={inferredPermission} />
  }

  return <Outlet />
}

interface AccessDeniedProps {
  requiredPermission?: Permission
}

const AccessDenied = ({ requiredPermission }: AccessDeniedProps) => {
  const { t } = useTranslation()

  return (
    <div className="bg-ui-bg-subtle absolute bottom-0 left-0 right-0 top-0 flex min-h-screen items-center justify-center p-4">
      <Container className="max-w-md">
        <div className="flex flex-col items-center gap-y-4 py-8 text-center">
          <div className="bg-ui-bg-subtle flex h-12 w-12 items-center justify-center rounded-full">
            <ExclamationCircle className="text-ui-fg-muted" />
          </div>
          <div className="flex flex-col gap-y-1">
            <Heading level="h2">{t("permissions.accessDenied.title")}</Heading>
            <Text className="text-ui-fg-subtle">
              {t("permissions.accessDenied.description")}
            </Text>
          </div>
          {requiredPermission && (
            <Text size="small" className="text-ui-fg-muted">
              {t("permissions.accessDenied.requiredPermission", {
                permission: requiredPermission,
              })}
            </Text>
          )}
        </div>
      </Container>
    </div>
  )
}
