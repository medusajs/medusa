import Telemeter from "./telemeter"
import createFlush from "./util/create-flush"

const telemeter = new Telemeter()

export const flush = createFlush(telemeter.isTrackingEnabled())

process.on(`exit`, flush)

export const track = (event, data = {}) => {
  telemeter.track(event, data)
}

export { default as Telemeter } from "./telemeter"
