import Telemeter from "./telemeter"
import createFlush from "./util/create-flush"

/**
 * Creating the telemeter reads its config from disk and inspects the
 * environment, and tracking writes to the outbox synchronously. Neither should
 * happen while the importing process boots, so the telemeter is created on
 * first use and tracked events are processed shortly after, or on exit.
 */
const TRACKING_DELAY_MS = 2000

let telemeter
const pending = []
let drainTimer

function getTelemeter() {
  telemeter ??= new Telemeter()
  return telemeter
}

function drain() {
  clearTimeout(drainTimer)
  drainTimer = undefined
  while (pending.length) {
    pending.shift()(getTelemeter())
  }
}

function defer(fn) {
  pending.push(fn)
  drainTimer ??= setTimeout(drain, TRACKING_DELAY_MS).unref()
}

process.on(`exit`, () => {
  drain()
  createFlush(getTelemeter().isTrackingEnabled())?.()
})

export const track = (event, data = {}) => {
  defer((t) => t.track(event, data))
}

export const setTelemetryEnabled = (enabled = true) => {
  getTelemeter().setTelemetryEnabled(enabled)
}

export function trackFeatureFlag(flag) {
  defer((t) => t.trackFeatureFlag(flag))
}

export function trackInstallation(installation, type) {
  defer((t) => {
    switch (type) {
      case `plugin`:
        t.trackPlugin(installation)
        break
      case `module`:
        t.trackModule(installation)
        break
    }
  })
}

export { default as Store } from "./store"
export { default as Telemeter } from "./telemeter"
