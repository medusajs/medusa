import Loader from "./loaders"
import RedisEventBusService from "./services/event-bus-redis"

const service = RedisEventBusService
const loaders = [Loader]

export default {
  service,
  loaders,
}
