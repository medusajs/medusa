import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  deduplicate,
} from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminOrderItemsFilters>,
  res: MedusaResponse<HttpTypes.AdminOrderLineItemsListResponse>
) => {
  const { id } = req.params

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const result = await query.graph({
    entity: "order_items",
    filters: {
      ...req.filterableFields,
      order_id: id,
    },
    fields: deduplicate(
      req.remoteQueryConfig.fields.concat(["item_id", "version"])
    ),
  })

  const data = result.data
  const deduplicatedItems = {}

  for (const item of data) {
    const itemId = item.item_id
    const version = item.version

    if (!deduplicatedItems[itemId]) {
      deduplicatedItems[itemId] = {
        ...item,
        history: {
          version: {
            from: version,
            to: version,
          },
        },
      }
      continue
    }

    deduplicatedItems[itemId].history.version.to = Math.max(
      version,
      deduplicatedItems[itemId].history.version.to
    )

    deduplicatedItems[itemId].history.version.from = Math.min(
      version,
      deduplicatedItems[itemId].history.version.from
    )

    if (version > deduplicatedItems[itemId].version) {
      deduplicatedItems[itemId] = {
        ...item,
        history: deduplicatedItems[itemId].history,
      }
    }
  }

  res.json({
    order_items: Object.values(deduplicatedItems),
  })
}
