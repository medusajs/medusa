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

export type RouteConfig = {
  method?: RouteVerb
  handler: (...args: unknown[]) => Promise<unknown>
}

export type MiddlewareRouteConfig = {
  method?: MiddlewareVerb | MiddlewareVerb[]
  matcher: string
  middlewares: ((...args: unknown[]) => Promise<unknown>)[]
}

export type MiddlewareConfig = {
  routes?: MiddlewareRouteConfig[]
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
  config?: TConfig & MiddlewareConfig
}

export type OnRouteLoadingHook<TConfig> = (
  descriptor: RouteDescriptor<TConfig>
) => Promise<void>
