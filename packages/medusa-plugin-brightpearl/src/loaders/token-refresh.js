const REFRESH_CRON = process.env.BP_REFRESH_CRON || "5 4 * * */6"

const refreshToken = async (container) => {
  const logger = container.resolve("logger")
  const oauthService = container.resolve("oauthService")
  const eventBus = container.resolve("eventBusService")

  try {
    logger.info("registering refresh cron job BP")
    eventBus.createCronJob("refresh-token-bp", {}, REFRESH_CRON, async () => {
      const appData = await oauthService.retrieveByName("brightpearl")
      const data = appData.data
      if (data && data.refresh_token) {
        return oauthService.refreshToken("brightpearl", data.refresh_token)
      }
    })
  } catch (err) {
    if (err.name === "not_allowed") {
      return
    }
    throw err
  }
}

export default refreshToken
