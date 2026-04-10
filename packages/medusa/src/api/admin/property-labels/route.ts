import { createPropertyLabelsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  AdminCreatePropertyLabelType,
  AdminPropertyLabelListParamsType,
} from "./validators"

/**
 * List property labels.
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<AdminPropertyLabelListParamsType>,
  res: MedusaResponse<HttpTypes.AdminPropertyLabelListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: labels, metadata } = await query.graph({
    entity: "property_label",
    fields: req.queryConfig.fields,
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
  })

  res.json({
    property_labels: labels,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

/**
 * Create a property label.
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreatePropertyLabelType>,
  res: MedusaResponse<HttpTypes.AdminPropertyLabelResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { entity, property, label, description } = req.validatedBody

  const { result } = await createPropertyLabelsWorkflow(req.scope).run({
    input: {
      property_labels: [
        {
          entity,
          property,
          label,
          description: description ?? undefined,
        },
      ],
    },
  })

  const {
    data: [propertyLabel],
  } = await query.graph({
    entity: "property_label",
    fields: req.queryConfig.fields,
    filters: { id: result[0].id },
  })

  res.status(201).json({ property_label: propertyLabel })
}
