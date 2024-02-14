import type { NextFunction, Request, Response } from "express"

import type { Customer, User } from "../models"
import type { MedusaContainer } from "./global"

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
) => Promise<void> | void
