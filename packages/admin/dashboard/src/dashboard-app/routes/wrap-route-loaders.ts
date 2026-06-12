import type { LoaderFunction, RouteObject } from "react-router-dom"

import {
  readRequirementFromHandle,
  type ResolvedRequirement,
} from "../../components/authentication/route-permission-guard"
import { featureFlagsQueryOptions } from "../../hooks/api/feature-flags"
import { mePermissionsQueryOptions } from "../../hooks/api/rbac-roles"
import { checkPermissions, PermissionError } from "../../lib/permissions"
import { queryClient } from "../../lib/query-client"

type MutableRoute = Omit<RouteObject, "children" | "loader" | "lazy"> & {
  children?: RouteObject[]
  loader?: RouteObject["loader"]
  lazy?: RouteObject["lazy"]
}

const enforcePermissions = async (requirement: ResolvedRequirement) => {
  const flags = await queryClient.ensureQueryData(featureFlagsQueryOptions)

  // When RBAC is disabled every check passes.
  if (!flags?.rbac) {
    return
  }

  const { permissions } = await queryClient.ensureQueryData(
    mePermissionsQueryOptions
  )

  const hasAccess = checkPermissions(
    permissions,
    requirement.permissions,
    requirement.requireAll
  )

  if (!hasAccess) {
    throw new PermissionError(requirement.permissions, requirement.requireAll)
  }
}

const withPermissionLoader = (
  requirement: ResolvedRequirement,
  loader: LoaderFunction
): LoaderFunction => {
  return async (args) => {
    await enforcePermissions(requirement)
    return loader(args)
  }
}

/**
 * Recursively wraps every route loader under a permission-guarded route so the
 * loader enforces the route's permission requirement before fetching. Mirrors
 * the deepest-wins resolution used by RoutePermissionGuard, ensuring a
 * forbidden request is never sent and the access-denied screen can name the
 * required permission.
 */
export const wrapRouteLoaders = (
  routes: RouteObject[],
  inherited?: ResolvedRequirement
): RouteObject[] => {
  return routes.map((route) => {
    const requirement = readRequirementFromHandle(route.handle) ?? inherited
    const next: MutableRoute = { ...route }

    if (requirement) {
      if (typeof next.loader === "function") {
        next.loader = withPermissionLoader(requirement, next.loader)
      }

      if (typeof next.lazy === "function") {
        const lazy = next.lazy
        next.lazy = async () => {
          const resolved = await lazy()
          const lazyRequirement =
            readRequirementFromHandle(resolved.handle) ?? requirement

          if (typeof resolved.loader === "function") {
            return {
              ...resolved,
              loader: withPermissionLoader(lazyRequirement, resolved.loader),
            }
          }

          return resolved
        }
      }
    }

    if (next.children) {
      next.children = wrapRouteLoaders(next.children, requirement)
    }

    return next as RouteObject
  })
}
