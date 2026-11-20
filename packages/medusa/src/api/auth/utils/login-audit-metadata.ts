import type { AuditRouteConfig } from "@medusajs/framework/http"
import { decode } from "jsonwebtoken"

/**
 * Who a login authenticated, read from the token it issued. The request is
 * unauthenticated, so the record's actor is `anonymous`. The token was just
 * signed by the route, so it's decoded without being verified. `actor_id` is
 * `null` until the actor exists and any MFA or verification step is completed.
 */
export const loginAuditMetadata: NonNullable<AuditRouteConfig["metadata"]> = (
  _req,
  body
) => {
  if (typeof body?.token !== "string") {
    return
  }

  const claims = decode(body.token)
  if (!claims || typeof claims !== "object") {
    return
  }

  return {
    logged_in_actor_type: claims.actor_type ?? null,
    logged_in_actor_id: claims.actor_id || null,
    auth_identity_id: claims.auth_identity_id || null,
  }
}
