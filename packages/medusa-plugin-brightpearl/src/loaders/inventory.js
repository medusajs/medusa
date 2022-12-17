const inventorySync = async (container, options) => {
  if (!options.inventory_sync_cron) {
    return
  } else {
    const brightpearlService = container.resolve("brightpearlService")
    const backgroundJobService = container.resolve("backgroundJobService")
    try {
      const pattern = options.inventory_sync_cron
      backgroundJobService.createBackgroundJob(
        "inventory-sync",
        {},
        pattern,
        () => brightpearlService.syncInventory()
      )
    } catch (err) {
      if (err.name === "not_allowed") {
        return
      }
      throw err
    }
  }
}

export default inventorySync
