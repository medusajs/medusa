import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { IEventBusService } from "@medusajs/types"
import { KafkaModuleOptions } from "../types"

export const initialize = async (
  options?: KafkaModuleOptions | ExternalModuleDeclaration
): Promise<IEventBusService> => {
  const serviceKey = Modules.EVENT_BUS
  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/event-bus-kafka",
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    undefined
  )

  return loaded[serviceKey] as IEventBusService
}
