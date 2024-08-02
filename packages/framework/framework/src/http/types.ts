import { ZodObject } from "zod"
import type { NextFunction, Request, Response } from "express"

import { MedusaPricingContext, RequestQueryFields } from "@medusajs/types"
import * as core from "express-serve-static-core"
import { MedusaContainer } from "../container"

export interface FindConfig<Entity> {
  select?: (keyof Entity)[]
  skip?: number
  take?: number
  relations?: string[]
  order?: { [K: string]: "ASC" | "DESC" }
}

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

export type ParserConfig = false | ParserConfigArgs

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

export interface MedusaRequest<Body = unknown>
  extends Request<core.ParamsDictionary, any, Body> {
  validatedBody: Body
  validatedQuery: RequestQueryFields & Record<string, unknown>
  /**
   * TODO: shouldn't this correspond to returnable fields instead of allowed fields? also it is used by the cleanResponseData util
   */
  allowedProperties: string[]
  /**
   * An object containing the select, relation, skip, take and order to be used with medusa internal services
   */
  listConfig: FindConfig<unknown>
  /**
   * An object containing the select, relation to be used with medusa internal services
   */
  retrieveConfig: FindConfig<unknown>
  /**
   * An object containing fields and variables to be used with the remoteQuery
   */
  remoteQueryConfig: {
    fields: string[]
    pagination: { order?: Record<string, string>; skip?: number; take?: number }
  }
  /**
   * An object containing the fields that are filterable e.g `{ id: Any<String> }`
   */
  filterableFields: Record<string, unknown>
  includes?: Record<string, boolean>
  /**
   * An array of fields and relations that are allowed to be queried, this can be set by the
   * consumer as part of a middleware and it will take precedence over the defaultAllowedFields
   * @deprecated use `allowed` instead
   */
  allowedFields?: string[]
  /**
   * An array of fields and relations that are allowed to be queried, this can be set by the
   * consumer as part of a middleware and it will take precedence over the defaultAllowedFields set
   * by the api
   */
  allowed?: string[]
  errors: string[]
  scope: MedusaContainer
  session?: any
  rawBody?: any
  requestId?: string
  /**
   * An object that carries the context that is used to calculate prices for variants
   */
  pricingContext?: MedusaPricingContext
  /**
   * A generic context object that can be used across the request lifecycle
   */
  context?: Record<string, any>
  /**
   * Custom validators for the request body and query params that will be
   * merged with the original validator of the route.
   */
  extendedValidators?: {
    body?: ZodObject<any, any>
    queryParams?: ZodObject<any, any>
  }
}

export interface AuthContext {
  actor_id: string
  actor_type: string
  auth_identity_id: string
  app_metadata: Record<string, unknown>
}

export interface AuthenticatedMedusaRequest<Body = never>
  extends MedusaRequest<Body> {
  auth_context: AuthContext
}

export type MedusaResponse<Body = unknown> = Response<Body>

export type MedusaNextFunction = NextFunction

export type MedusaRequestHandler<Body = unknown, Res = unknown> = (
  req: MedusaRequest<Body>,
  res: MedusaResponse<Res>,
  next: MedusaNextFunction
) => Promise<void> | void
