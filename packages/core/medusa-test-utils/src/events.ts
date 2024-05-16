import { IEventBusModuleService } from "@medusajs/types"

// Allows you to wait for all subscribers to execute for a given event. Only works with the local event bus.
export const waitSubscribersExecution = (
  eventName: string,
  eventBus: IEventBusModuleService
) => {
  const subscriberPromises: Promise<any>[] = []

  ;(eventBus as any).eventEmitter_.listeners(eventName).forEach((listener) => {
    ;(eventBus as any).eventEmitter_.removeListener("order.created", listener)

    let ok, nok
    const promise = new Promise((resolve, reject) => {
      ok = resolve
      nok = reject
    })
    subscriberPromises.push(promise)

    const newListener = async (...args2) => {
      return await listener.apply(eventBus, args2).then(ok).catch(nok)
    }

    ;(eventBus as any).eventEmitter_.on("order.created", newListener)
  })

  return Promise.all(subscriberPromises)
}
