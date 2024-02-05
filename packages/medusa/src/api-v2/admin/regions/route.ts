import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { defaultAdminRegionFields } from "./query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = {
    filters: req.filterableFields,
    order: req.listConfig.order,
    skip: req.listConfig.skip,
    take: req.listConfig.take,
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "region",
    variables,
    fields: defaultAdminRegionFields,
  })

  const {
    rows: regions,
    metadata: { count },
  } = await remoteQuery(queryObject)

  res.json({
    count,
    regions,
    offset: req.listConfig.skip,
    limit: req.listConfig.take,
  })
}
