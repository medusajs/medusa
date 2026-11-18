import type { AuditRouteConfig } from "@medusajs/framework/http"

type AuditResourceFn = NonNullable<AuditRouteConfig["resource"]>

/**
 * The resource a request created, read from the `id` of the response body's
 * `key` property. The ID is `null` when the request failed.
 */
export function createdAuditResource(
  type: string,
  key: string = type
): AuditResourceFn {
  return (_req, body) => ({ type, id: body?.[key]?.id ?? null })
}

/**
 * A resource identified by a path parameter other than the first one, such as
 * a variant under `/admin/products/:id/variants/:variant_id`.
 */
export function paramAuditResource(
  type: string,
  param: string
): AuditResourceFn {
  return (req) => ({ type, id: req.params?.[param] ?? null })
}

/**
 * A request that acts on several resources of a type at once.
 */
export function batchAuditResource(type: string): AuditResourceFn {
  return () => ({ type, id: null })
}
