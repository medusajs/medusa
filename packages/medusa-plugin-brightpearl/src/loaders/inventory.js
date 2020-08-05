const inventorySync = async (container) => {
  const brightpearlService = container.resolve("brightpearlService")
  const eventBus = container.resolve("eventBusService")

  try {
    const client = await brightpearlService.getClient()
    const pattern = "43 4,10,14,20 * * *" // nice for tests "*/10 * * * * *"
    eventBus.createCronJob(
      "inventory-sync",
      {},
      pattern,
      brightpearlService.syncInventory()
    )
  } catch (err) {
    if (err.name === "not_allowed") {
      return
    }
    throw err
  }
}

export default inventorySync
