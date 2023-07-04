import TelemetryDispatcher from "./telemetry-dispatcher"

const MEDUSA_TELEMETRY_HOST = process.env.MEDUSA_TELEMETRY_HOST || ""
const MEDUSA_TELEMETRY_PATH = process.env.MEDUSA_TELEMETRY_PATH || ""

const dispatcher = new TelemetryDispatcher({
  host: MEDUSA_TELEMETRY_HOST,
  path: MEDUSA_TELEMETRY_PATH,
})
dispatcher.dispatch()
