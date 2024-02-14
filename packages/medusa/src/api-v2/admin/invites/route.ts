import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { createInvitesWorkflow } from "@medusajs/core-flows"
import { CreateInviteDTO, CreateUserDTO } from "@medusajs/types"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "invite",
    variables: {
      filters: req.filterableFields,
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    },
    fields: req.listConfig.select as string[],
  })

  const { rows: invites, metadata } = await remoteQuery({
    ...query,
  })

  res.status(200).json({
    invites,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const workflow = createInvitesWorkflow(req.scope)

  const input = {
    input: {
      invites: [req.validatedBody as CreateInviteDTO],
    },
  }

  const { result } = await workflow.run(input)

  const [invite] = result
  res.status(200).json({ invite })
}
