import { ModuleDefinition } from "../../types/global"

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    key: "eventBus",
    registrationName: "eventBusService",
    defaultPackage: "@medusajs/event-bus-local",
    label: "EventBusService",
    canOverride: true,
    isRequired: true,
  },
]

export default MODULE_DEFINITIONS
