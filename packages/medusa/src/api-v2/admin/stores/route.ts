import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { defaultAdminStoreFields } from "./query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "store",
    variables: {
      filters: req.filterableFields,
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    },
    fields: defaultAdminStoreFields,
  })

  const { rows: stores, metadata } = await remoteQuery(queryObject)

  res.json({
    stores,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
