import { MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { listPriceLists } from "../utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const [[priceList], count] = await listPriceLists({
    container: req.scope,
    fields: req.retrieveConfig.select!,
    variables: {
      filters: { id },
      skip: 0,
      take: 1,
    },
  })

  if (count === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Price list with id: ${id} was not found`
    )
  }

  res.status(200).json({ price_list: priceList })
}
