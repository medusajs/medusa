import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { defaultAdminSalesChannelFields } from "./query-config"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = {
    filters: req.filterableFields,
    order: req.listConfig.order,
    skip: req.listConfig.skip,
    take: req.listConfig.take,
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "sales_channels",
    variables,
    fields: defaultAdminSalesChannelFields,
  })

  const { rows: sales_channels, metadata } = await remoteQuery(queryObject)

  res.json({
    sales_channels,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
