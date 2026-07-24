import type { MedusaContainer } from "@medusajs/types"
import { resolveActorRolesCached } from "./resolve-actor-roles"

/**
 * The minimal request shape needed to resolve and memoize an actor's roles:
 * the auth context (actor type/id), the container, and the memoization slot.
 */
export type RequestWithActorRoles = {
  auth_context?: { actor_type?: string; actor_id?: string }
  scope: MedusaContainer
  roles?: Promise<string[]>
}

/**
 * Resolves the authenticated actor's role ids for the current request, memoized
 * on the request object so multiple role consumers (permission middleware and
 * field filter) resolve once per request.
 *
 * // TODO: [rbac] think what would be needed to support API keys like scenarios
 * Reads `actor_type`/`actor_id` from the request's auth context; when either is
 * missing (e.g. secret API keys, which authenticate without an actor entity)
 * the actor is treated as holding no roles. The in-flight promise is stashed
 * immediately so concurrent callers share a single resolution.
 */
export function getRequestActorRoles(
  req: RequestWithActorRoles
): Promise<string[]> {
  if (req.roles) {
    return req.roles
  }

  const actorType = req.auth_context?.actor_type
  const actorId = req.auth_context?.actor_id

  const promise =
    actorType && actorId
      ? resolveActorRolesCached({ actorType, actorId, container: req.scope })
      : Promise.resolve([])

  req.roles = promise
  return promise
}
