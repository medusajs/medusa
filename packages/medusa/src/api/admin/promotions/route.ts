import { createPromotionsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchPromotion } from "./helpers"
import {
  AdminCreatePromotionType,
  AdminGetPromotionsParamsType,
} from "./validators"
import { AdditionalData } from "@medusajs/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetPromotionsParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "promotion",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: promotions, metadata } = await remoteQuery(queryObject)

  res.json({
    promotions,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreatePromotionType & AdditionalData>,
  res: MedusaResponse
) => {
  const { additional_data, ...rest } = req.validatedBody
  const createPromotions = createPromotionsWorkflow(req.scope)
  const promotionsData = [rest] as any

  const { result } = await createPromotions.run({
    input: { promotionsData, additional_data },
  })

  const promotion = await refetchPromotion(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ promotion })
}
