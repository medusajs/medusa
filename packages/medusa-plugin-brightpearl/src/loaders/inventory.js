const inventorySync = async (container, options) => {
  if (!options.inventory_sync_cron) {
    return
  } else {
    const brightpearlService = container.resolve("brightpearlService")
    const jobSchedulerService = container.resolve("jobSchedulerService")
    try {
      const pattern = options.inventory_sync_cron
      jobSchedulerService.create("inventory-sync", {}, pattern, () =>
        brightpearlService.syncInventory()
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
