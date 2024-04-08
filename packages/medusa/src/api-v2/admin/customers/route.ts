import { createCustomersWorkflow } from "@medusajs/core-flows"
import {
  AdminCustomerListResponse,
  AdminCustomerResponse,
} from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminCreateCustomerType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminCustomerListResponse>
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = {
    filters: req.filterableFields,
    ...req.remoteQueryConfig.pagination,
  }

  const query = remoteQueryObjectFromString({
    entryPoint: "customers",
    variables,
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
      created_by: req.auth?.actor_id,
    },
  ]

  const { result, errors } = await createCustomers.run({
    input: { customersData },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ customer: result[0] as AdminCustomerResponse["customer"] })
}
