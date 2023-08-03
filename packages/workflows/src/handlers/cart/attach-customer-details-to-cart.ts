import { validateEmail } from "@medusajs/utils"

import { PipelineHandlerResult, WorkflowArguments } from "../../helper"
import { CartInputAlias } from "../../definition"

export async function attachCustomerDetailsToCart<T>({
  container,
  context,
  data,
}: WorkflowArguments): Promise<PipelineHandlerResult<T>> {
  const customerService = container.resolve("customerService")
  const entityManager = container.resolve("manager")
  const customerId = data[CartInputAlias.Cart].customer_id
  const customerServiceTx = customerService
    .withTransaction(entityManager)

  if (customerId) {
    const customer = await customerServiceTx
      .retrieve(customerId)
      .catch(() => undefined)

    data[CartInputAlias.Cart].customer_id = customer?.id
    data[CartInputAlias.Cart].email = customer?.email
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

    data[CartInputAlias.Cart].customer_id = customer.id
    data[CartInputAlias.Cart].email = customer.email
  }

  return data['cart']
}
