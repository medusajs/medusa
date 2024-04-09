import {
  deleteCustomersWorkflow,
  updateCustomersWorkflow,
} from "@medusajs/core-flows"
import { AdminCustomerResponse, CustomerUpdatableFields } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminCustomerResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "customer",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const [customer] = await remoteQuery(queryObject)

  res.status(200).json({ customer })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CustomerUpdatableFields>,
  res: MedusaResponse<AdminCustomerResponse>
) => {
  const { errors } = await updateCustomersWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "customer",
    variables: {
      filters: { id: req.params.id },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [customer] = await remoteQuery(queryObject)

  res.status(200).json({ customer })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const deleteCustomers = deleteCustomersWorkflow(req.scope)

  const { errors } = await deleteCustomers.run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "customer",
    deleted: true,
  })
}
