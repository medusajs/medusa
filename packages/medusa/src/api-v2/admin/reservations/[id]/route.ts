import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

import { AdminPostReservationsReservationReq } from "../validators"
import { MedusaError } from "@medusajs/utils"
import { deleteReservationsWorkflow } from "@medusajs/core-flows"
import { updateReservationsWorkflow } from "@medusajs/core-flows"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "reservation",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const [reservation] = await remoteQuery(queryObject)

  if (!reservation) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Reservation with id: ${id} was not found`
    )
  }

  res.status(200).json({ reservation })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReservationsReservationReq>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { errors } = await updateReservationsWorkflow(req.scope).run({
    input: {
      updates: [{ ...req.validatedBody, id }],
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "reservation",
    variables: {
      filters: { id: req.params.id },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [reservation] = await remoteQuery(queryObject)

  res.status(200).json({ reservation })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  const { errors } = await deleteReservationsWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "reservation",
    deleted: true,
  })
}
