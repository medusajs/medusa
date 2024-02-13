import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { createUsersWorkflow } from "@medusajs/core-flows"
import { CreateUserDTO } from "@medusajs/types"

// List users
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "user",
    variables: {
      filters: req.filterableFields,
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    },
    fields: req.listConfig.select as string[],
  })

  const { rows: users, metadata } = await remoteQuery({
    ...query,
  })

  res.status(200).json({
    users,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

// Create user
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const workflow = createUsersWorkflow(req.scope)

  const input = {
    input: {
      users: [req.validatedBody as CreateUserDTO],
    },
  }

  const { result } = await workflow.run(input)

  const [user] = result
  res.status(200).json({ user })
}
