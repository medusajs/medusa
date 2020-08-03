const inventorySync = container => {
  const brightpearlService = container.resolve("brightpearlService")
  const eventBus = container.resolve("eventBusService")
  const pattern = "43 4,10,14,20 * * *" // nice for tests "*/10 * * * * *"
  eventBus.createCronJob("inventory-sync", {}, pattern, brightpearlService.syncInventory())
}

export default inventorySync
