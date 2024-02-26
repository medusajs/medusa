import type { Customer, User } from "../models"
import type { NextFunction, Request, Response } from "express"

import { MedusaContainer } from "@medusajs/types"
import { RequestQueryFields } from "@medusajs/types"

export interface MedusaRequest<Body = unknown> extends Request {
  validatedBody: Body
  validatedQuery: RequestQueryFields & Record<string, unknown>
  allowedProperties: string[]
  includes?: Record<string, boolean>
  errors: string[]
  scope: MedusaContainer
  session?: any
  requestId?: string
}

export interface AuthenticatedMedusaRequest<Body = never>
  extends MedusaRequest<Body> {
  user: (User | Customer) & { customer_id?: string; userId?: string } // TODO: Remove this property when v2 is released
  auth: {
    actor_id: string
    auth_user_id: string
    app_metadata: Record<string, any>
    scope: string
  }
}

export type MedusaResponse = Response

export type MedusaNextFunction = NextFunction

export type MedusaRequestHandler = (
  req: MedusaRequest<unknown>,
  res: MedusaResponse,
  next: MedusaNextFunction
) => Promise<void> | void
