import Loader from "./loaders"
import EventBusService from "./services/event-bus"

export const service = EventBusService
export const loaders = [Loader]