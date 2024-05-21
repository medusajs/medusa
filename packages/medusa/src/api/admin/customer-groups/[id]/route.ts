import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  deleteCustomerGroupsWorkflow,
  updateCustomerGroupsWorkflow,
} from "@medusajs/core-flows"

import { refetchCustomerGroup } from "../helpers"
import { AdminUpdateCustomerGroupType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const customerGroup = await refetchCustomerGroup(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ customer_group: customerGroup })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateCustomerGroupType>,
  res: MedusaResponse
) => {
  const updateGroups = updateCustomerGroupsWorkflow(req.scope)
  const { result, errors } = await updateGroups.run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const customerGroup = await refetchCustomerGroup(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ customer_group: customerGroup })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const deleteCustomerGroups = deleteCustomerGroupsWorkflow(req.scope)

  const { errors } = await deleteCustomerGroups.run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "customer_group",
    deleted: true,
  })
}
