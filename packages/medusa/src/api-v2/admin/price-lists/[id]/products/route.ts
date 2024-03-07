import { MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { GET as AdminGetProductsRoute } from "../../../products/route"
import { listPriceLists } from "../../utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const [[priceList], count] = await listPriceLists({
    container: req.scope,
    fields: ["prices.variant_id"],
    variables: { filters: { id }, skip: 0, take: 1 },
  })

  if (count === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Price list with id: ${id} was not found`
    )
  }

  const variantIds: string[] =
    priceList.prices?.map((price) => price.variant_id).filter(Boolean) || []

  req.filterableFields = {
    ...req.filterableFields,
    variants: {
      id: variantIds,
    },
  }

  AdminGetProductsRoute(req, res)
}
