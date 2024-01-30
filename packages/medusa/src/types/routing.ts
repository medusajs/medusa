import type { Customer, User } from "../models"
import type { NextFunction, Request, Response } from "express"

import type { MedusaContainer } from "./global"
import { AuthUserDTO } from "@medusajs/types"

export interface MedusaRequest extends Request {
  user?: (User | Customer) & { customer_id?: string; userId?: string } & {
    scope?: string
    medusa_id?: string
    authUser?: AuthUserDTO
  }
  scope: MedusaContainer
  session?: any
}

export type MedusaResponse = Response

export type MedusaNextFunction = NextFunction

export type MedusaRequestHandler = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => Promise<void> | void
