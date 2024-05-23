import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

import { createInvitesWorkflow } from "@medusajs/core-flows"
import { AdminCreateInviteType, AdminGetInvitesParamsType } from "./validators"
import { refetchInvite } from "./helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetInvitesParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "invite",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: invites, metadata } = await remoteQuery(queryObject)

  res.json({
    invites,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateInviteType>,
  res: MedusaResponse
) => {
  const workflow = createInvitesWorkflow(req.scope)

  const input = {
    input: {
      invites: [req.validatedBody],
    },
    throwOnError: false,
  }

  const { result, errors } = await workflow.run(input)

  if (errors?.length) {
    throw errors[0].error
  }

  const invite = await refetchInvite(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ invite })
}
