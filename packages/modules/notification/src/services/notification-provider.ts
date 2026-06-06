import {
  DAL,
  InferEntityType,
  Logger,
  NotificationTypes,
} from "@zjedene-medusa/framework/types"
import { ModulesSdkUtils } from "@zjedene-medusa/framework/utils"
import { NotificationProvider } from "@models"
import { NotificationProviderRegistrationPrefix } from "@types"

type InjectedDependencies = {
  logger?: Logger
  notificationProviderRepository: DAL.RepositoryService<
    InferEntityType<typeof NotificationProvider>
  >
  [
    key: `${typeof NotificationProviderRegistrationPrefix}${string}`
  ]: NotificationTypes.INotificationProvider
}

type Provider = InferEntityType<typeof NotificationProvider>

export default class NotificationProviderService extends ModulesSdkUtils.MedusaInternalService<
  InjectedDependencies,
  typeof NotificationProvider
>(NotificationProvider) {
  protected readonly notificationProviderRepository_: DAL.RepositoryService<
    InferEntityType<typeof NotificationProvider>
  >

  // We can store the providers in a memory since they can only be registered on startup and not changed during runtime

  #logger: Logger

  protected providersCache: Map<
    string,
    InferEntityType<typeof NotificationProvider>
  >

  constructor(container: InjectedDependencies) {
    super(container)
    this.notificationProviderRepository_ =
      container.notificationProviderRepository
    this.#logger = container["logger"]
      ? container.logger
      : (console as unknown as Logger)
  }

  protected retrieveProviderRegistration(
    providerId: string
  ): NotificationTypes.INotificationProvider {
    try {
      return this.__container__[
        `${NotificationProviderRegistrationPrefix}${providerId}`
      ]
    } catch (err) {
      if (err.name === "AwilixResolutionError") {
        const errMessage = `
Unable to retrieve the notification provider with id: ${providerId}
Please make sure that the provider is registered in the container and it is configured correctly in your project configuration file.`

        // Log full error for debugging
        this.#logger.error(`AwilixResolutionError: ${err.message}`, err)

        throw new Error(errMessage)
      }

      const errMessage = `Unable to retrieve the notification provider with id: ${providerId}, the following error occurred: ${err.message}`
      this.#logger.error(errMessage)

      throw new Error(errMessage)
    }
  }

  async getProviderForChannels<
    TChannel = string | string[],
    TOutput = TChannel extends string[] ? Provider[] : Provider | undefined
  >(channels: TChannel): Promise<TOutput> {
    if (!this.providersCache) {
      const providers = await this.notificationProviderRepository_.find({
        where: { is_enabled: true },
      })

      this.providersCache = new Map(
        providers.flatMap((provider) =>
          provider.channels.map((c) => [c, provider])
        )
      )
    }

    const normalizedChannels = Array.isArray(channels) ? channels : [channels]
    const results = normalizedChannels
      .map((channel) => this.providersCache.get(channel))
      .filter(Boolean)

    return (Array.isArray(channels) ? results : results[0]) as TOutput
  }

  async send(
    provider: InferEntityType<typeof NotificationProvider>,
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    const providerHandler = this.retrieveProviderRegistration(provider.id)
    return await providerHandler.send(notification)
  }
}
