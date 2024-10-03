import {
  ApiKeyType,
  ContainerRegistrationKeys,
  isPresent,
  MedusaError,
  PUBLISHABLE_KEY_HEADER,
} from "@medusajs/utils"
import {
  MedusaNextFunction,
  MedusaResponse,
  MedusaStoreRequest,
} from "../../http"

export async function ensurePublishableApiKeyMiddleware(
  req: MedusaStoreRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction
) {
  const publishableApiKey = req.get(PUBLISHABLE_KEY_HEADER)

  if (!isPresent(publishableApiKey)) {
    try {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Publishable API key required in the request header: ${PUBLISHABLE_KEY_HEADER}. You can manage your keys in settings in the dashboard.`
      )
    } catch (e) {
      return next(e)
    }
  }

  let apiKey
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const { data } = await query.graph(
      {
        entity: "api_key",
        fields: ["id", "token", "sales_channels_link.sales_channel_id"],
        filters: {
          token: publishableApiKey,
          type: ApiKeyType.PUBLISHABLE,
          $or: [
            { revoked_at: { $eq: null } },
            { revoked_at: { $gt: new Date() } },
          ],
        },
      },
      { throwIfKeyNotFound: true }
    )

    apiKey = data[0]
  } catch (e) {
    return next(e)
  }

  if (!apiKey) {
    try {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `A valid publishable key is required to proceed with the request`
      )
    } catch (e) {
      return next(e)
    }
  }

  req.publishable_key_context = {
    key: apiKey.token,
    sales_channel_ids: apiKey.sales_channels_link.map(
      (link) => link.sales_channel_id
    ),
  }

  return next()
}
