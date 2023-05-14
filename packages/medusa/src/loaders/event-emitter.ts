import { eventEmitter } from "../utils/event-emitter"
import { MedusaContainer } from "../types/global"

const eventEmitterLoader = ({ container }: { container: MedusaContainer }) => {
  eventEmitter.registerListeners(container)
}

export default eventEmitterLoader
