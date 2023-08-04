import { validateEmail } from "@medusajs/utils"

import { WorkflowArguments } from "../../helper"

type AttachCustomerDetailsDTO = {
  customer_id?: string
  email?: string
}

type HandlerInputData = {
  cart: {
    customer_id?: string
    email?: string
  }
}

enum Aliases {
  Cart = "cart",
}

export async function attachCustomerDetailsToCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<AttachCustomerDetailsDTO> {
  const customerDTO: AttachCustomerDetailsDTO = {}
  const customerService = container.resolve("customerService")
  const entityManager = container.resolve("manager")
  const customerId = data[Aliases.Cart].customer_id
  const customerServiceTx = customerService.withTransaction(entityManager)

  if (customerId) {
    const customer = await customerServiceTx
      .retrieve(customerId)
      .catch(() => undefined)

    customerDTO.customer_id = customer?.id
    customerDTO.email = customer?.email
  }

  const customerEmail = data[Aliases.Cart].email

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

attachCustomerDetailsToCart.aliases = Aliases
