import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@zjedene-medusa/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.StoreCollectionResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: collections } = await query.graph(
    {
      entity: "product_collection",
      filters: { id: req.params.id },
      fields: req.queryConfig.fields,
    },
    {
      locale: req.locale,
    }
  )

  const collection = collections[0]
  if (!collection) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Collection with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ collection: collection })
}
