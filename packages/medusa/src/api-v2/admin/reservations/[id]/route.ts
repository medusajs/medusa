import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  AdminGetReservationParamsType,
  AdminUpdateReservationType,
} from "../validators"
import { MedusaError } from "@medusajs/utils"
import { deleteReservationsWorkflow } from "@medusajs/core-flows"
import { updateReservationsWorkflow } from "@medusajs/core-flows"
import { refetchReservation } from "../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetReservationParamsType>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const reservation = await refetchReservation(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!reservation) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Reservation with id: ${id} was not found`
    )
  }

  res.status(200).json({ reservation })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateReservationType>,
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

  const reservation = await refetchReservation(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )
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
