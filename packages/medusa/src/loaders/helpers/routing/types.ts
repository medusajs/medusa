import {
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
type MiddlewareVerb = "USE" | "ALL" | RouteVerb

type RouteHandler = (
  req: MedusaRequest,
  res: MedusaResponse
) => Promise<void> | void

export type RouteImplementation = {
  method?: RouteVerb
  handler: RouteHandler
}

export type RouteConfig = {
  shouldRequireAdminAuth?: boolean
  shouldRequireCustomerAuth?: boolean
  shouldAppendCustomer?: boolean
  routes?: RouteImplementation[]
}

export type MiddlewareFunction =
  | MedusaRequestHandler
  | ((...args: any[]) => any)

export type MiddlewareRoute = {
  method?: MiddlewareVerb | MiddlewareVerb[]
  matcher: string | RegExp
  middlewares: MiddlewareFunction[]
}

export type MiddlewaresConfig = {
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
