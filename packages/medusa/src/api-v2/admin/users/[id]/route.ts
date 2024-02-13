import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

// Get user
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "user",
    variables: {
      id: req.params.id,
    },
    fields: req.retrieveConfig.select as string[],
  })

  const [user] = await remoteQuery(query)

  res.status(200).json({ user })
}

// update user
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).json({})
}

// delete user
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).json({})
}
