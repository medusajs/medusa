import type {
  ZodNullable,
  ZodObject,
  ZodOptional,
  ZodRawShape,
} from "@medusajs/deps/zod"

import type {
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
  | MedusaRequestHandler
  | ((...args: any[]) => any)

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

export type MiddlewareRoute = {
  /**
   * @deprecated. Instead use {@link MiddlewareRoute.methods}
   */
  method?: MiddlewareVerb | MiddlewareVerb[]
  methods?: MiddlewareVerb[]
  matcher: string | RegExp
  bodyParser?: ParserConfig
  additionalDataValidator?: ZodRawShape
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
  routeType?: "admin" | "store" | "auth"
  absolutePath?: string
  relativePath?: string
  shouldAppendAdminCors: boolean
  shouldAppendStoreCors: boolean
  shouldAppendAuthCors: boolean
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

export type GlobalMiddlewareDescriptor = {
  config?: MiddlewaresConfig
}
