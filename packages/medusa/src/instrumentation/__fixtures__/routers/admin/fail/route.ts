import { MedusaError } from "@zjedene-medusa/framework/utils"
import { Request, Response } from "express"

export function GET(req: Request, res: Response) {
  throw new MedusaError(MedusaError.Types.INVALID_DATA, "Failed")
}
