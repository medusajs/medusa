import { validateEmail } from "@medusajs/utils"

import { WorkflowArguments } from "@medusajs/workflows-sdk"

type CustomerDTO = {
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
}: WorkflowArguments<HandlerInputData>): Promise<CustomerDTO> {
  const { manager } = context

  const customerService = container.resolve("customerService")

  const customerDTO: CustomerDTO = {}
  const customerId = data[Aliases.Customer].customer_id
  const customerServiceTx = customerService.withTransaction(manager)

  if (customerId) {
    const customer = await customerServiceTx
      .retrieve(customerId)
      .catch(() => undefined)

    customerDTO.customer_id = customer?.id
    customerDTO.email = customer?.email
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

    customerDTO.customer_id = customer.id
    customerDTO.email = customer.email
  }

  return customerDTO
}

findOrCreateCustomer.aliases = Aliases
