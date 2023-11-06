import { Subscriber } from "@medusajs/types"
import { kebabCase } from "@medusajs/utils"
import { readdir } from "fs/promises"
import { join } from "path"

import { EventBusService } from "../../../services"
import { MedusaContainer } from "../../../types/global"

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
    options: Record<string, unknown> = {}
  ) {
    this.rootDir_ = rootDir
    this.pluginOptions_ = options
    this.container_ = container
  }

  private async validateSubscriber() {
    return null
  }

  private async createDescriptor(absolutePath: string, entry: string) {
    return await import(absolutePath).then((module_) => {
      // Check if module has a default export of type function
      const handler = module_.default

      if (typeof handler !== "function") {
        throw new Error(
          `Subscriber ${absolutePath} does not have a default export of type function`
        )
      }

      // check if the handler accepts more than 3 arguments
      if (handler.length > 3) {
        throw new Error(
          `Subscriber ${absolutePath} has a default export that accepts more than 3 arguments`
        )
      }

      // Check if module has a named export called config
      const config = module_.config

      if (!config) {
        throw new Error(
          `Subscriber ${absolutePath} is missing a named export called config`
        )
      }

      this.subscriberDescriptors_.set(absolutePath, {
        config,
        handler,
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
          .flat(Infinity)
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
