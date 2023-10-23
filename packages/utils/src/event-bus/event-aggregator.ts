import { IEventBusModuleService, Message } from "@medusajs/types"

export interface EventAggregatorFormat {
  groupBy: string[]
  sortBy: { [key: string]: string[] | string | number }
}

export class EventAggregator {
  private events: Message<unknown>[]
  private eventBusModule_: IEventBusModuleService

  constructor(eventBusModule: IEventBusModuleService) {
    this.events = []
    this.eventBusModule_ = eventBusModule
  }

  emit(event: Message<unknown> | Message<unknown>[]): void {
    if (Array.isArray(event)) {
      this.events.push(...event)
    } else {
      this.events.push(event)
    }
  }

  async publishEvents(format: EventAggregatorFormat): Promise<void> {
    const { groupBy, sortBy } = format

    this.events.sort((a, b) => this.compareEvents(a, b, sortBy))

    const groupedEvents = this.events.reduce<{
      [key: string]: Message<unknown>[]
    }>((acc, event) => {
      const key = groupBy
        .map((field) => this.getValueFromPath(event, field))
        .join("-")
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(event)
      return acc
    }, {})

    const promises: Promise<void>[] = []
    for (const group of Object.keys(groupedEvents)) {
      promises.push(this.eventBusModule_.emit(groupedEvents[group]))
    }

    await Promise.all(promises)

    this.events = []
  }

  private getValueFromPath(obj: any, path: string): any {
    const keys = path.split(".")
    for (const key of keys) {
      obj = obj[key]
      if (obj === undefined) break
    }
    return obj
  }

  private compareEvents(
    a: Message<unknown>,
    b: Message<unknown>,
    sortBy: EventAggregatorFormat["sortBy"]
  ): number {
    for (const key of Object.keys(sortBy)) {
      const orderCriteria = sortBy[key]
      const valueA = this.getValueFromPath(a, key)
      const valueB = this.getValueFromPath(b, key)

      // User defined order
      if (Array.isArray(orderCriteria)) {
        const indexA = orderCriteria.indexOf(valueA)
        const indexB = orderCriteria.indexOf(valueB)

        if (indexA === indexB) {
          continue
        } else if (indexA === -1) {
          return 1
        } else if (indexB === -1) {
          return -1
        } else {
          return indexA - indexB
        }
      } else {
        // Ascending or descending order
        let orderMultiplier = 1
        if (orderCriteria === "desc" || orderCriteria === -1) {
          orderMultiplier = -1
        }

        if (valueA === valueB) {
          continue
        } else if (valueA < valueB) {
          return -1 * orderMultiplier
        } else {
          return 1 * orderMultiplier
        }
      }
    }
    return 0
  }
}
