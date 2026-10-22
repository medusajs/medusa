import type {
  CreateOrderTagDTO,
  IOrderModuleService,
  OrderTagDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createOrderTagsStepId = "create-order-tags"
/**
 * This step creates one or more order tags.
 *
 * Unlike `createProductTagsStep`, this step is a find-or-create rather than
 * a hard insert: when a given `value` already exists, the existing tag is
 * returned instead of attempting a second insert and hitting the
 * unique-constraint violation. This is required for the create-on-type tag
 * combobox UX - a client posting an already-used value should get the
 * existing tag back (and a 200), not an error.
 */
export const createOrderTagsStep = createStep(
  createOrderTagsStepId,
  async (data: CreateOrderTagDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const values = data.map((orderTag) => orderTag.value)
    const existingTags = values.length
      ? await service.listOrderTags({ value: values })
      : []
    const existingByValue = new Map(existingTags.map((tag) => [tag.value, tag]))

    const newData = data.filter(
      (orderTag) => !existingByValue.has(orderTag.value)
    )
    // Dedupe new values within the same request payload so we don't attempt
    // to insert the same value twice in one batch.
    const uniqueNewData = Array.from(
      new Map(newData.map((orderTag) => [orderTag.value, orderTag])).values()
    )

    const created = uniqueNewData.length
      ? await service.createOrderTags(uniqueNewData)
      : []
    const createdByValue = new Map(created.map((tag) => [tag.value, tag]))

    const result: OrderTagDTO[] = data.map((orderTag) => {
      return (
        existingByValue.get(orderTag.value) ??
        createdByValue.get(orderTag.value)!
      )
    })

    return new StepResponse(
      result,
      created.map((tag) => tag.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.deleteOrderTags(createdIds)
  }
)
