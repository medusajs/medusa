import { createCustomersWorkflow } from "@medusajs/core-flows"
import {
  AdminCustomerListResponse,
  AdminCustomerResponse,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminCreateCustomerType } from "./validators"
import { refetchCustomer } from "./helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminCustomerListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "customers",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: customers, metadata } = await remoteQuery(query)

  res.json({
    customers,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateCustomerType>,
  res: MedusaResponse<AdminCustomerResponse>
) => {
  const createCustomers = createCustomersWorkflow(req.scope)

  const customersData = [
    {
      ...req.validatedBody,
      created_by: req.auth_context.actor_id,
    },
  ]

  const { result } = await createCustomers.run({
    input: { customersData },
  })

  const customer = await refetchCustomer(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ customer })
}
