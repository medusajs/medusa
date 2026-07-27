import type { MedusaContainer } from "@medusajs/types"
import type { ResolvedRole } from "@medusajs/utils"
import { promiseAll } from "@medusajs/utils"
import { applicableRoles } from "./applicable-roles"
import { resolveActorRolesCached } from "./resolve-actor-roles"
import { getRequestScopes, RequestWithRbacScopes } from "./get-request-scopes"

/**
 * The minimal request shape needed to resolve and memoize an actor's roles:
 * the auth context (actor type/id), the container, and the memoization slots.
 */
export type RequestWithActorRoles = RequestWithRbacScopes & {
  auth_context?: { actor_type?: string; actor_id?: string }
  scope: MedusaContainer
  roles?: Promise<ResolvedRole[]>
}

/**
 * Resolves the roles applicable to the current request: the authenticated
 * actor's roles (cached) narrowed to the request's scope set, memoized on the
 * request object so multiple role consumers (permission middleware and field
 * filter) resolve once per request.
 *
 * Strict scope semantics: unscoped roles always apply; a scoped role applies
 * only when the request's scope set contains its scope; a request with no
 * scopes is authorized by unscoped roles only.
 *
 * Reads `actor_type`/`actor_id` from the request's auth context; when either is
 * missing the actor is treated as holding no roles. Role and scope resolution run
 * concurrently, and the in-flight promise is stashed synchronously so
 * concurrent callers share a single resolution.
 */
export function getRequestActorRoles(
  req: RequestWithActorRoles
): Promise<ResolvedRole[]> {
  if (req.roles) {
    return req.roles
  }

  const actorType = req.auth_context?.actor_type
  const actorId = req.auth_context?.actor_id

  const promise = promiseAll([
    actorType && actorId
      ? resolveActorRolesCached({ actorType, actorId, container: req.scope })
      : Promise.resolve([] as ResolvedRole[]),
    getRequestScopes(req),
  ]).then(([roles, scopes]) => applicableRoles(roles, scopes))

  req.roles = promise
  return promise
}

/**
 * Resolves the unique ids of the roles applicable to the current request.
 * Convenience wrapper around {@link getRequestActorRoles}, which has already
 * applied the request's scope set.
 */
export async function getRequestActorRoleIds(
  req: RequestWithActorRoles
): Promise<string[]> {
  const roles = await getRequestActorRoles(req)
  return Array.from(new Set(roles.map((role) => role.role_id)))
}
