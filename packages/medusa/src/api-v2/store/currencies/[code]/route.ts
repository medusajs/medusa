import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { defaultStoreCurrencyFields } from "../query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { code: req.params.code }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "currency",
    variables,
    fields: defaultStoreCurrencyFields,
  })

  const [currency] = await remoteQuery(queryObject)
  res.status(200).json({ currency })
}
