export const excludeExtensions = ['.map.js', '.d.ts'];

/* eslint-disable no-unused-vars */
export enum RouteVerbs {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
  ALL = 'ALL',
}
/* eslint-enable no-unused-vars */

export type RouteConfig = {
  method?: RouteVerbs | 'get' | 'GET';
  handlers: ((...args: unknown[]) => Promise<unknown>)[];
}

export type GlobalMiddlewareRouteConfig = {
  method?: RouteVerbs | 'get' | 'GET'; // default 'get'
  path: string;
  middlewares: ((...args: unknown[]) => Promise<unknown>)[];
}

export type Config = {
  ignore?: boolean;
  routes?: RouteConfig[];
}

export type GlobalMiddlewareConfig = {
  ignore?: boolean;
  routes?: GlobalMiddlewareRouteConfig[];
}

export type RouteDescriptor<TConfig = Record<string, unknown>> = {
  absolutePath: string;
  relativePath: string;
  route: string;
  priority: number;
  config?: TConfig & Config
}

export type GlobalMiddlewareDescriptor<TConfig = Record<string, unknown>> =
  RouteDescriptor & {
    config?: TConfig & GlobalMiddlewareConfig
  }

export type OnRouteLoadingHook<TConfig> = (
  descriptor: RouteDescriptor<TConfig>
) => Promise<void>;
