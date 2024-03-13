import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { listPriceLists } from "./queries"
import { adminPriceListRemoteQueryFields } from "./query-config"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { limit, offset } = req.validatedQuery
  const [priceLists, count] = await listPriceLists({
    container: req.scope,
    apiFields: req.listConfig.select!,
    remoteQueryFields: adminPriceListRemoteQueryFields,
    variables: {
      filters: req.filterableFields,
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    },
  })

  res.json({
    count,
    price_lists: priceLists,
    offset,
    limit,
  })
}
