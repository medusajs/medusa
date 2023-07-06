import { ModuleExports } from "@medusajs/modules-sdk"
import KafkaEventBusService from "./services/event-bus-kafka"

const service = KafkaEventBusService

const moduleDefinition: ModuleExports = {
  service,
  loaders: [],
}

export default moduleDefinition
export * from "./initialize"
export * from "./types"
