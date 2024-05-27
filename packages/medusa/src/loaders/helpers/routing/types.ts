import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaRequestHandler,
  MedusaResponse,
} from "../../../types/routing"

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

type RouteHandler = SyncRouteHandler | AsyncRouteHandler

export type RouteImplementation = {
  method?: RouteVerb
  handler: RouteHandler
}

export type RouteConfig = {
  shouldRequireAdminAuth?: boolean
  shouldRequireCustomerAuth?: boolean
  optedOutOfAuth?: boolean
  routeType?: "admin" | "store" | "auth"
  shouldAppendAdminCors?: boolean
  shouldAppendStoreCors?: boolean
  shouldAppendAuthCors?: boolean
  routes?: RouteImplementation[]
}

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

type ParserConfig = false | ParserConfigArgs

export type MiddlewareRoute = {
  method?: MiddlewareVerb | MiddlewareVerb[]
  matcher: string | RegExp
  bodyParser?: ParserConfig
  middlewares?: MiddlewareFunction[]
}

export type MiddlewaresConfig = {
  errorHandler?: false | MedusaErrorHandlerFunction
  routes?: MiddlewareRoute[]
}

export type RouteDescriptor = {
  absolutePath: string
  relativePath: string
  route: string
  priority: number
  config?: RouteConfig
}

export type GlobalMiddlewareDescriptor = {
  config?: MiddlewaresConfig
}
