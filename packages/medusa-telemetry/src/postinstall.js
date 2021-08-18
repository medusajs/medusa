const { isCI } = require("./util/is-ci")

try {
  const showAnalyticsNotification = require(`./util/show-notification`)
  const Store = require(`./store`)

  const eventStorage = new Store()
  const disabled = eventStorage.disabled_
  const enabledInConfig = eventStorage.getConfig(`telemetry.enabled`)
  if (enabledInConfig === undefined && !disabled && !isCI()) {
    showAnalyticsNotification()
  }
} catch (e) {
  // ignore
}
