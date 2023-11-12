import { ShippingMethodDTO, ShippingOptionDTO } from "@medusajs/types"
import { createStep } from "../../../../../utils/composer"

type InvokeInput = {
  option: ShippingOptionDTO
  data: Record<string, unknown>
  config: Record<string, unknown>
  price: number
}

type InvokeOutput = {
  shippingMethods: ShippingMethodDTO[]
  compensationData: { shippingMethods: ShippingMethodDTO[] }
}

type CompensateInput = {
  shippingMethods: ShippingMethodDTO[]
}

type CompensateOutput = void

async function invoke(input, data): Promise<InvokeOutput> {
  const { manager, container } = input

  const toCreate = [{ ...data }]

  const shippingOptionService = container.resolve("shippingOptionService")

  const shippingMethods = await shippingOptionService
    .withTransaction(manager)
    .createShippingMethods(toCreate)

  return { shippingMethods, compensationData: { shippingMethods } }
}

async function compensate(input, data): Promise<CompensateOutput> {
  const { container, context } = input
  const { manager } = context
  const { shippingMethods } = data

  const shippingOptionServiceTx = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  await shippingOptionServiceTx.deleteShippingMethods(shippingMethods)
}

export const createShippingMethodsStep = createStep(
  "createShippingMethods",
  invoke,
  compensate
)
