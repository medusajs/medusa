import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { CreateCustomerDTO, ICustomerModuleService } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createCustomersWorkflow } from "@medusajs/core-flows"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const customerModuleService = req.scope.resolve<ICustomerModuleService>(
    ModuleRegistrationName.CUSTOMER
  )

  const [customers, count] = await customerModuleService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  const { offset, limit } = req.validatedQuery

  // TODO: Replace with remote query
  //const remoteQuery = req.scope.resolve("remoteQuery")

  //const variables = {
  //  filters: req.filterableFields,
  //  order: req.listConfig.order,
  //  skip: req.listConfig.skip,
  //  take: req.listConfig.take,
  //}

  //const query = remoteQueryObjectFromString({
  //  entryPoint: "customer",
  //  variables,
  //  fields: [...req.listConfig.select!, ...req.listConfig.relations!],
  //})

  //const results = await remoteQuery(query)

  res.json({
    count,
    customers,
    offset,
    limit,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateCustomerDTO>,
  res: MedusaResponse
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

  res.status(200).json({ customer: result[0] })
}
