import {
  deleteCustomerGroupsWorkflow,
  updateCustomerGroupsWorkflow,
} from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

import { MedusaError } from "@zjedene-medusa/framework/utils"
import { refetchCustomerGroup } from "../helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.AdminCustomerGroupResponse>
) => {
  const customerGroup = await refetchCustomerGroup(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  if (!customerGroup) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Customer group with id: ${req.params.id} not found`
    )
  }

  res.status(200).json({ customer_group: customerGroup })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateCustomerGroup,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminCustomerGroupResponse>
) => {
  const existingCustomerGroup = await refetchCustomerGroup(
    req.params.id,
    req.scope,
    ["id"]
  )
  if (!existingCustomerGroup) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Customer group with id "${req.params.id}" not found`
    )
  }

  await updateCustomerGroupsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const customerGroup = await refetchCustomerGroup(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )
  res.status(200).json({ customer_group: customerGroup })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminCustomerGroupDeleteResponse>
) => {
  const id = req.params.id
  const deleteCustomerGroups = deleteCustomerGroupsWorkflow(req.scope)

  await deleteCustomerGroups.run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "customer_group",
    deleted: true,
  })
}
