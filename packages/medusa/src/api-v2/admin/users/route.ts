import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"

// List users
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "user",
    variables: {
      ...req.filterableFields,
    },
    fields: req.listConfig.select as string[],
  })

  const users = await remoteQuery({
    ...query,
  })

  console.warn("users", users)

  res.status(200).json({})
}

// Create user
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).json({})
}
