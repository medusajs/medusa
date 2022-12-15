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
    key: "cronJob",
    registrationName: "cronJobService",
    defaultPackage: "@medusajs/cron-jon-local",
    label: "CronJobService",
    canOverride: true,
    isRequired: false,
  },
]

export default MODULE_DEFINITIONS
