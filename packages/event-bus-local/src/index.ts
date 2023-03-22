import { ModulesSdkTypes } from "@medusajs/modules-sdk"
import Loader from "./loaders"
import LocalEventBus from "./services/event-bus-local"

export const service = LocalEventBus
export const loaders = [Loader]

const moduleDefinition: ModulesSdkTypes.ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
