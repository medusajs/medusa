import { MedusaContainer, Subscriber } from "@medusajs/types"
import { kebabCase } from "@medusajs/utils"
import { readdir } from "fs/promises"
import { join } from "path"

import { EventBusService } from "../../../services"
import logger from "../../logger"

type Config = {
  event: string | string[]
  subscriberId?: string
}

type Handler<T> = (
  data: T,
  eventName: string,
  container: MedusaContainer
) => Promise<void>

type SubscriberConfig<T> = {
  config: Config
  handler: Handler<T>
}

export class SubscriberRegistrar {
  protected container_: MedusaContainer
  protected pluginOptions_: Record<string, unknown>
  protected activityId_: string
  protected rootDir_: string
  protected excludes: RegExp[] = [
    /\.DS_Store/,
    /(\.ts\.map|\.js\.map|\.d\.ts)/,
    /^_[^/\\]*(\.[^/\\]+)?$/,
  ]

  protected subscriberDescriptors_: Map<string, SubscriberConfig<any>> =
    new Map()

  constructor(
    rootDir: string,
    container: MedusaContainer,
    options: Record<string, unknown> = {},
    activityId: string
  ) {
    this.rootDir_ = rootDir
    this.pluginOptions_ = options
    this.container_ = container
    this.activityId_ = activityId
  }

  private validateSubscriber(
    subscriber: any
  ): subscriber is { default: Handler<unknown>; config: Config } {
    const handler = subscriber.default

    if (!handler || typeof handler !== "function") {
      /**
       * If the handler is not a function, we can't use it
       */
      return false
    }

    const config = subscriber.config

    if (!config) {
      /**
       * If the subscriber is missing a config, we can't use it
       */
      logger.warn(`The subscriber is missing a config. Skipping registration.`)
      return false
    }

    if (!config.event) {
      /**
       * If the subscriber is missing an event, we can't use it
       */
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
      return false
    }

    return true
  }

  private async createDescriptor(absolutePath: string, entry: string) {
    return await import(absolutePath).then((module_) => {
      const isValid = this.validateSubscriber(module_)

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
      await readdir(dirPath, { withFileTypes: true }).then((entries) => {
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
              return this.createMap(fullPath)
            }

            return this.createDescriptor(fullPath, entry.name)
          })
      })
    )
  }

  private inferIdentifier<T>(
    fileName: string,
    config: Config,
    handler: Handler<T>
  ) {
    const { subscriberId } = config

    /**
     * If subscriberId is provided, use that
     */
    if (subscriberId) {
      return subscriberId
    }

    const handlerName = handler.name

    /**
     * If the handler is not anonymous, use the name
     */
    if (handlerName) {
      return kebabCase(handlerName)
    }

    /**
     * If the handler is anonymous, use the file name
     */
    return kebabCase(fileName)
  }

  private async createSubscriber<T>({
    fileName,
    config,
    handler,
  }: {
    fileName: string
    config: Config
    handler: Handler<T>
  }) {
    const eventBusService: EventBusService =
      this.container_.resolve("eventBusService")

    const { event } = config

    const events = Array.isArray(event) ? event : [event]

    const subscriber: Subscriber<T> = async (data: T, eventName: string) => {
      return handler(data, eventName, this.container_)
    }

    const subscriberId = this.inferIdentifier(fileName, config, handler)

    for (const e of events) {
      eventBusService.subscribe(e, subscriber as Subscriber<unknown>, {
        subscriberId,
      })
    }
  }

  async register() {
    let hasSubscriberDir = false

    try {
      await readdir(this.rootDir_)
      hasSubscriberDir = true
    } catch (err) {
      hasSubscriberDir = false
    }

    if (!hasSubscriberDir) {
      return
    }

    await this.createMap(this.rootDir_)

    const map = this.subscriberDescriptors_

    for (const [fileName, { config, handler }] of map.entries()) {
      await this.createSubscriber({
        fileName,
        config,
        handler,
      })
    }
  }
}
