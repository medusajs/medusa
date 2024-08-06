import { ZodObject } from "zod"
import type { NextFunction, Request, Response } from "express"

import {
  MedusaContainer,
  MedusaPricingContext,
  RequestQueryFields,
} from "@medusajs/types"
import * as core from "express-serve-static-core"
import { FindConfig } from "./common"

// TODO this will be reqorked and move to the framework at a later point unless decided otherwise
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
   * Custom validator to validate the `additional_data` property in
   * requests that allows for additional_data
   */
  additionalDataValidator?: ZodObject<any, any>
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
