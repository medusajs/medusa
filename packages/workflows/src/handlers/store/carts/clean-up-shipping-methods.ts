import { InputAlias } from "../../../definitions"
import { WorkflowArguments } from "../../../helper"

export async function cleanUpShippingMethods({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: any
}) {
  const { transactionManager: manager } = context

  const created = data[InputAlias.CreatedShippingMethods]
  const { cart } = data["preparedData"]

  const methods = created
  if (cart.shipping_methods?.length) {
    const shippingOptionServiceTx = container
      .resolve("shippingOptionService")
      .withTransaction(manager)

    for (const shippingMethod of cart.shipping_methods) {
      if (
        methods.some(
          (m) =>
            m.shipping_option.profile_id ===
            shippingMethod.shipping_option.profile_id
        )
      ) {
        await shippingOptionServiceTx.deleteShippingMethods(shippingMethod)
      }
    }
  }
}
