import { Context, EventBusTypes } from "@medusajs/types"

export function eventBuilderFactory({
  isMainEntity,
  action,
  object,
  eventsEnum,
  service,
}: {
  isMainEntity?: boolean
  action: string
  object: string
  eventsEnum: Record<string, string>
  service: string
}) {
  return function ({
    data,
    sharedContext,
  }: {
    data: { id: string }[]
    sharedContext: Context
  }) {
    if (!data.length) {
      return
    }

    const aggregator = sharedContext.messageAggregator!
    const messages: EventBusTypes.RawMessageFormat[] = []

    data.forEach((dataItem) => {
      messages.push({
        service,
        action,
        context: sharedContext,
        data: { id: dataItem.id },
        eventName: isMainEntity
          ? eventsEnum[action]
          : eventsEnum[`${object}_${action}`],
        object,
      })
    })

    aggregator.saveRawMessageData(messages)
  }
}
