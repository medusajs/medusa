import { batchPropertyLabelsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AdminBatchPropertyLabelsType } from "../validators"

/**
 * Batch create, update, and delete property labels.
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminBatchPropertyLabelsType>,
  res: MedusaResponse<HttpTypes.AdminBatchPropertyLabelResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { create, update, delete: toDelete } = req.validatedBody

  const { result } = await batchPropertyLabelsWorkflow(req.scope).run({
    input: {
      create: create?.map((item) => ({
        entity: item.entity,
        property: item.property,
        label: item.label,
        description: item.description ?? undefined,
      })),
      update: update?.map((item) => ({
        id: item.id,
        label: item.label,
        description: item.description ?? undefined,
      })),
      delete: toDelete,
    },
  })

  const createdIds = new Set(result.created.map((r) => r.id))
  const updatedIds = new Set(result.updated.map((r) => r.id))

  let createdLabels: HttpTypes.AdminPropertyLabel[] = []
  let updatedLabels: HttpTypes.AdminPropertyLabel[] = []

  const ids = Array.from(new Set([...createdIds, ...updatedIds]))
  const { data } = await query.graph({
    entity: "property_label",
    fields: req.queryConfig.fields,
    filters: { id: ids },
  })

  createdLabels = data.filter((l) => createdIds.has(l.id))
  updatedLabels = data.filter((l) => updatedIds.has(l.id))

  res.status(200).json({
    created: createdLabels,
    updated: updatedLabels,
    deleted: (result.deleted ?? []).map((id) => ({
      id,
      object: "property_label" as const,
      deleted: true,
    })),
  })
}
