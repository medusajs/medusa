import {
  Event,
  IEventBusModuleService,
  MedusaContainer,
  Subscriber,
} from "@medusajs/types"
import { kebabCase, ModuleRegistrationName } from "@medusajs/utils"
import { readdir } from "fs/promises"
import { extname, join, sep } from "path"

import { SubscriberArgs, SubscriberConfig } from "../../../types/subscribers"
import { logger } from "@medusajs/framework"

type SubscriberHandler<T> = (args: SubscriberArgs<T>) => Promise<void>

type SubscriberModule<T> = {
  config: SubscriberConfig
  handler: SubscriberHandler<T>
}

export class SubscriberLoader {
  protected container_: MedusaContainer
  protected pluginOptions_: Record<string, unknown>
  protected rootDir_: string
  protected excludes: RegExp[] = [
    /\.DS_Store/,
    /(\.ts\.map|\.js\.map|\.d\.ts|\.md)/,
    /^_[^/\\]*(\.[^/\\]+)?$/,
  ]

  protected subscriberDescriptors_: Map<string, SubscriberModule<any>> =
    new Map()

  constructor(
    rootDir: string,
    container: MedusaContainer,
    options: Record<string, unknown> = {}
  ) {
    this.rootDir_ = rootDir
    this.pluginOptions_ = options
    this.container_ = container
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
      logger.warn(`The subscriber in ${path} is not a function.`)
      return false
    }

    const config = subscriber.config

    if (!config) {
      /**
       * If the subscriber is missing a config, we can't use it
       */
      logger.warn(`The subscriber in ${path} is missing a config.`)
      return false
    }

    if (!config.event) {
      /**
       * If the subscriber is missing an event, we can't use it.
       * In production we throw an error, else we log a warning
       */
      if (process.env.NODE_ENV === "production") {
        throw new Error(`The subscriber in ${path} is missing an event.`)
      } else {
        logger.warn(`The subscriber in ${path} is missing an event.`)
      }

      return false
    }

    if (
      typeof config.event !== "string" &&
      !Array.isArray(config.event) &&
      !config.event.every((e: unknown) => typeof e === "string")
    ) {
      /**
       * If the subscribers event is not a string or an array of strings, we can't use it
       */
      logger.warn(
        `The subscriber in ${path} has an invalid event. The event must be a string or an array of strings.`
      )
      return false
    }

    return true
  }

  private async createDescriptor(absolutePath: string, entry: string) {
    return await import(absolutePath).then((module_) => {
      const isValid = this.validateSubscriber(module_, absolutePath)

      if (!isValid) {
        return
      }

      this.subscriberDescriptors_.set(absolutePath, {
        config: module_.config,
        handler: module_.default,
      })
    })
  }

  private async createMap(dirPath: string) {
    await Promise.all(
      await readdir(dirPath, { withFileTypes: true }).then(async (entries) => {
        return entries
          .filter((entry) => {
            if (
              this.excludes.length &&
              this.excludes.some((exclude) => exclude.test(entry.name))
            ) {
              return false
            }

            return true
          })
          .map(async (entry) => {
            const fullPath = join(dirPath, entry.name)

            if (entry.isDirectory()) {
              return await this.createMap(fullPath)
            }

            return await this.createDescriptor(fullPath, entry.name)
          })
      })
    )
  }

  private inferIdentifier<T>(
    fileName: string,
    config: SubscriberConfig,
    handler: SubscriberHandler<T>
  ) {
    const { context } = config

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
    const idFromFile =
      fileName.split(sep).pop()?.replace(extname(fileName), "") ?? ""

    return kebabCase(idFromFile)
  }

  private createSubscriber<T = unknown>({
    fileName,
    config,
    handler,
  }: {
    fileName: string
    config: SubscriberConfig
    handler: SubscriberHandler<T>
  }) {
    const eventBusService: IEventBusModuleService = this.container_.resolve(
      ModuleRegistrationName.EVENT_BUS
    )

    const { event } = config

    const events = Array.isArray(event) ? event : [event]

    const subscriberId = this.inferIdentifier(fileName, config, handler)

    for (const e of events) {
      const subscriber = async (data: T) => {
        return await handler({
          event: { name: e, ...data } as unknown as Event<T>,
          container: this.container_,
          pluginOptions: this.pluginOptions_,
        })
      }

      eventBusService.subscribe(e, subscriber as Subscriber, {
        ...(config.context ?? {}),
        subscriberId,
      })
    }
  }

  async load() {
    let hasSubscriberDir = false

    try {
      await readdir(this.rootDir_)
      hasSubscriberDir = true
    } catch (err) {
      logger.debug(`No subscriber directory found in ${this.rootDir_}`)
      hasSubscriberDir = false
    }

    if (!hasSubscriberDir) {
      return
    }

    await this.createMap(this.rootDir_)

    const map = this.subscriberDescriptors_

    for (const [fileName, { config, handler }] of map.entries()) {
      this.createSubscriber({
        fileName,
        config,
        handler,
      })
    }

    /**
     * Return the file paths of the registered subscribers, to prevent the
     * backwards compatible loader from trying to register them.
     */
    return [...map.keys()]
  }
}
