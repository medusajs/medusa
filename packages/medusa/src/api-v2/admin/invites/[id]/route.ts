import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { deleteInvitesWorkflow } from "@medusajs/core-flows"
import { IUserModuleService, UpdateUserDTO } from "@medusajs/types"
import { ModuleRegistrationName } from "../../../../../../modules-sdk/dist"

// Get invite
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "invite",
    variables: {
      id,
    },
    fields: req.retrieveConfig.select as string[],
  })

  const [invite] = await remoteQuery(query)

  if (!invite) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Invite with id: ${id} was not found`
    )
  }

  res.status(200).json({ invite })
}

// delete invite
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const workflow = deleteInvitesWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "invite",
    deleted: true,
  })
}
