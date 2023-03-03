import Loader from "./loaders"
import LocalEventBus from "./services/event-bus-local"

export const services = [LocalEventBus]
export const loaders = [Loader]

export default {
  services,
  loaders,
}
