import {
  Event,
  IEventBusModuleService,
  MedusaContainer,
  Subscriber,
} from "@medusajs/types"
import {
  isFileSkipped,
  kebabCase,
  Modules,
  registerDevServerResource,
} from "@medusajs/utils"
import { parse } from "path"
import { configManager } from "../config"
import { container } from "../container"
import { ResourceLoader } from "../utils/resource-loader"
import { SubscriberArgs, SubscriberConfig } from "./types"

type SubscriberHandler<T> = (args: SubscriberArgs<T>) => Promise<void>

type SubscriberModule<T> = {
  config: SubscriberConfig
  handler: SubscriberHandler<T>
}

export class SubscriberLoader extends ResourceLoader {
  protected resourceName = "subscriber"

  /**
   * The options of the plugin from which the subscribers are being loaded
   * @private
   */
  #pluginOptions: Record<string, unknown>

  /**
   * Map of subscribers descriptors to consume in the loader
   * @private
   */
  #subscriberDescriptors: Map<string, SubscriberModule<any>> = new Map()

  constructor(
    sourceDir: string | string[],
    options: Record<string, unknown> = {},
    container: MedusaContainer
  ) {
    super(sourceDir, container)
    this.#pluginOptions = options
  }

  protected async onFileLoaded(
    path: string,
    fileExports: Record<string, unknown>
  ) {
    if (isFileSkipped(fileExports)) {
      return
    }

    const isValid = this.validateSubscriber(fileExports, path)

    this.logger.debug(`Registering subscribers from ${path}.`)

    if (!isValid) {
      return
    }

    this.#subscriberDescriptors.set(path, {
      config: fileExports.config,
      handler: fileExports.default,
    })
  }

  private validateSubscriber(
    subscriber: any,
    path: string
  ): subscriber is {
    default: SubscriberHandler<unknown>
    config: SubscriberConfig
  } {
    const handler = subscriber.default

    if (!handler || typeof handler !== "function") {
      /**
       * If the handler is not a function, we can't use it
       */
      this.logger.warn(`The subscriber in ${path} is not a function. skipped.`)
      return false
    }

    const config = subscriber.config

    if (!config) {
      /**
       * If the subscriber is missing a config, we can't use it
       */
      this.logger.warn(
        `The subscriber in ${path} is missing a config. skipped.`
      )
      return false
    }

    if (!config.event) {
      /**
       * If the subscriber is missing an event, we can't use it.
       * In production we throw an error, else we log a warning
       */
      if (configManager.isProduction) {
        throw new Error(
          `The subscriber in ${path} is missing an event in the config.`
        )
      } else {
        this.logger.warn(
          `The subscriber in ${path} is missing an event in the config. skipped.`
        )
      }

      return false
    }

    const events = Array.isArray(config.event) ? config.event : [config.event]

    if (events.some((e: unknown) => !(typeof e === "string"))) {
      /**
       * If the subscribers event is not a string or an array of strings, we can't use it
       */
      this.logger.warn(
        `The subscriber in ${path} has an invalid event config. The event must be a string or an array of strings. skipped.`
      )
      return false
    }

    return true
  }

  private inferIdentifier<T>(
    fileName: string,
    { context }: SubscriberConfig,
    handler: SubscriberHandler<T>
  ) {
    /**
     * If subscriberId is provided, use that
     */
    if (context?.subscriberId) {
      return context.subscriberId
    }

    const handlerName = handler.name

    /**
     * If the handler is not anonymous, use the name
     */
    if (handlerName && !handlerName.startsWith("_default")) {
      return kebabCase(handlerName)
    }

    /**
     * If the handler is anonymous, use the file name
     */
    const idFromFile = parse(fileName).name
    return kebabCase(idFromFile)
  }

  createSubscriber<T = unknown>({
    fileName,
    config,
    handler,
  }: {
    fileName: string
    config: SubscriberConfig
    handler: SubscriberHandler<T>
  }) {
    const eventBusService: IEventBusModuleService = container.resolve(
      Modules.EVENT_BUS
    )

    const { event } = config

    const events = Array.isArray(event) ? event : [event]

    const subscriberId = this.inferIdentifier(fileName, config, handler)

    for (const e of events) {
      const subscriber = async (data: T) => {
        return await handler({
          event: { name: e, ...data } as unknown as Event<T>,
          container,
          pluginOptions: this.#pluginOptions,
        })
      }

      eventBusService.subscribe(e, subscriber as Subscriber, {
        ...config.context,
        subscriberId,
      })

      registerDevServerResource({
        type: "subscriber",
        id: subscriberId,
        sourcePath: fileName,
        subscriberId,
        events,
      })
    }
  }

  async load() {
    await super.discoverResources()

    for (const [
      fileName,
      { config, handler },
    ] of this.#subscriberDescriptors.entries()) {
      this.createSubscriber({
        fileName,
        config,
        handler,
      })
    }

    this.logger.debug(`Subscribers registered.`)

    /**
     * Return the file paths of the registered subscribers, to prevent the
     * backwards compatible loader from trying to register them.
     */
    return [...this.#subscriberDescriptors.keys()]
  }
}
