import { DAL, InferEntityType, NotificationTypes } from "@medusajs/types"
import { MedusaError, ModulesSdkUtils } from "@medusajs/utils"
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

export default class NotificationProviderService extends ModulesSdkUtils.MedusaInternalService<InjectedDependencies>(
  NotificationProvider
) {
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

  async getProviderForChannel(
    channel: string
  ): Promise<InferEntityType<typeof NotificationProvider> | undefined> {
    if (!this.providersCache) {
      const providers = await this.notificationProviderRepository_.find()
      this.providersCache = new Map(
        providers.flatMap((provider) =>
          provider.channels.map((c) => [c, provider])
        )
      )
    }

    return this.providersCache.get(channel)
  }

  async send(
    provider: InferEntityType<typeof NotificationProvider>,
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    const providerHandler = this.retrieveProviderRegistration(provider.id)
    return await providerHandler.send(notification)
  }
}
