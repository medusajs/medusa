import { InputAlias } from "../../../definitions"
import { WorkflowArguments } from "../../../helper"

export async function createShippingMethods({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: any
}) {
  const { transactionManager: manager } = context

  const methodData = data[InputAlias.ValidatedShippingOptionData]
  const preparedData = data["preparedData"]
  const optionPrice = data[InputAlias.ShippingOptionPrice]

  const toCreate = [
    {
      option: preparedData.option,
      data: methodData,
      config: preparedData.shippingMethodConfig,
      price: optionPrice,
    },
  ]

  const shippingMethodService = container.resolve("shippingMethodService")

  const created = await shippingMethodService
    .withTransction(manager)
    .createShippingMethods(toCreate)

  return {
    created,
  }
}
