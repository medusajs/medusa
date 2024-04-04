import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { CreateCustomerDTO, ICustomerModuleService } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createCustomersWorkflow } from "@medusajs/core-flows"
import { remoteQueryObjectFromString } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  // const customerModuleService = req.scope.resolve<ICustomerModuleService>(
  //   ModuleRegistrationName.CUSTOMER
  // )

  // // console.warn(req.filterableFields)
  // // console.warn(req.listConfig)
  // // const [customers, count] = await customerModuleService.listAndCount(
  // //   req.filterableFields,
  // //   req.listConfig
  // // )

  const { skip, take } = req.remoteQueryConfig.pagination

  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = {
    filters: req.filterableFields,
    ...req.remoteQueryConfig.pagination,
  }

  console.warn(variables)

  const query = remoteQueryObjectFromString({
    entryPoint: "customers",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: customers, metadata } = await remoteQuery(query)

  res.json({
    count: metadata.count,
    customers,
    offset: skip,
    limit: take,
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
