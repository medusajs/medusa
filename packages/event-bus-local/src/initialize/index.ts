import { MedusaModule, Modules } from "@medusajs/modules-sdk"
import { IEventBusService } from "@medusajs/types"

export const initialize = async (): Promise<IEventBusService> => {
  const serviceKey = Modules.EVENT_BUS
  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/event-bus-local"
  )

  return loaded[serviceKey] as IEventBusService
}
