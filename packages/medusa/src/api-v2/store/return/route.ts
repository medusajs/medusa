import { CreateOrderReturnDTO } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const input = [req.validatedBody as CreateOrderReturnDTO]

  // TODO: create return workflow

  res.status(200).json({ return: {} })
}
