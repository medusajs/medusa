import type { Request } from "express"

import type { Customer, User } from "../models"
import { FindConfig, RequestQueryFields } from "./common"

export interface MedusaRequest<Body = unknown> extends Request {
  validatedBody: Body
  validatedQuery: RequestQueryFields & Record<string, unknown>
  listConfig: FindConfig<unknown>
  retrieveConfig: FindConfig<unknown>
  filterableFields: Record<string, unknown>
  allowedProperties: string[]
  includes?: Record<string, boolean>
  errors: string[]
}

export interface AuthenticatedMedusaRequest<Body = never>
  extends MedusaRequest<Body> {
  user: (User | Customer) & { customer_id?: string; userId?: string }
  auth: {
    actor_id: string
    auth_user_id: string
    app_metadata: Record<string, any>
    scope: string
  }
}
/*
export interface MedusaRequest extends Request {
  user?: (User | Customer) & { customer_id?: string; userId?: string }
  scope: MedusaContainer
  session?: any
  requestId?: string
  auth_user?: { id: string; app_metadata: Record<string, any>; scope: string }
}

export type MedusaResponse = Response

export type MedusaNextFunction = NextFunction

export type MedusaRequestHandler = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => Promise<void> | void*/
