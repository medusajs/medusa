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
  {
    key: "backgroundJob",
    registrationName: "backgroundJobService",
    defaultPackage: "@medusajs/background-job-local",
    label: "BackgroundJobService",
    canOverride: true,
    isRequired: false,
  },
]

export default MODULE_DEFINITIONS
