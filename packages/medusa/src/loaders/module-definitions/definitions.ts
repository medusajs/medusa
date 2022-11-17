import { ModuleDefinition } from "../../types/global"

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    // Example, will be removed before merge
    key: "eventBus",
    registrationName: "eventBusService",
    defaultPackage: "@medusajs/event-bus-default",
    label: "EventBusService",
    canOverride: true,
    isRequired: false,
  },
]

export default MODULE_DEFINITIONS
