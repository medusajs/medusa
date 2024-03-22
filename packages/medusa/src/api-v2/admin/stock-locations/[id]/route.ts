import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

import { deleteStockLocationsWorkflow } from "@medusajs/core-flows"

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  const { errors } = await deleteStockLocationsWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "stock_location",
    deleted: true,
  })
}
