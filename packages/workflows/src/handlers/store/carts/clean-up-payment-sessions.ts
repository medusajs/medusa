import { WorkflowArguments } from "../../../helper"

export async function cleanUpPaymentSessions({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: any
}) {
  const { transactionManager: manager } = context

  const preparedData = data["preparedData"]

  const cartService = container.resolve("cartService").withTransaction(manager)

  const cart = await cartService.retrieveWithTotals(
    preparedData.cart.id,
    {
      relations: [
        "items.variant.product.profiles",
        "items.adjustments",
        "discounts",
        "discounts.rule",
        "gift_cards",
        "shipping_methods",
        "shipping_methods.shipping_option",
        "billing_address",
        "shipping_address",
        "region",
        "region.tax_rates",
        "region.payment_providers",
        "payment_sessions",
        "customer",
      ],
    },
    { force_taxes: true }
  )

  await cartService.cleanUpPaymentSessions(cart)
}
