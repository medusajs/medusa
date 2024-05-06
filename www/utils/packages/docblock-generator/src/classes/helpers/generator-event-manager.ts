import EventEmitter from "events"

export enum GeneratorEvent {
  FINISHED_GENERATE_EVENT = "finished_generate",
}

/**
 * A class used to emit events during the lifecycle of the generator.
 */
class GeneratorEventManager {
  private eventEmitter: EventEmitter

  constructor() {
    this.eventEmitter = new EventEmitter()
  }

  /**
   * Emit an event to listeners.
   *
   * @param event - The event to emit.
   */
  emit(event: GeneratorEvent) {
    this.eventEmitter.emit(event)
  }

  /**
   * Add a listener to an event.
   *
   * @param event - The event to add a listener for.
   * @param handler - The handler of the event.
   */
  listen(event: GeneratorEvent, handler: () => void) {
    this.eventEmitter.on(event, handler)
  }
}

export default GeneratorEventManager
