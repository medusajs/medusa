import "reflect-metadata"
import { EventEmitter } from "events"
import { MedusaContainer } from "../types/global"
import { Lifetime, LifetimeType } from "awilix"
import { EntityManager, InsertEvent, RemoveEvent, UpdateEvent } from "typeorm"

const EVENT_HANDLER_PROPERTY_NAME = "__custom_listener__"

/**
 * Lower case the first character of the input string.
 * @param str
 */
function lowerCaseFirst(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

interface Type<T = unknown> extends Function {
  new (...args: unknown[]): T
}

export type Constructor<T> = new (...args: unknown[]) => T

/**
 * A listener descriptor.
 */
type ListenerDescriptor<T = unknown> = {
  eventName: string | symbol
  propertyName: string
  classType: Type<T> & {
    LIFE_TIME?: LifetimeType
  }
}

/**
 * Extended event emitter to register methods that must be call when certain events are triggered and relay the handling to the API package
 */
class CustomEventEmitter extends EventEmitter {
  #listeners: Map<string | symbol, ListenerDescriptor[]> = new Map()

  constructor() {
    super()
  }

  /**
   * Register a new event handler.
   * @param eventName The name of the event that has to be triggered
   * @param propertyName The method name that will handle the event
   * @param classType The object that contains the property above
   */
  public register<T>(
    eventName: string | symbol,
    propertyName: string,
    classType: Type<T>
  ): void {
    const descriptor = { eventName, propertyName, classType }
    const listenerDescriptors = this.#listeners.get(descriptor.eventName) || []
    listenerDescriptors.push(descriptor)
    this.#listeners.set(eventName, listenerDescriptors)
  }

  /**
   * Apply all event handlers hold by the `listenerDescriptors`.
   * Only unregister and register again non singleton based event listeners.
   * No duplicate listener can exist on one handler.
   * @param container The IoC container that allow to resolve instance
   */
  public registerListeners(container: MedusaContainer): void {
    for (const [, listenerDescriptors] of [...this.#listeners]) {
      for (const listenerDescriptor of listenerDescriptors) {
        const { eventName, propertyName, classType } = listenerDescriptor
        const lifeTime = classType?.LIFE_TIME

        const className = classType.name
        const formattedClassName = lowerCaseFirst(className)
        const classInstance = container.resolve(`${formattedClassName}`)

        const listenerHandler = classInstance[propertyName].bind(classInstance)
        const listenerHandlerName = `${eventName.toString()}${
          classType.name
        }${propertyName}`

        Object.defineProperty(listenerHandler, EVENT_HANDLER_PROPERTY_NAME, {
          value: listenerHandlerName,
        })

        const alreadyRegisteredListenerHandlerIndex = this.rawListeners(
          eventName
        ).findIndex(
          (rawListenerHandler) =>
            rawListenerHandler[EVENT_HANDLER_PROPERTY_NAME] ===
            listenerHandlerName
        )

        if (
          (!lifeTime || lifeTime === Lifetime.SINGLETON) &&
          alreadyRegisteredListenerHandlerIndex !== -1
        ) {
          continue
        }

        if (alreadyRegisteredListenerHandlerIndex !== -1) {
          this.removeListener(
            eventName,
            this.rawListeners(eventName)[
              alreadyRegisteredListenerHandlerIndex
            ] as (...args: unknown[]) => void
          )
        }

        this.on(eventName, listenerHandler)
      }
    }
  }

  /**
   * Emit an asynchrone event entity based and wait for the result.
   * @param eventName The event that must be triggered
   * @param values The data that are passed to the event handler
   */
  public async emitAsync<T>(
    eventName: string | symbol,
    values: Record<string, unknown>
  ): Promise<T | never> {
    console.log("emit async", eventName)
    const eventListenerCount = this.listenerCount(eventName)
    if (!eventListenerCount) {
      return Promise.resolve(null)
    }

    return new Promise((resolve, reject) => {
      this.emit(eventName, {
        values,
        resolveOrReject: (err?: Error, res?: T) => {
          if (err) {
            return reject(err)
          }
          return resolve(res)
        },
      })
    })
  }
}

/**
 * @internal
 * Export the instance of the event emmiter.
 */
export const eventEmitter = new CustomEventEmitter()

export class OnMedusaEntityEvent {
  readonly #when: string
  #targetEntity: Type

  constructor(when?: string) {
    this.#when = when
  }

  static get Before(): OnMedusaEntityEvent {
    return this.build("Before")
  }

  static get After(): OnMedusaEntityEvent {
    return this.build("After")
  }

  private static build(when: string): OnMedusaEntityEvent {
    return new OnMedusaEntityEvent(when)
  }

  public InsertEvent<Entity extends Type>(entity: Entity): string {
    return `${this.#when}Insert${entity.name}`
  }

  public UpdateEvent<Entity extends Type>(entity: Entity): string {
    return `${this.#when}Update${entity.name}`
  }

  public RemoveEvent<Entity extends Type>(entity: Entity): string {
    return `${this.#when}Remove${entity.name}`
  }

  public Insert<TEntity extends Type>(
    entity: TEntity,
    options: EntityEventActionOptions = { async: false }
  ): MethodDecorator {
    return this.buildDecorator("Insert", entity, options)
  }

  public Update<TEntity extends Type>(
    entity: TEntity,
    options: EntityEventActionOptions = { async: false }
  ): MethodDecorator {
    return this.buildDecorator("Update", entity, options)
  }

  public Remove<TEntity extends Type>(
    entity: TEntity,
    options: EntityEventActionOptions = { async: false }
  ): MethodDecorator {
    return this.buildDecorator("Remove", entity, options)
  }

  private buildDecorator<TEntity extends Type>(
    action: EntityActions,
    entity: TEntity,
    options: EntityEventActionOptions = { async: false }
  ) {
    this.#targetEntity = entity
    return OnMedusaEntityEventDecorator(
      `${this.#when}${action}${entity.name}`,
      entity,
      options
    )
  }
}

export type EntityEventActionOptions = {
  async: boolean
}

export type EntityActions = "Insert" | "Update" | "Remove"

/**
 * Event types that can be emitted.
 */
export type EntityEventType<
  Entity,
  TEntityActions extends EntityActions
> = TEntityActions extends "Insert"
  ? InsertEvent<Entity>
  : TEntityActions extends "Update"
  ? UpdateEvent<Entity>
  : RemoveEvent<Entity>

/**
 * The arguments expected by the {@link OnMedusaEntityEvent} decorator.
 */
export type MedusaEventEmittedParams<
  Entity,
  TEntityActions extends EntityActions
> = {
  values: MedusaEventHandlerParams<Entity, TEntityActions>
  resolveOrReject: (err?: Error, res?: unknown) => void
}

/**
 * The arguments expected by the event handler.
 */
export type MedusaEventHandlerParams<
  Entity,
  TEntityActions extends EntityActions
> = {
  event: EntityEventType<Entity, TEntityActions>
  transactionalEntityManager?: EntityManager
}

/**
 * Allow to decorate a class method to register it as an event handler for an entity event.
 * @param eventName The event that we are listening to
 * @param targetEntity The entity for which the event is triggered
 * @param async Should the event be awaiting the result
 * @param customMetatype The key that represent the class in the container it belongs to (Used to resolve the real instance)
 */
function OnMedusaEntityEventDecorator(
  eventName: string,
  targetEntity: Type,
  { async }: { async: boolean } = {
    async: false,
  }
): MethodDecorator {
  return (
    target: Type, // Target Class
    propertyKey: string, // Method name
    descriptor: PropertyDescriptor
  ): void => {
    const originalMethod = descriptor.value
    descriptor.value = async function <Entity>(
      ...args: unknown[]
    ): Promise<void> {
      const { values, resolveOrReject } =
        args.pop() as MedusaEventEmittedParams<Entity, EntityActions>

      const promise = originalMethod.apply(this, [values])
      if (async) {
        return promise
          .then((res: unknown) => {
            return resolveOrReject(null, res)
          })
          .catch((err: Error) => {
            return resolveOrReject(err)
          })
      } else {
        return resolveOrReject()
      }
    }

    eventEmitter.register(
      eventName, // Event Name
      propertyKey, // Method Name
      target.constructor as Type // Class Name
    )
  }
}
