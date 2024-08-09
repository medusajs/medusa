import {
  deleteCustomersWorkflow,
  updateCustomersWorkflow,
} from "@medusajs/core-flows"
import { AdditionalData, AdminCustomer } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchCustomer } from "../helpers"
import { AdminUpdateCustomerType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<{ customer: AdminCustomer }>
) => {
  const customer = await refetchCustomer(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!customer) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Customer with id: ${req.params.id} not found`
    )
  }

  res.status(200).json({ customer })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateCustomerType & AdditionalData>,
  res: MedusaResponse<{ customer: AdminCustomer }>
) => {
  const { additional_data, ...rest } = req.validatedBody

  await updateCustomersWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: rest,
      additional_data,
    },
  })

  const customer = await refetchCustomer(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ customer })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const deleteCustomers = deleteCustomersWorkflow(req.scope)

  await deleteCustomers.run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "customer",
    deleted: true,
  })
}
