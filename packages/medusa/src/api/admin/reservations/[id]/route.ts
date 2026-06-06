import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { MedusaError } from "@zjedene-medusa/framework/utils"
import {
  deleteReservationsWorkflow,
  updateReservationsWorkflow,
} from "@zjedene-medusa/core-flows"
import { refetchReservation } from "../helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminReservationParams
  >,
  res: MedusaResponse<HttpTypes.AdminReservationResponse>
) => {
  const { id } = req.params

  const reservation = await refetchReservation(
    id,
    req.scope,
    req.queryConfig.fields
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
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateReservation,
    HttpTypes.AdminReservationParams
  >,
  res: MedusaResponse<HttpTypes.AdminReservationResponse>
) => {
  const { id } = req.params
  await updateReservationsWorkflow(req.scope).run({
    input: {
      updates: [{ ...req.validatedBody, id }],
    },
  })

  const reservation = await refetchReservation(
    id,
    req.scope,
    req.queryConfig.fields
  )
  res.status(200).json({ reservation })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminReservationDeleteResponse>
) => {
  const id = req.params.id

  await deleteReservationsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "reservation",
    deleted: true,
  })
}
