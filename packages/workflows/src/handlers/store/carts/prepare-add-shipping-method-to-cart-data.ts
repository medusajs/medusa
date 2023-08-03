import { WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../../helper"

type AddShippingMethodInputData =
  WorkflowTypes.CartTypes.AddShippingMethodToCartDTO

const AddShippingMethodInputDataAlias = "addShippingMethodInputData"

export async function prepareAddShippingMethodToCartWorkflowData({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: { [AddShippingMethodInputDataAlias]: AddShippingMethodInputData }
}) {
  const { transactionManager: manager } = context

  const data_ = data[AddShippingMethodInputDataAlias]

  const cartService = container.resolve("cartService").withTransaction(manager)
  const shippingOptionService = container
    .resolve("shippingOptionService")
    .withTransaction(manager)
  const customShippingOptionService = container
    .resolve("customShippingOptionService")
    .withTransaction(manager)

  const cart = await cartService.retrieveWithTotals(data_.cart_id, {
    relations: [
      "shipping_methods",
      "shipping_methods.shipping_option",
      "items.variant.product.profiles",
      "payment_sessions",
    ],
  })

  const options = await customShippingOptionService.list({
    cart_id: data_.cart_id,
  })

  const customShippingOption = cartService.findCustomShippingOption(
    options,
    data_.option_id
  )

  const shippingMethodConfig = customShippingOption
    ? { cart_id: cart.id, price: customShippingOption.price }
    : { cart }

  const option = await shippingOptionService.retrieve(data_.option_id, {
    relations: ["requirements"],
  })

  return {
    shippingMethodConfig,
    cart,
    option,
    shippingMethodData: data_.data,
  }
}

prepareAddShippingMethodToCartWorkflowData.aliases = {
  AddShippingMethodInputDataAlias: AddShippingMethodInputDataAlias,
}
