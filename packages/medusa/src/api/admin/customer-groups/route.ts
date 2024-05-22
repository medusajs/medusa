import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { createCustomerGroupsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { AdminCreateCustomerGroupType } from "./validators"
import { refetchCustomerGroup } from "./helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
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
  res: MedusaResponse
) => {
  const createGroups = createCustomerGroupsWorkflow(req.scope)
  const customersData = [
    {
      ...req.validatedBody,
      created_by: req.auth_context.actor_id,
    },
  ]

  const { result, errors } = await createGroups.run({
    input: { customersData },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const customerGroup = await refetchCustomerGroup(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ customer_group: customerGroup })
}
