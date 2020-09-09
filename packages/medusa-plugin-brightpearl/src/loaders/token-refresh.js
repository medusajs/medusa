const REFRESH_CRON = process.env.BP_REFRESH_CRON || "5 4 * * */6"
const refreshToken = async (container) => {
  const oauthService = container.resolve("oauthService")
  const eventBus = container.resolve("eventBusService")

  try {
    const pattern = REFRESH_CRON
    eventBus.createCronJob("refresh-token-bp", {}, pattern, async () => {
      const data = await oauthService.retrieveByName("brightpearl")
      if (!data || !data.access_token) {
        await oauthService.refreshToken("brightpearl", data.refresh_token)
      }
    })
  } catch (err) {
    if (err.name === "not_allowed") {
      return
    }
    throw err
  }
}

export default inventorySync
