import { IEventBusModuleService } from "@medusajs/types"
import { EventEmitter } from "events"

// Allows you to wait for all subscribers to execute for a given event. Only works with the local event bus.
export const waitSubscribersExecution = (
  eventName: string,
  eventBus: IEventBusModuleService
) => {
  const subscriberPromises: Promise<any>[] = []
  const eventEmitter: EventEmitter = (eventBus as any).eventEmitter_

  // If there are no existing listeners, resolve once the event happens. Otherwise, wrap the existing subscribers in a promise and resolve once they are done.
  if (!eventEmitter.listeners(eventName).length) {
    let ok, nok
    const promise = new Promise((resolve, reject) => {
      ok = resolve
      nok = reject
    })

    subscriberPromises.push(promise)
    eventEmitter.on(eventName, ok)
  } else {
    eventEmitter.listeners(eventName).forEach((listener: any) => {
      eventEmitter.removeListener(eventName, listener)

      let ok, nok
      const promise = new Promise((resolve, reject) => {
        ok = resolve
        nok = reject
      })
      subscriberPromises.push(promise)

      const newListener = async (...args2) => {
        return await listener.apply(eventBus, args2).then(ok).catch(nok)
      }

      eventEmitter.on(eventName, newListener)
    })
  }

  return Promise.all(subscriberPromises)
}
