import { ModuleDefinition } from "../../types/global"

// EXAMPLE: WILL BE REMOVED BEFORE MERGING
const EventBus: ModuleDefinition = {
  key: "eventBus",
  registrationName: "eventBusService",
  defaultPackage: "@medusajs/event-bus-default",
  label: "EventBusService",
  canOverride: true,
}

export default EventBus
