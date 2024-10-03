import { createCustomerAddressesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { AdminCreateCustomerAddressType } from "../../validators"
import { refetchCustomer } from "../../helpers"
import { AdditionalData, HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCustomerAddressFilters>,
  res: MedusaResponse<HttpTypes.AdminCustomerAddressListResponse>
) => {
  const customerId = req.params.id
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "customer_address",
    variables: {
      filters: { ...req.filterableFields, customer_id: customerId },
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: addresses, metadata } = await remoteQuery(query)

  res.json({
    addresses,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    AdminCreateCustomerAddressType & AdditionalData
  >,
  res: MedusaResponse<HttpTypes.AdminCustomerResponse>
) => {
  const { additional_data, ...rest } = req.validatedBody
  const customerId = req.params.id
  const createAddresses = createCustomerAddressesWorkflow(req.scope)
  const addresses = [
    {
      ...rest,
      customer_id: customerId,
    },
  ]

  await createAddresses.run({
    input: { addresses, additional_data },
  })

  const customer = await refetchCustomer(
    customerId,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ customer })
}
