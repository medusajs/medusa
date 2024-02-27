import { validateEmail } from "@medusajs/utils"

import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { CustomerTypes } from "@medusajs/types"

type CustomerResultDTO = {
  customer?: CustomerTypes.CustomerDTO
  customer_id?: string
  email?: string
}

type HandlerInputData = {
  customer: {
    customer_id?: string
    email?: string
  }
}

enum Aliases {
  Customer = "customer",
}

export async function findOrCreateCustomer({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<CustomerResultDTO> {
  const { manager } = context

  const customerService = container.resolve("customerService")

  const customerDataDTO: CustomerResultDTO = {}
  const customerId = data[Aliases.Customer].customer_id
  const customerServiceTx = customerService.withTransaction(manager)

  if (customerId) {
    const customer = await customerServiceTx
      .retrieve(customerId)
      .catch(() => undefined)

    customerDataDTO.customer = customer
    customerDataDTO.customer_id = customer?.id
    customerDataDTO.email = customer?.email
  }

  const customerEmail = data[Aliases.Customer].email

  if (customerEmail) {
    const validatedEmail = validateEmail(customerEmail)

    let customer = await customerServiceTx
      .retrieveUnregisteredByEmail(validatedEmail)
      .catch(() => undefined)

    if (!customer) {
      customer = await customerServiceTx.create({ email: validatedEmail })
    }

    customerDataDTO.customer = customer
    customerDataDTO.customer_id = customer.id
    customerDataDTO.email = customer.email
  }

  return customerDataDTO
}

findOrCreateCustomer.aliases = Aliases
