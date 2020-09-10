const REFRESH_CRON = process.env.BP_REFRESH_CRON || "5 4 * * */6"

const refreshToken = async (container) => {
  const logger = container.resolve("logger")
  const oauthService = container.resolve("oauthService")
  const eventBus = container.resolve("eventBusService")

  try {
    logger.info("registering refresh cron job BP")
    eventBus.createCronJob("refresh-token-bp", {}, REFRESH_CRON, async () => {
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

export default refreshToken
