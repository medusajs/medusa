import type { Request, Response, NextFunction } from "express"

import type { MedusaContainer } from "./global"
import type { Customer, User } from "../models"

export interface MedusaRequest extends Request {
  user?: (User | Customer) & { customer_id?: string; userId?: string }
  scope: MedusaContainer
}

export type MedusaResponse = Response

export type MedusaNextFunction = NextFunction

export type {
  MiddlewaresConfig,
  MiddlewareRoute,
} from "../loaders/helpers/routing/types"
