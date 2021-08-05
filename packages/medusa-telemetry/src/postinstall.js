try {
  const showAnalyticsNotification = require(`./util/show-notification`)
  const Store = require(`./store`)

  const eventStorage = new Store()
  const disabled = eventStorage.disabled_
  const enabledInConfig = eventStorage.getConfig(`telemetry.enabled`)
  if (enabledInConfig === undefined && !disabled) {
    showAnalyticsNotification()
  }
} catch (e) {
  // ignore
}
