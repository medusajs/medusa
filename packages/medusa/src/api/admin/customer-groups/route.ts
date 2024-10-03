import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createCustomerGroupsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { AdminCreateCustomerGroupType } from "./validators"
import { refetchCustomerGroup } from "./helpers"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetCustomerGroupsParams>,
  res: MedusaResponse<HttpTypes.AdminCustomerGroupListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "customer_group",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: customer_groups, metadata } = await remoteQuery(query)

  res.json({
    customer_groups,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateCustomerGroupType>,
  res: MedusaResponse<HttpTypes.AdminCustomerGroupResponse>
) => {
  const createGroups = createCustomerGroupsWorkflow(req.scope)
  const customersData = [
    {
      ...req.validatedBody,
      created_by: req.auth_context.actor_id,
    },
  ]

  const { result } = await createGroups.run({
    input: { customersData },
  })

  const customerGroup = await refetchCustomerGroup(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ customer_group: customerGroup })
}
