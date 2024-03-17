import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { defaultAdminSalesChannelFields } from "../query-config"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = {
    id: req.params.id,
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "sales_channels",
    variables,
    fields: defaultAdminSalesChannelFields,
  })

  const [sales_channel] = await remoteQuery(queryObject)

  res.json({ sales_channel })
}
