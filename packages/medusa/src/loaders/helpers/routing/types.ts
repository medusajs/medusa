import {
  MedusaNextFunction,
  MedusaRequest,
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

export type RouteConfig = {
  method?: RouteVerb
  handler: RouteHandler
}

type MiddlewareFunction = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => Promise<void> | void

export type MiddlewareRoute = {
  method?: MiddlewareVerb | MiddlewareVerb[]
  matcher: string
  middlewares: MiddlewareFunction[]
}

export type MiddlewaresConfig = {
  routes?: MiddlewareRoute[]
}

export type RouteDescriptor<TConfig = Record<string, unknown>> = {
  absolutePath: string
  relativePath: string
  route: string
  priority: number
  config?: TConfig & {
    routes?: RouteConfig[]
  }
}

export type GlobalMiddlewareDescriptor<TConfig = Record<string, unknown>> = {
  config?: TConfig & MiddlewaresConfig
}
