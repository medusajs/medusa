import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { StoreGetPaymentProvidersParamsType } from "./validators"

// TODO: Add more fields to provider, such as default name and maybe logo.
export const GET = async (
  req: AuthenticatedMedusaRequest<StoreGetPaymentProvidersParamsType>,
  res: MedusaResponse
) => {
  if (!req.filterableFields.region_id) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You must provide the region_id to list payment providers"
    )
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "region_payment_provider",
    variables: {
      filters: {
        region_id: req.filterableFields.region_id,
      },
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields.map((f) => `payment_provider.${f}`),
  })

  const { rows: regionPaymentProvidersRelation, metadata } = await remoteQuery(
    queryObject
  )

  const paymentProviders = regionPaymentProvidersRelation.map(
    (relation) => relation.payment_provider
  )

  res.json({
    payment_providers: paymentProviders,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
