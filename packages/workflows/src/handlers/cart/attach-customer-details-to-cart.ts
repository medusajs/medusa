import { validateEmail } from "@medusajs/utils"

import { PipelineHandlerResult, WorkflowArguments } from "../../helper"
import { CartInputAlias } from "../../definition"

type AttachCustomerDetailsDTO = {
  customer_id?: string
  email?: string
}

export async function attachCustomerDetailsToCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<AttachCustomerDetailsDTO> {
  const customerDTO: AttachCustomerDetailsDTO = {}
  const customerService = container.resolve("customerService")
  const entityManager = container.resolve("manager")
  const customerId = data[CartInputAlias.Cart].customer_id
  const customerServiceTx = customerService
    .withTransaction(entityManager)

  if (customerId) {
    const customer = await customerServiceTx
      .retrieve(customerId)
      .catch(() => undefined)

    customerDTO.customer_id = customer?.id
    customerDTO.email = customer?.email
  }

  const customerEmail = data[CartInputAlias.Cart].email

  if (customerEmail) {
    const validatedEmail = validateEmail(customerEmail)

    let customer = await customerServiceTx
      .retrieveUnregisteredByEmail(validatedEmail)
      .catch(() => undefined)

    if (!customer) {
      customer = await customerServiceTx.create({ email: validatedEmail })
    }

    customerDTO.customer_id = customer.id
    customerDTO.email = customer.email
  }

  return customerDTO
}
