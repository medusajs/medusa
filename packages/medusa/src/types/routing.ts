import type { NextFunction, Request, Response } from "express"

import type { Customer, User } from "../models"
import { ContainerLike } from "@medusajs/types"

export interface MedusaRequest extends Request {
  user?: (User | Customer) & { customer_id?: string; userId?: string }
  scope: ContainerLike
}

export type MedusaResponse = Response

export type MedusaNextFunction = NextFunction

export type MedusaRequestHandler = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => Promise<void> | void
