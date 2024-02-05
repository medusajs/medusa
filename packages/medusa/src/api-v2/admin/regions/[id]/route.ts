import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { defaultAdminRegionFields } from "../query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "region",
    variables,
    fields: defaultAdminRegionFields,
  })

  const [region] = await remoteQuery(queryObject)

  res.status(200).json({ region })
}
