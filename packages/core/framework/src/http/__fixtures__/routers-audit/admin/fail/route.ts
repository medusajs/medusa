import { MedusaError } from "@medusajs/utils"
import { Request, Response } from "express"

export const POST = async (req: Request, res: Response) => {
  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Not allowed")
}
