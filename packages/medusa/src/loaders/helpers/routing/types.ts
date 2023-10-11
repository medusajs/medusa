export type RouteVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS"
export type MiddlewareVerb = "ALL" | RouteVerb

/* eslint-disable no-unused-vars */
export enum RouteVerbs {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
  ALL = "ALL",
}
/* eslint-enable no-unused-vars */

export type RouteConfig = {
  method?: RouteVerbs
  handler: (...args: unknown[]) => Promise<unknown>
}

export type GlobalMiddlewareRouteConfig = {
  method?: MiddlewareVerb
  matcher: string
  middlewares: ((...args: unknown[]) => Promise<unknown>)[]
}

export type MiddlewareConfig = {
  method?: MiddlewareVerb
  matcher: string
  middlewares: ((...args: unknown[]) => Promise<unknown>)[]
}

export type Config = {
  routes?: RouteConfig[]
}

export type GlobalMiddlewareConfig = {
  routes?: GlobalMiddlewareRouteConfig[]
}

export type RouteDescriptor<TConfig = Record<string, unknown>> = {
  absolutePath: string
  relativePath: string
  route: string
  priority: number
  config?: TConfig & Config
}

export type GlobalMiddlewareDescriptor<TConfig = Record<string, unknown>> = {
  config?: TConfig & GlobalMiddlewareConfig
}

export type OnRouteLoadingHook<TConfig> = (
  descriptor: RouteDescriptor<TConfig>
) => Promise<void>
