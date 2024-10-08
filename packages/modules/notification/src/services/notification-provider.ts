import {
  DAL,
  InferEntityType,
  NotificationTypes,
} from "@medusajs/framework/types"
import { MedusaError, ModulesSdkUtils } from "@medusajs/framework/utils"
import { NotificationProvider } from "@models"
import { NotificationProviderRegistrationPrefix } from "@types"

type InjectedDependencies = {
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
  protected providersCache: Map<
    string,
    InferEntityType<typeof NotificationProvider>
  >

  constructor(container: InjectedDependencies) {
    super(container)
    this.notificationProviderRepository_ =
      container.notificationProviderRepository
  }

  protected retrieveProviderRegistration(
    providerId: string
  ): NotificationTypes.INotificationProvider {
    try {
      return this.__container__[
        `${NotificationProviderRegistrationPrefix}${providerId}`
      ]
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a notification provider with id: ${providerId}`
      )
    }
  }

  async getProviderForChannels<
    TChannel = string | string[],
    TOutput = TChannel extends string[] ? Provider[] : Provider | undefined
  >(channels: TChannel): Promise<TOutput> {
    if (!this.providersCache) {
      const providers = await this.notificationProviderRepository_.find()

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
