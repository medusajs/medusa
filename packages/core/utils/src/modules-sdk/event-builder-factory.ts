import { Context, EventBusTypes } from "@medusajs/types"
import { buildModuleResourceEventName } from "../event-bus/utils"

// TODO should that move closer to the event bus? and maybe be rename to modulemoduleEventBuilderFactory

/**
 *
 * Factory function to create event builders for different entities
 *
 * @example
 * const createdFulfillment = moduleEventBuilderFactory({
 *   source: Modules.FULFILLMENT,
 *   action: CommonEvents.CREATED,
 *   object: "fulfillment",
 *   eventsEnum: FulfillmentEvents,
 * })
 *
 * createdFulfillment({
 *   data,
 *   sharedContext,
 * })
 *
 * @param action
 * @param object
 * @param eventsEnum
 * @param service
 */
export function moduleEventBuilderFactory({
  action,
  object,
  eventName,
  source,
}: {
  action: string
  object: string
  eventName?: string
  source: string
}) {
  return function ({
    data,
    sharedContext,
  }: {
    data: { id: string } | { id: string }[]
    sharedContext: Context
  }) {
    data = Array.isArray(data) ? data : [data]

    if (!data.length) {
      return
    }

    const aggregator = sharedContext.messageAggregator!
    const messages: EventBusTypes.RawMessageFormat[] = []

    if (!eventName) {
      eventName = buildModuleResourceEventName({
        prefix: source,
        objectName: object,
        action,
      })
    }

    data.forEach((dataItem) => {
      messages.push({
        source,
        action,
        context: sharedContext,
        data: { id: dataItem.id },
        eventName: eventName!,
        object,
      })
    })

    aggregator.saveRawMessageData(messages)
  }
}
