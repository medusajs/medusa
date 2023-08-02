import { validateEmail } from "@medusajs/utils"

import { PipelineHandlerResult, WorkflowArguments } from "../../helper"
import { InputAlias } from "../../definitions"

export async function attachCustomerDetailsToCart<T>({
  container,
  context,
  data,
}: WorkflowArguments): Promise<PipelineHandlerResult<T>> {
  const customerService = container.resolve("customerService")
  const customerId = data[InputAlias.Cart].customer_id
  const customerServiceTx = customerService
    // .withTransaction(transactionManager)

  if (customerId) {
    const customer = await customerServiceTx
      .retrieve(customerId)
      .catch(() => undefined)

    data[InputAlias.Cart].customer_id = customer?.id
    data[InputAlias.Cart].email = customer?.email
  }

  const customerEmail = data[InputAlias.Cart].email

  if (customerEmail) {
    const validatedEmail = validateEmail(customerEmail)

    let customer = await customerServiceTx
      .retrieveUnregisteredByEmail(validatedEmail)
      .catch(() => undefined)

    if (!customer) {
      customer = await customerServiceTx.create({ email: validatedEmail })
    }

    data[InputAlias.Cart].customer_id = customer.id
    data[InputAlias.Cart].email = customer.email
  }

  return data['cart']
}
