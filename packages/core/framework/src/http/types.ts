import type {
  ZodNullable,
  ZodObject,
  ZodOptional,
  ZodRawShape,
} from "@medusajs/deps/zod"

import type {
  AuthContext,
  MedusaNextFunction,
  MedusaRequest,
  MedusaRequestHandler,
  MedusaResponse,
} from "@medusajs/types"

/**
 * The HTTP request/response types were moved to`@medusajs/types`.
 * They are re-exported here to keep `@medusajs/framework/http` import paths
 * working.
 */
export type {
  AuthContext,
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaRequest,
  MedusaRequestHandler,
  MedusaResponse,
  MedusaStoreRequest,
  PublishableKeyContext,
  RestrictedFieldsSet,
  SecretKeyContext,
} from "@medusajs/types"

/**
 * List of all the supported HTTP methods
 */
export const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
] as const

export type RouteVerb = (typeof HTTP_METHODS)[number]
export type MiddlewareVerb = "USE" | "ALL" | RouteVerb

type SyncRouteHandler = (req: MedusaRequest, res: MedusaResponse) => void

export type AsyncRouteHandler = (
  req: MedusaRequest,
  res: MedusaResponse
) => Promise<void>

export type RouteHandler = SyncRouteHandler | AsyncRouteHandler

export type MiddlewareFunction =
  MedusaRequestHandler | ((...args: any[]) => any)

export type MedusaErrorHandlerFunction = (
  error: any,
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => Promise<void> | void

export type ParserConfigArgs = {
  sizeLimit?: string | number | undefined
  preserveRawBody?: boolean
}

export type ParserConfig = false | ParserConfigArgs

/**
 * The request passed to the functions of an {@link AuditRouteConfig}. The
 * request may have been rejected before authentication, so `auth_context` can
 * be missing.
 */
export type AuditRequest = MedusaRequest<any> & {
  auth_context?: AuthContext
}

/**
 * The resource an audited request acted on.
 */
export type AuditResource = {
  /**
   * The resource type, such as `order`.
   */
  type: string
  /**
   * The resource ID. Omit it, or pass `null`, when the request acts on several
   * resources.
   */
  id?: string | null
}

/**
 * How a route is recorded in the audit logs. Every function runs after the
 * response is sent, and an error thrown by one is logged and ignored.
 */
export type AuditRouteConfig<TResponseBody = any> = {
  /**
   * The action name.
   *
   * @defaultValue The resource followed by the route segments after it, such
   * as `order.cancel` for `POST /admin/orders/:id/cancel`, or by `create`,
   * `update`, or `delete` when there are none, such as `product.create`.
   */
  action?: string
  /**
   * Returns the resource acted on. `body` is the JSON response body, passed
   * only for a successful response. Return `undefined` to fall back to the
   * default: the last path parameter as the ID and the segment before it, in
   * singular snake case, as the type. A route without path parameters uses its
   * second segment as the type and the ID of the resource in the response.
   */
  resource?: (
    req: AuditRequest,
    body: TResponseBody | undefined
  ) => AuditResource | undefined
  /**
   * Returns the request fields to keep. Request bodies are never stored, so pick
   * only the fields worth keeping.
   */
  requestData?: (req: AuditRequest) => Record<string, unknown> | undefined
  /**
   * Returns the response fields to keep. `body` is the JSON response body,
   * passed only for a successful response.
   */
  responseData?: (
    req: AuditRequest,
    body: TResponseBody | undefined
  ) => Record<string, unknown> | undefined
}

/**
 * Whether and how a route is recorded in the audit logs: `false` never records
 * it, `true` records it with the defaults, and an object records it with the
 * defaults it doesn't override.
 */
export type AuditRouteSetting = boolean | AuditRouteConfig

export type MiddlewareRoute = {
  /**
   * @deprecated. Instead use {@link MiddlewareRoute.methods}
   */
  method?: MiddlewareVerb | MiddlewareVerb[]
  methods?: MiddlewareVerb[]
  matcher: string | RegExp
  bodyParser?: ParserConfig
  additionalDataValidator?: ZodRawShape
  /**
   * Whether and how matching requests are recorded in the audit logs, when the
   * Audit Module is installed. By default, `POST`, `PUT`, `PATCH`, and `DELETE`
   * requests under `/admin`, `/rbac`, and `/auth` are recorded.
   */
  audit?: AuditRouteSetting
  middlewares?: MiddlewareFunction[]
}

export type MiddlewaresConfig = {
  errorHandler?: false | MedusaErrorHandlerFunction
  routes?: MiddlewareRoute[]
}

/**
 * Route descriptor refers represents a route either scanned
 * from the filesystem or registered manually. It does not
 * represent a middleware
 */
export type RouteDescriptor = {
  matcher: string
  method: RouteVerb
  handler: RouteHandler
  optedOutOfAuth: boolean
  isRoute: true
  routeType?: "admin" | "store" | "auth" | "rbac"
  absolutePath?: string
  relativePath?: string
  shouldAppendAdminCors: boolean
  shouldAppendStoreCors: boolean
  shouldAppendAuthCors: boolean
  shouldAppendRbacCors: boolean
}

/**
 * Represents a middleware
 */
export type MiddlewareDescriptor = {
  matcher: string | RegExp
  methods?: MiddlewareVerb | MiddlewareVerb[]
  handler: MiddlewareFunction
}

export type BodyParserConfigRoute = {
  matcher: string | RegExp
  methods: MiddlewareVerb | MiddlewareVerb[]
  config: ParserConfig
}

export type AdditionalDataValidatorRoute = {
  matcher: string | RegExp
  methods: MiddlewareVerb | MiddlewareVerb[]
  schema: ZodRawShape
  validator: ZodOptional<ZodNullable<ZodObject<any, any>>>
}

export type AuditConfigRoute = {
  matcher: string | RegExp
  methods: MiddlewareVerb[]
  config: AuditRouteSetting
}

export type GlobalMiddlewareDescriptor = {
  config?: MiddlewaresConfig
}
