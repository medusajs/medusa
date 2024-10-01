import {
  deleteCustomerAddressesWorkflow,
  updateCustomerAddressesWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes, MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { refetchCustomer } from "../../../helpers"
import {
  StoreGetCustomerAddressParamsType,
  StoreUpdateCustomerAddressType,
} from "../../../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreGetCustomerAddressParamsType>,
  res: MedusaResponse<HttpTypes.StoreCustomerAddressResponse>
) => {
  const customerId = req.auth_context.actor_id

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "customer_address",
    variables: {
      filters: { id: req.params.address_id, customer_id: customerId },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [address] = await remoteQuery(queryObject)
  if (!address) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Address with id: ${req.params.address_id} was not found`
    )
  }

  res.status(200).json({ address })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreUpdateCustomerAddressType>,
  res: MedusaResponse<HttpTypes.StoreCustomerResponse>
) => {
  const id = req.auth_context.actor_id!
  await validateCustomerAddress(req.scope, id, req.params.address_id)

  const updateAddresses = updateCustomerAddressesWorkflow(req.scope)
  await updateAddresses.run({
    input: {
      selector: { id: req.params.address_id, customer_id: req.params.id },
      update: req.validatedBody,
    },
  })

  const customer = await refetchCustomer(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ customer })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.StoreCustomerAddressDeleteResponse>
) => {
  const id = req.auth_context.actor_id
  await validateCustomerAddress(req.scope, id, req.params.address_id)

  const deleteAddress = deleteCustomerAddressesWorkflow(req.scope)
  await deleteAddress.run({
    input: { ids: [req.params.address_id] },
  })

  const customer = await refetchCustomer(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    id,
    object: "address",
    deleted: true,
    parent: customer,
  })
}

const validateCustomerAddress = async (
  scope: MedusaContainer,
  customerId: string,
  addressId: string
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "customer_address",
    variables: {
      filters: { id: addressId, customer_id: customerId },
    },
    fields: ["id"],
  })

  const [address] = await remoteQuery(queryObject)
  if (!address) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Address with id: ${addressId} was not found`
    )
  }
}
