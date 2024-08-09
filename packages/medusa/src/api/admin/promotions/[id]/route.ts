import {
  deletePromotionsWorkflow,
  updatePromotionsWorkflow,
} from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchPromotion } from "../helpers"
import {
  AdminGetPromotionParamsType,
  AdminUpdatePromotionType,
} from "../validators"
import { AdditionalData } from "@medusajs/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetPromotionParamsType>,
  res: MedusaResponse
) => {
  const idOrCode = req.params.id
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "promotion",
    variables: {
      filters: { $or: [{ id: idOrCode }, { code: idOrCode }] },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [promotion] = await remoteQuery(queryObject)
  if (!promotion) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Promotion with id or code: ${idOrCode} was not found`
    )
  }

  res.status(200).json({ promotion })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdatePromotionType & AdditionalData>,
  res: MedusaResponse
) => {
  const { additional_data, ...rest } = req.validatedBody
  const updatePromotions = updatePromotionsWorkflow(req.scope)
  const promotionsData = [
    {
      id: req.params.id,
      ...rest,
    } as any,
  ]

  await updatePromotions.run({
    input: { promotionsData, additional_data },
  })

  const promotion = await refetchPromotion(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ promotion })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const deletePromotions = deletePromotionsWorkflow(req.scope)

  await deletePromotions.run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "promotion",
    deleted: true,
  })
}
